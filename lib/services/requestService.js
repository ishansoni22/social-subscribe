"use strict";
const rq = require("request");
const R = require("ramda");
exports.requestService = (Task) => (options) => {
    return new Task((reject, resolve) => {
        options = R.assoc("json", true, options);
        rq(options, (error, response, body) => {
            const responseCode = response.statusCode;
            if (error) {
                reject(error);
            }
            else if (responseCode >= 200 && responseCode < 300) {
                resolve(body);
            }
            else {
                const errorObj = { status: response.statusCode, error: body };
                reject(errorObj);
            }
        });
    });
};
//# sourceMappingURL=requestService.js.map