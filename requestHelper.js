"use strict";

const rq = require('request')
const Task = require('data.task')
const R = require('ramda')

module.exports = function(){

  var requestHelper = {

    request : function(options){
                return new Task(function(reject, resolve){
                    rq(options, function(error, response, body){
                        //if response code is in 2xx, accept, else reject this task
                        var responseCode = response.statusCode
                        if(error){
                          console.log("Error Occured while making request for uri", options.uri)
                          reject(error)                          
                        }
                        else if(responseCode >=200 && responseCode<300){
                           console.log("Reuqest to uri succedded for URI ", options.uri)
                           var result = {
                                   data : body
                               }
                               resolve(result)                            
                        }else{
                           console.log("Error Occured while making request for uri", options.uri)
                           var errorObj = {
                               status : response.statusCode,
                               error : body
                           }
                           reject(errorObj)                            
                        }
                    })
                })    
              }
  }
  return requestHelper
}
