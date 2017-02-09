"use strict";
import * as R from "ramda";
import * as rq from "request";
export const requestService = R.curry((Task:any, options: rq.Options) => {
    return new Task(function(reject: any, resolve: any) {
        rq(options, function(error, response, body) {
            //if response code is in 2xx, accept, else reject this task
            var responseCode = response.statusCode
            if (error) {
                reject(error)
            }
            else if (responseCode >= 200 && responseCode < 300) {
                var result = {
                    data: body
                }
                resolve(result)
            } else {
                var errorObj = {
                    status: response.statusCode,
                    error: body
                }
                reject(errorObj)
            }
        })
    })
});
