"use strict";
const Task = require("data.task");
const requestService_1 = require("./requestService");
const requestService = requestService_1.requestService(Task);
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
exports.extractLongLivedAccessTokenFromResponse = (responseString) => responseString && responseString.split("&")[0].split("=")[1];
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
exports.doFbPostOnPage = (config) => (message) => (longLivedAccessToken) => (page) => {
    const fbPostOnPageURI = config.graphApiHost.concat("/")
        .concat(page.id)
        .concat("/feed");
    const fbPostOnPageOptions = {
        method: "POST",
        qs: {
            message,
            access_token: longLivedAccessToken,
        },
        uri: fbPostOnPageURI,
    };
    return requestService(fbPostOnPageOptions);
};
//# sourceMappingURL=subscribeService.js.map