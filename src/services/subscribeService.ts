"use strict";


const Task =  require("data.task");
import * as R from "ramda";

import {IConfig} from "../config/config";

import {requestService as requestServiceCurry} from "./requestService";

import {Options as requestOptions} from "request";

const requestService = requestServiceCurry(Task);

export const getLongLivedAccessToken = (config: IConfig) => {
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
    return  requestService(options);
};

export const extractLongLivedAccessTokenFromResponse = (responseString: string) =>
    responseString.split("&")[0].split("=")[1];


// export const getUserPageDetails =  (config: IConfig) => (longLivedAccessToken: string) => {
//     const pageDetailsAndTokensURI = config.graphApiHost.concat("/me/accounts")
//     const options = {
//         qs: {access_token: longLivedAccessToken},
//         uri: pageDetailsAndTokensURI};
//     return requestService(options);
// }


//     // TODO parse body properly to get only the token -
//     socialSubscribe.configParams.setLongLivedAccessToken(result.data)
//     // return updated config object
//     return {"sucess": true};
// }
//

//
//
// export const extractPagesFromUserpageDetailsResponse = (result: any) =>
// (result && JSON.parse(result.data) && JSON.parse(result.data).data) || [];
//
// // export const subscribePages = R.curry(function(host: string, result:any, subscribeAndAddWebhook){
// //     return new Task(function(reject:Function , resolve:Function){
// //         const pages = JSON.parse(result.data)["data"]
// //         const successAttempts = 0
// //         const success = false
// //
// //         //for each of the page, subscribe the given app and add activity webhooks.
// //         pages.map(subscribeAndAddWebhook);
// //
// //     })
// // })
//
// export const subscribePageForApp = R.curry((host: string, page: any) => {
//     const pageSubscriptionURI = host.concat("/")
//         .concat(page.id)
//         .concat("/subscribed_apps");
//     const subscribeOptions: requestOptions = {
//         method: "POST",
//         qs: {
//             access_token: page.access_token,
//         },
//         uri: pageSubscriptionURI,
//     };
//     return requestService(subscribeOptions);
// });
//
//
// export const addWebhooksForPageActivity = function (config: IConfig) {
//     const pageActivitySubscriptionURI = config.graphApiHost.concat("/")
//         .concat(config.appId)
//         .concat("/subscriptions")
//     const activityOptions: requestOptions = {
//         method: "POST",
//         uri: pageActivitySubscriptionURI,
//         qs: {
//             access_token: config.repository.getAppAccessToken(config.appId)
//         },
//         form: {
//             callback_url: socialSubscribe.configParams.getCallBackURL,
//             object: "page",
//             fields: "feed",
//             verify_token: "random"
//         }
//     }
//     return requestService(activityOptions)
// };
//
//



