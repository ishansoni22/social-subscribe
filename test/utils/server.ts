/**
 * Created by bharatm on 10/02/17.
 */

import * as http from "http";
import * as url from "querystring";


/**
 * Creates the server for the pinpoint web service
 * @param {int} port: Port for the server to run on
 */
export const createServer = (port: number) => (callback: Function) => {
    const server = http.createServer(function (request, response) {
        let data = "";

        request.on("data", (chunk: any) => {
            data += chunk;
        });
        response.writeHead(200, {"Content-Type": "application/text"});

        let params: any = {};
        if (request.method === "GET") {
            params = url.parse(request.url);
        }

        response.end(params["hub.challenge"]);
    });

    if (port) {
        server.listen(port, callback);
    }

    return server;
};
