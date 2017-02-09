"use strict";

import * as R from "ramda";
import {configInterface} from "../config/config";

import {requestService as requestServiceCurry } from "./requestService";
import {Options as requestOptions} from "request";
const Task = require("data.task");
let requestService = requestServiceCurry(Task)



export const getLongLivedAccessToken = R.curry(function(host: string, config: configInterface){
     var fbLongLivedAccessTokenURI = host.concat('/oauth/access_token?grant_type=fb_exchange_token&client_id=')
                .concat(config.getAppID)
                .concat('&client_secret=')
                .concat(config.getAppSecret)
                .concat('&fb_exchange_token=')
                .concat(config.getShortLivedAccessToken)

     var options: requestOptions = {
         uri : fbLongLivedAccessTokenURI
     };
     return requestService.request(options)
})

export const setLongLivedFBAccessToken = function(result :any){
    //TODO parse body properly to get only the token -
    socialSubscribe.configParams.setLongLivedAccessToken(result.data)
    //return updated config object
    return {sucess : true}
}

export const getUserPageDetails = R.curry(function(host: string, result: any){
    var pageDetailsAndTokensURI = host.concat("/me/accounts")
    var options = {
       uri : pageDetailsAndTokensURI,
       qs: {
                 access_token: socialSubscribe.configParams.getLongLivedAccessToken
           }
   }
    return requestService.request(options)
})

export const subscribePages = R.curry(function(host: string, result:any, subscribeAndAddWebhook){
    return new Task(function(reject:Function , resolve:Function){
        var pages = JSON.parse(result.data)["data"]
        var successAttempts = 0
        var success = false

        //for each of the page, subscribe the given app and add activity webhooks.
        pages.map(subscribeAndAddWebhook);

    })
})

export const subscribePageForApp = R.curry(function(host, page){
    var pageSubscriptionURI = host.concat("/")
                                  .concat(page.id)
                                  .concat("/subscribed_apps")
     var subscribeOptions: requestOptions = {
            method: 'POST',
            uri : pageSubscriptionURI,
            qs: {
                 access_token: page.access_token
                }
       }
     return requestService.request(subscribeOptions)
})

export const addWebhooksForPageActivity = R.curry(function(host, subscriptionResult){
    var pageActivitySubscriptionURI = host.concat("/")
                                          .concat(socialSubscribe.configParams.getAppID)
                                          .concat("/subscriptions")
    const activityOptions:requestOptions = {
        method: 'POST',
        uri : pageActivitySubscriptionURI,
        qs: {
             access_token: socialSubscribe.configParams.getAppAccessToken
            },
        form : {
               object : 'page',
               callback_url : socialSubscribe.configParams.getCallBackURL,
               fields : 'feed',
               verify_token : 'random'
               }
        }
 return requestService.request(activityOptions)
})


export const subscribeAndAddWebhook:any = R.compose(R.chain(addWebhooksForPageActivity(graphApiHost)), subscribePageForApp(graphApiHost))
