"use strict";

//TODO Refactor code to use ramda properly after the first sign you see things working a little ;)

const EventEmitter = require('events');
const requestHelper = require('./requestHelper.js')()
const R = require('ramda')
const graphApiHost = 'https://graph.facebook.com'

class socialSubscribeClass extends EventEmitter {}

var socialSubscribe = new socialSubscribeClass()

socialSubscribe.register = function(config){

  var shortLivedAccessToken = config.getShortLivedAccessToken
  var appID = config.getAppID
  var appSecret = config.getAppSecret
  //get long lived access token
  var options = {}
  var fbURI = graphApiHost.concat('/oauth/access_token?grant_type=fb_exchange_token&client_id=')
                .concat(appID)
                .concat('&client_secret=')
                .concat(appSecret)
                .concat('&fb_exchange_token=')
                .concat(shortLivedAccessToken)

 var options = {
   uri : fbURI
 }

 requestHelper.request(options).then(function(res) {
   //TODO save the long lived access token to config object the other app is providing!
   //config.setLongLivedAccessToken(res)





 }).catch(function(err){
   console.log(err.message)
   console.log(err.statusCode)

 })

}


module.exports = function() {

  return socialSubscribe

}
