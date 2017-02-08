"use strict";

const EventEmitter = require('events');
const requestHelper = require('./requestHelper.js')()
const R = require('ramda')
const graphApiHost = 'https://graph.facebook.com'
const Task = require('data.task')

class socialSubscribeClass extends EventEmitter {}

var socialSubscribe = new socialSubscribeClass()

socialSubscribe.register = function(configInterface){
    socialSubscribe['configParams'] = configInterface
    register(socialSubscribe.configParams).fork((error) => socialSubscribe.emit('registerFailedEvent', error),
                           (result) => socialSubscribe.emit('registerSuccessEvent', result))
}

var getLongLivedAccessToken = R.curry(function(host, config){
     var fbLongLivedAccessTokenURI = host.concat('/oauth/access_token?grant_type=fb_exchange_token&client_id=')
                .concat(config.getAppID)
                .concat('&client_secret=')
                .concat(config.getAppSecret)
                .concat('&fb_exchange_token=')
                .concat(config.getShortLivedAccessToken)

     var options = {
         uri : fbLongLivedAccessTokenURI
     }
     return requestHelper.request(options)
})

var setLongLivedFBAccessToken = function(result){
    //TODO parse body properly to get only the token -
    socialSubscribe.configParams.setLongLivedAccessToken(result.data)
    //return updated config object
    return {sucess : true}
}

var getUserPageDetails = R.curry(function(host, result){
    var pageDetailsAndTokensURI = host.concat("/me/accounts")
    var options = {
       uri : pageDetailsAndTokensURI,
       qs: {
                 access_token: socialSubscribe.configParams.getLongLivedAccessToken
           }
   }
    return requestHelper.request(options)
})

var subscribePages = R.curry(function(host, result){
    return new Task(function(reject, resolve){
        var pages = JSON.parse(result.data)["data"]
        var successAttempts = 0
        var success = false

        //for each of the page, subscribe the given app and add activity webhooks.
        pages.map(function(page){
            subscribeAndAddWebhook(page).fork((error) => reject(error), (result) => {successAttempts ++;
                                                                                           if(successAttempts === pages.length){
                                                                                                 resolve({success : true})
                                                                                             }
                                                                                          }
                                             )
        })

    })
})

var subscribePageForApp = R.curry(function(host, page){
    var pageSubscriptionURI = host.concat("/")
                                  .concat(page.id)
                                  .concat("/subscribed_apps")
     var subscribeOptions = {
            method: 'POST',
            uri : pageSubscriptionURI,
            qs: {
                 access_token: page.access_token
                }
       }
     return requestHelper.request(subscribeOptions)
})

var addWebhooksForPageActivity = R.curry(function(host, subscriptionResult){
    var pageActivitySubscriptionURI = host.concat("/")
                                          .concat(socialSubscribe.configParams.getAppID)
                                          .concat("/subscriptions")
    var activityOptions = {
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
 return requestHelper.request(activityOptions)
})

var subscribeAndAddWebhook = R.compose(R.chain(addWebhooksForPageActivity(graphApiHost)), subscribePageForApp(graphApiHost))

var register = R.compose(R.chain(subscribePages(graphApiHost)),
                            R.chain(getUserPageDetails(graphApiHost)),
                                R.map(setLongLivedFBAccessToken),
                                    getLongLivedAccessToken(graphApiHost))

module.exports = function() {
  return socialSubscribe
}
