/**
 * Created by bharatm on 10/02/17.
 */


const Promise: any = require("bluebird");
import * as chai from "chai";
import * as R from "ramda";
// import * as sinon from "sinon";
import {getLongLivedAccessToken,
    extractLongLivedAccessTokenFromResponse}
    from "../../src/services/subscribeService";
import {persistLongLivedAccessToken as persistLongLivedAccessTokenCurry} from "../../src/services/accessTokenService";


import {IConfig} from "../../src/config/config";
import {createServer as createServerCurry} from "../utils/server";

import {repository} from "../utils/repository";

const createServer = createServerCurry(3050);
const expect = chai.expect;

describe("Test subscribe service", function () {
    this.timeout(50000);
    let server: any;
    before((done) => {
        server = createServer((err: Error) => {
            if (err) throw "Could not create server";
            done();
        });
    });

    after((done) => {
        server.close(() => done());
    });

    it("should give long lived access token", (done) => {
        const shortLivedAccessToken = "EAADvbGAQt94BAP9BS3bGCaHWoc5escF8iyZB60wGIGtgv330PFlJRQAaWakuMLQLAy5KgqK3A" +
            "sUsu6cWZABNwuUB24dsc97GKbiYrrnBzuSANhTf54x3dUDfkm3sfQMZAIIvWLZBAsBT9yRXAn7ZChYgSzjuHKyrzSlt2XU3UJUNZ" +
            "CPn2iEwnjZB18cewGD3OEZD";
        const config = {
            appId: "263248747214814",
            appSecret: "4454810a488876bc8b716e76f8be8de2",
            callBackURL: "http://localhost:3050",
            graphApiHost: "https://graph.facebook.com",
            repository,
            shortLivedAccessToken,
        };
        const logLivedAccessToken: any = R.compose(
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);

        logLivedAccessToken(config).fork(done, (response: any) => {
            expect(response).to.be.a("string");
            done();
        });
    });

    it("should set long lived access token", (done) => {
        const shortLivedAccessToken = "EAADvbGAQt94BAP9BS3bGCaHWoc5escF8iyZB60wGIGtgv330PFlJRQAaWakuMLQLAy5KgqK3A" +
            "sUsu6cWZABNwuUB24dsc97GKbiYrrnBzuSANhTf54x3dUDfkm3sfQMZAIIvWLZBAsBT9yRXAn7ZChYgSzjuHKyrzSlt2XU3UJUNZ" +
            "CPn2iEwnjZB18cewGD3OEZD";
        const config = {
            appId: "263248747214814",
            appSecret: "4454810a488876bc8b716e76f8be8de2",
            callBackURL: "http://localhost:3050",
            graphApiHost: "https://graph.facebook.com",
            repository,
            shortLivedAccessToken,
        };


        const persistLongLivedAccessToken = persistLongLivedAccessTokenCurry(config);

        const logLivedAccessToken: any = R.compose(
            R.map(persistLongLivedAccessToken),
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);


        logLivedAccessToken(config).fork(done, (promise: any) => {
            promise.then((persisted: boolean) => {
                expect(persisted).to.be.true;
                done();
            });
        });
    });
});
