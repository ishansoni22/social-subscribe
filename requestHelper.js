"use strict";

const rq = require('request')
const Task = require('data.task')
const R = require('ramda')

var hasError = R.has('error')

module.exports = function(){

  var requestHelper = {

    request : function(options){
                return new Task(function(reject, resolve){
                    rq(options, function(error, response, body){
                        if(error){
                            console.log("Error Occured while making a request for options", options, error)
                            reject(error)
                        } else {
                           if(hasError(body)){
                               console.log("Error Occured while making a request for options", options, body.error)
                               reject(error)
                           } else {
                               var body = {
                                   data : body,
                                   config : options.config
                               }
                               resolve(body)
                           }
                        }
                        
                    })
                })    
            
              }

  }


  return requestHelper
}
