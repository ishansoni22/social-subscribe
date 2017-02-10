"use strict";

import * as rq from "request";
import R = require("ramda")

export const requestService = (Task: any) => (options: rq.Options) => {

    return new Task((reject: any, resolve: any) => {
        options = R.assoc("json", true, options);

        rq(options, (error, response, body) => {
            // if response code is in 2xx, accept, else reject this task
            const responseCode = response.statusCode;
            if (error) {
                reject(error);
            } else if (responseCode >= 200 && responseCode < 300) {
                resolve(body);
            } else {
                const errorObj = {status: response.statusCode, error: body};
                reject(errorObj);
            }
        });
    });
};
