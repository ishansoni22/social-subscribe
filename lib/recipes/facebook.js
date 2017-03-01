"use strict";
const Task = require("data.task");
const R = require("ramda");
const requestService_1 = require("../services/requestService");
const requestService = requestService_1.requestService(Task);
exports.lookupAppAccessToken = (Task) => (config) => new Task((reject, resolve) => {
    config.repository.getAppAccessToken(config.appId).then(resolve, reject);
});
exports.lookUpLongLivedAccessToken = (Task) => (config) => () => new Task((reject, resolve) => {
    config.repository.getLongLivedAccessToken(config.uuid).then(resolve, reject);
});
exports.persistLongLivedAccessToken = (Task) => (config) => (longLivedAccessToken) => new Task((reject, resolve) => {
    config.repository.setLongLivedAccessToken(config.uuid, longLivedAccessToken)
        .then(resolve, reject);
});
exports.persistAppAccessToken = (Task) => (config) => (appAccessToken) => new Task((reject, resolve) => {
    config.repository.setAppAccessToken(config.appId, appAccessToken).then(resolve, reject);
});
exports.lookupPages = (Task) => (config) => () => new Task((reject, resolve) => {
    config.repository.getPages(config.uuid).then(resolve, reject);
});
exports.persistPages = (Task) => (config) => (pages) => new Task((reject, resolve) => {
    config.repository.setPages(config.uuid, pages).then(resolve, reject);
});
exports.extractLongLivedAccessTokenFromResponse = (responseString) => responseString && responseString.split("&")[0].split("=")[1];
exports.getLongLivedAccessToken = (config) => {
    const fbLongLivedAccessTokenURI = config.graphApiHost
        .concat("/oauth/access_token?grant_type=fb_exchange_token&client_id=")
        .concat(config.appId)
        .concat("&client_secret=")
        .concat(config.appSecret)
        .concat("&fb_exchange_token=")
        .concat(config.shortLivedAccessToken);
    const options = {
        uri: fbLongLivedAccessTokenURI,
    };
    return requestService(options);
};
exports.getUserPageDetails = (config) => (longLivedAccessToken) => {
    const pageDetailsAndTokensURI = config.graphApiHost.concat("/me/accounts");
    const options = {
        qs: { access_token: longLivedAccessToken },
        uri: pageDetailsAndTokensURI,
    };
    return requestService(options);
};
exports.subscribePageForApp = (config) => (page) => {
    const pageSubscriptionURI = config.graphApiHost.concat("/")
        .concat(page.id)
        .concat("/subscribed_apps");
    const subscribeOptions = {
        method: "POST",
        qs: {
            access_token: page.access_token,
        },
        uri: pageSubscriptionURI,
    };
    return requestService(subscribeOptions);
};
exports.addWebhooksForPageActivity = (config) => (appAccessToken) => {
    const pageActivitySubscriptionURI = config.graphApiHost.concat("/")
        .concat(config.appId)
        .concat("/subscriptions");
    const activityOptions = {
        form: {
            callback_url: config.callBackURL,
            fields: "feed",
            object: "page",
            verify_token: "random",
        },
        method: "POST",
        qs: {
            access_token: appAccessToken,
        },
        uri: pageActivitySubscriptionURI,
    };
    return requestService(activityOptions);
};
exports.getAppAccessToken = (config) => () => {
    const appAccessTokenURI = config.graphApiHost.concat("/oauth/access_token");
    const appAccessTokenOptions = {
        method: "GET",
        qs: {
            client_id: config.appId,
            client_secret: config.appSecret,
            grant_type: "client_credentials",
        },
        uri: appAccessTokenURI,
    };
    return requestService(appAccessTokenOptions);
};
exports.recipe = (config) => {
    const fbConfig = config;
    const persistLongLivedAccessTokenWithConfig = exports.persistLongLivedAccessToken(Task)(fbConfig);
    const getPageDetails = exports.getUserPageDetails(fbConfig);
    const lookUpLongLivedAccessTokenWithConfig = exports.lookUpLongLivedAccessToken(Task)(fbConfig);
    const subscribePage = exports.subscribePageForApp(fbConfig);
    const addWebhooksForPage = exports.addWebhooksForPageActivity(fbConfig);
    const getAppAccessTokenFn = exports.getAppAccessToken(fbConfig);
    const savePages = exports.persistPages(Task)(fbConfig);
    const getPages = exports.lookupPages(Task)(fbConfig);
    const pageIds = R.compose(R.map(R.prop("data")), R.chain(getPageDetails), R.chain(lookUpLongLivedAccessTokenWithConfig), R.chain(persistLongLivedAccessTokenWithConfig), R.map(exports.extractLongLivedAccessTokenFromResponse), exports.getLongLivedAccessToken);
    return R.compose(R.chain(addWebhooksForPage), R.map(exports.extractLongLivedAccessTokenFromResponse), R.chain(getAppAccessTokenFn), R.unnest, R.map(R.sequence(Task.of)), R.map(R.map(subscribePage)), R.chain(getPages), R.chain(savePages), pageIds)(config);
};
exports.apiCallbackHandlerFn = (config) => (request) => (response) => {
    const processPostRequest = (config) => (response) => (request) => {
        const emitActivityForSocialSubScribe = (config) => (data) => {
            const actions = new Map([
                ["status", "onPost"],
                ["post", "onPost"],
                ["comment", "onComment"]
            ]);
            const callActivity = (config) => (actions) => (change) => {
                const { item } = change.value;
                const activity = actions.has(item) && actions.get(item) || item;
                const activityInfo = {
                    from: change.value.sender_id,
                    raw: change,
                    type: item,
                };
                const configHas = R.has(R.__, config);
                const configProp = R.prop(R.__, config);
                const callAction = R.when(configHas, R.compose((activity) => R.call(activity, activityInfo), configProp));
                callAction(activity);
            };
            const entryIterator = (entry) => {
                const mergeEntryIdWithChange = (change) => Object.assign({}, change, { id: entry.id });
                const changes = R.has("changes")(entry) ? entry.changes : [];
                const publishedChanges = changes.filter((change) => change.value && change.value.published !== undefined && change.value.published || 1);
                return publishedChanges && R.map(mergeEntryIdWithChange, publishedChanges) || [];
            };
            const emitActivityForSocialSubScribe = callActivity(config)(actions);
            return R.has("entry")(data) ?
                R.forEach(R.compose(R.map(emitActivityForSocialSubScribe), entryIterator), data.entry) : null;
        };
        const emitActivityForSocialSubScribeWithConfig = emitActivityForSocialSubScribe(config);
        const body = R.prop("body", request) || {};
        const extractDataFromRequest = (request, callback) => () => {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk.toString();
            });
            request.on("end", () => {
                callback(JSON.parse(data));
            });
            return;
        };
        return R.ifElse(R.has("entry"), emitActivityForSocialSubScribeWithConfig, extractDataFromRequest(request, emitActivityForSocialSubScribeWithConfig))(body);
    };
    const executeWhenMethodIsPost = R.when(R.propEq('method', 'POST'), processPostRequest(config)(response));
    return executeWhenMethodIsPost(request);
};
exports.publishComment = (graphApiHost) => (accessToken) => (objectId) => (message) => {
    const publishCommentURI = graphApiHost.concat("/")
        .concat(objectId)
        .concat("/comments");
    const subscribeOptions = {
        method: "POST",
        qs: {
            access_token: accessToken,
        },
        form: {
            message
        },
        uri: publishCommentURI,
    };
    return requestService(subscribeOptions);
};
exports.name = "facebook";
//# sourceMappingURL=facebook.js.map