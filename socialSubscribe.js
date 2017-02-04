"use strict";

const EventEmitter = require('events');
const requestHelper = require('./requestHelper.js')()
const R = require('ramda')
const graphApiHost = 'https://graph.facebook.com'

class socialSubscribeClass extends EventEmitter {}

var socialSubscribe = new socialSubscribeClass()

socialSubscribe.register = function(configInterface){
    
    register(configInterface).fork((error) => socialSubscribe.emit('registerFailedEvent', error), 
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
         uri : fbLongLivedAccessTokenURI ,
         config : config
     }
    
     return requestHelper.request(options)
     
})

var setLongLivedFBAccessToken = function(body){
    //TODO parse body properly
    body.config.setLongLivedAccessToken(body.data)
    //return updated config object
    return body.config
}

var getUserPageDetails = R.curry(function(host, config){
    
    var pageDetailsAndTokensURI = host.concat("/me/accounts")
    var options = {
       uri : pageDetailsAndTokensURI,
       qs: {
                 access_token: config.getLongLivedAccessToken
           },
       config : config
       
   }
    
    return requestHelper.request(options)
})

var subscribePagesForActivity = R.curry(function(host, body){
    var pages = JSON.parse(body.data)["data"]
    //for each of the page, subscribe the given app to recieve updates on the callback url -
    //TODO
    return 1
})

var register = R.compose(R.map(subscribePagesForActivity(graphApiHost)),
                            R.chain(getUserPageDetails(graphApiHost)),
                                R.map(setLongLivedFBAccessToken),
                                    getLongLivedAccessToken(graphApiHost))

module.exports = function() {

  return socialSubscribe

}
