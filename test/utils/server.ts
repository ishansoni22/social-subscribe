/**
 * Created by bharatm on 10/02/17.
 */

import * as http from "http";


/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 */
export const createServer = (port: number) => (callback: Function) => {
    var server = http.createServer(function (request, response) {
        var data = "";

        request.on("data", function (chunk: any) {
            data += chunk;
        });

        response.writeHead(200, {"Content-Type": "application/json"});
        response.end(JSON.stringify({message: "not implemented"}));
    });

    if (port) {
        server.listen(port, callback);
    }

    return server;
};
