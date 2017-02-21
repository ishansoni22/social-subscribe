"use strict";

const Task = require("data.task");

import {IConfig} from "../config/config";

import {requestService as requestServiceCurry} from "./requestService";

import {Options as requestOptions} from "request";

const requestService = requestServiceCurry(Task);

export const getLongLivedAccessToken = (config: IConfig): any => {
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

export const extractLongLivedAccessTokenFromResponse = (responseString: string): string =>
responseString && responseString.split("&")[0].split("=")[1];

export const getUserPageDetails = (config: IConfig) => (longLivedAccessToken: string): any => {
    const pageDetailsAndTokensURI = config.graphApiHost.concat("/me/accounts");
    const options = {
        qs: {access_token: longLivedAccessToken},
        uri: pageDetailsAndTokensURI,
    };
    return requestService(options);
};


export const subscribePageForApp = (config: IConfig) => (page: any): any => {
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

export const doFbPostOnPage = (config: IConfig) =>
    (message: string) =>
        (longLivedAccessToken: string) =>
            (page: any) => {
                const fbPostOnPageURI = config.graphApiHost.concat("/")
                    .concat(page.id)
                    .concat("/feed");
                const fbPostOnPageOptions: requestOptions = {
                    method: "POST",
                    qs: {
                        message,
                        access_token: longLivedAccessToken,
                    },
                    uri: fbPostOnPageURI,
                };
                return requestService(fbPostOnPageOptions);

            };
