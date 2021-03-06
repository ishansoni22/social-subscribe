/**
 * Created by bharatm on 27/02/17.
 */


import {IncomingMessage} from "http";
const Task = require("data.task");
import {ITask, IRecipe} from "../index";
const R = require("ramda");

import {requestService as requestServiceCurry} from "../services/requestService";
import {Options as requestOptions} from "request";

const requestService = requestServiceCurry(Task);

import {IRepository, IConfig, ICallbackConfig} from "../config/config";
import {apiCallbackHandler} from "./recipe";

export interface IFbConfig extends IConfig {
    repository: IFbRepository;
}

export interface IValue {
    item: string;
    sender_name: string;
    sender_id: number;
    post_id: string;
    verb: string;
    published: boolean;
    created_time: number;
    message: string;
    comment_id: string,
    parent_id: string,
}
export interface IChange {
    field: string;
    value: IValue;
}
export interface IEntry {
    changes: IChange[];
    id: string;
    time: number;
}

export interface IActivityInfo {
    from: number;
    raw: IChange;
    type: string;
}

export interface IPage {
    access_token: string;
    category: string;
    name: string;
    id: string;
    perms: Array<string>;
}

export interface IFbCallbackConfig extends ICallbackConfig {
    onComment?: (activityInfo: IActivityInfo) => void;
    onPost?: (activityInfo: IActivityInfo) => void;
    onActivity?: (activityInfo: IActivityInfo) => void;
    filter?: (activityInfo: IActivityInfo) => boolean;
}

export interface IFbRepository extends IRepository {
    getLongLivedAccessToken(uuid: string): PromiseLike<string>;
    getAppAccessToken(appId: string): PromiseLike<string>;
    setLongLivedAccessToken(uuid: string, longLivedAccessToken: string): PromiseLike<boolean>;
    setAppAccessToken(appId: string, appAccessToken: string): PromiseLike<boolean>;
    setPages(uuid: string, pages: Array<IPage>): PromiseLike<boolean>;
    getPages(uuid: string): PromiseLike<Array<IPage>>;
}


const lookupAppAccessToken = (Task: any) => (config: IFbConfig): ITask =>
    new Task((reject: any, resolve: any) => {
        config.repository.getAppAccessToken(config.appId).then(resolve, reject);
    });


export const lookUpLongLivedAccessToken = (Task: any) => (config: IFbConfig) => (): any =>
    new Task((reject: any, resolve: any) => {
        config.repository.getLongLivedAccessToken(config.uuid).then(resolve, reject);
    });

export const persistLongLivedAccessToken = (Task: any) => (config: IFbConfig): any =>
    (longLivedAccessToken: string): any =>
        new Task((reject: any, resolve: any) => {
            config.repository.setLongLivedAccessToken(config.uuid, longLivedAccessToken)
                .then(resolve, reject);
        });

export const persistAppAccessToken = (Task: any) => (config: IFbConfig) => (appAccessToken: string) =>
    new Task((reject: any, resolve: any) => {
        config.repository.setAppAccessToken(config.appId, appAccessToken).then(resolve, reject)
    });


export const lookupPages = (Task: any) => (config: IFbConfig) => (): PromiseLike<Array<IPage>> =>
    new Task((reject: any, resolve: any) => {
        config.repository.getPages(config.uuid).then(resolve, reject);
    })
export const persistPages = (Task: any) => (config: IFbConfig) => (pages: Array<IPage>) =>
    new Task((reject: any, resolve: any) => {
        config.repository.setPages(config.uuid, pages).then(resolve, reject);
    })

export const extractLongLivedAccessTokenFromResponse = (responseString: string): string =>
responseString && responseString.split("&")[0].split("=")[1];

export interface IRequestLongLivedAccessTokenConfig {
    graphApiHost: string;
    appId: string;
    appSecret: string
    shortLivedAccessToken: string;
}

export const getLongLivedAccessTokenFromShotLivedToken = (config: IRequestLongLivedAccessTokenConfig) => {
    const fbLongLivedAccessTokenURI = config.graphApiHost
        .concat("/oauth/access_token?grant_type=fb_exchange_token&client_id=")
        .concat(config.appId)
        .concat("&client_secret=")
        .concat(config.appSecret)
        .concat("&fb_exchange_token=")
        .concat(config.shortLivedAccessToken);

    const options: requestOptions = {
        uri: fbLongLivedAccessTokenURI,
    };
    return requestService(options);
};

export const getLongLivedAccessToken = (config: IConfig): any => {
    const {graphApiHost, appId, appSecret, shortLivedAccessToken} = config;
    const requestLongLivedAccessTokenConfig = {graphApiHost, appId, appSecret, shortLivedAccessToken};
    return getLongLivedAccessTokenFromShotLivedToken(requestLongLivedAccessTokenConfig)
};


export const getUserPageDetails = (config: IConfig) => (longLivedAccessToken: string): any => {
    const pageDetailsAndTokensURI = config.graphApiHost.concat("/me/accounts");
    const options = {
        qs: {access_token: longLivedAccessToken},
        uri: pageDetailsAndTokensURI,
    };
    return requestService(options);
};


export const subscribePageForApp = (config: IConfig) => (page: IPage): any => {
    const pageSubscriptionURI = config.graphApiHost.concat("/")
        .concat(page.id)
        .concat("/subscribed_apps");
    const subscribeOptions: requestOptions = {
        method: "POST",
        qs: {
            access_token: page.access_token,
        },
        uri: pageSubscriptionURI,
    };
    return requestService(subscribeOptions);
};

export const addWebhooksForPageActivity = (config: IConfig) => (appAccessToken: string): any => {
    const pageActivitySubscriptionURI = config.graphApiHost.concat("/")
        .concat(config.appId)
        .concat("/subscriptions")
    const activityOptions: requestOptions = {
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

export const getAppAccessToken = (config: IConfig) => (): any => {
    const appAccessTokenURI = config.graphApiHost.concat("/oauth/access_token");
    const appAccessTokenOptions: requestOptions = {
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

export const recipe = (config: IConfig): ITask => {
    const fbConfig = config as any as IFbConfig;

// @todo: Move recipe to separate repository
    const persistLongLivedAccessTokenWithConfig = persistLongLivedAccessToken(Task)(fbConfig);
    const getPageDetails = getUserPageDetails(fbConfig);
    const lookUpLongLivedAccessTokenWithConfig = lookUpLongLivedAccessToken(Task)(fbConfig);
    const subscribePage = subscribePageForApp(fbConfig);
    const addWebhooksForPage = addWebhooksForPageActivity(fbConfig);
    const getAppAccessTokenFn = getAppAccessToken(fbConfig);
    const savePages = persistPages(Task)(fbConfig);
    const getPages = lookupPages(Task)(fbConfig);

    const pageIds: any = R.compose(
        R.map(R.prop("data")),
        R.chain(getPageDetails),
        R.chain(lookUpLongLivedAccessTokenWithConfig),
        R.chain(persistLongLivedAccessTokenWithConfig),
        R.map(extractLongLivedAccessTokenFromResponse),
        getLongLivedAccessToken);

    return R.compose(
        R.chain(addWebhooksForPage),
        R.map(extractLongLivedAccessTokenFromResponse),
        R.chain(getAppAccessTokenFn),
        R.unnest,
        R.map(R.sequence(Task.of)),
        R.map(R.map(subscribePage)),
        R.chain(getPages),
        R.chain(savePages),
        pageIds
    )(config);

};


export const apiCallbackHandlerFn: apiCallbackHandler = (config: IFbCallbackConfig) =>
    (callback: (data: any) => void) => {

        const actions: Map<string, string> = new Map([
            ["status", "onPost"],
            ["post", "onPost"],
            ["comment", "onComment"]
        ]);

        const configHas = R.has(R.__, config);
        const configProp = R.prop(R.__, config);


        const callAction = (activityInfo: IActivityInfo) =>
            R.when(configHas, R.compose((activity: Function) => R.call(activity, activityInfo), configProp));

        const getActivityFromChange = (actions: Map<string, string>) => (item: string) =>
            actions.has(item) ? actions.get(item) : item;

        const getActivityFromChangeWithActions = getActivityFromChange(actions);

        const emitActivityForSocialSubScribe = (callback: Function) => (body: any) => R.when(
            R.has("entry"),
            R.compose(
                () => callback(body),
                R.map(
                    R.converge(
                        (activity: string, activityInfo: IActivityInfo) => {

                            const callActionWithActivityInfo = callAction(activityInfo);

                            R.when(callActionWithActivityInfo,
                                () => callActionWithActivityInfo(activity)
                            )("filter");

                        },
                        [
                            (change: IChange): string => getActivityFromChangeWithActions(change.value.item),
                            (change: IChange): IActivityInfo => {

                                return {
                                    from: change.value.sender_id,
                                    raw: change,
                                    type: change.value.item
                                }
                            }

                        ])
                ),
                R.chain(
                    R.converge(
                        (id: string, changes: Array<IChange>) => R.map(R.assoc("id", id))(changes),
                        [R.prop("id"),
                            R.compose(
                                R.filter(
                                    R.propSatisfies(
                                        (value: any) => value.published !== undefined && value.published || 1
                                        , 'value')),
                                R.prop("changes")
                            )]
                    )
                ),
                R.prop("entry"))
        )(body);

        const extractDataFromRequest = (callback: (data: any) => void) => (request: IncomingMessage) => {
            let data: string = "";
            request.on("data", (chunk: any) => {
                data += chunk.toString();

            });
            request.on("end", () => {
                callback(JSON.parse(data))
            });
            return;
        };

        const emitActivityForSocialSubScribeWithCallback = emitActivityForSocialSubScribe(callback);

        const processPostRequest = R.ifElse(R.has("body"),
            R.compose(emitActivityForSocialSubScribeWithCallback, R.prop("body")),
            extractDataFromRequest(emitActivityForSocialSubScribeWithCallback)
        );

        return R.when(R.propEq('method', 'POST'), processPostRequest);

    };

export const publishComment = (graphApiHost: string) =>
    (accessToken: string) =>
        (objectId: string) =>
            (message: string) => {
                const publishCommentURI = graphApiHost.concat("/")
                    .concat(objectId)
                    .concat("/comments");
                const subscribeOptions: requestOptions = {
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

export const isPageSubscriptionAliveApiCall =
    (graphApiHost: string, objectId: string, pageAccessToken: string): ITask => {

    const isPageSubscriptionAliveURI = graphApiHost
        .concat("/")
        .concat(objectId)
        .concat("/subscribed_apps")


    const options: requestOptions = {
        method: "GET",
        qs: {
            access_token: pageAccessToken
        },
        uri: isPageSubscriptionAliveURI,
    };

    return requestService(options);

};

export const name = "facebook";
