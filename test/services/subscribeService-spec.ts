/**
 * Created by bharatm on 10/02/17.
 */


const Promise: any = require("bluebird");
import * as chai from "chai";
const R = require("ramda");
const Task = require("data.task");
const localtunnel = require('localtunnel');

// import * as sinon from "sinon";
import {
    getUserPageDetails as getUserPageDetailsCurry,
    extractLongLivedAccessTokenFromResponse,
    getLongLivedAccessToken,
    subscribePageForApp as subscribePageForAppCurry,
    addWebhooksForPageActivity as addWebhooksForPageActivityCurry,
    getAppAccessToken as getAppAccessTokenCurry,
} from "../../src/services/subscribeService";

import {
    lookUpLongLivedAccessToken as lookUpLongLivedAccessTokenCurry,
    persistLongLivedAccessToken as persistLongLivedAccessTokenCurry,
} from "../../src/services/accessTokenService";


import {createServer as createServerCurry} from "../utils/server";

import {repository} from "../utils/repository";

const localServerPort = 3050;
const createServer = createServerCurry(localServerPort);
const expect = chai.expect;

describe("Test subscribe service", function () {
    this.timeout(50000);
    let server: any;
    let tunnel: any;
    const shortLivedAccessToken = "EAADvbGAQt94BADymvRx4udMsjOHynQe6bI5Spi19cFiMZAXk0vyfTCFG8wWmUBZAvKuKh8FsbEs75m" +
        "sew4EHfaAGgXOOFmsWRkfeML3fc7vfFZCXMQh2022F8LZB2BnQXAZBXvtUP250ZBozDNFZA5yy3LAcs06m99m83EIF10oWWaknweiS5XZ" +
        "A1Fg0IgbZCVJ8ZD";
    const config = {
        appId: "263248747214814",
        appSecret: "4454810a488876bc8b716e76f8be8de2",
        callBackURL: "http://localhost:3050",
        graphApiHost: "https://graph.facebook.com",
        repository,
        shortLivedAccessToken,
    };

    before((done) => {
        server = createServer((err: Error) => {
            if (err) {
                done(err);
            }
            tunnel = localtunnel(localServerPort, (error: Error, newTunnel: any) =>  {
                if (error) {
                    done(error);
                }
                config.callBackURL = newTunnel.url;
                done();
            });

        });

    });

    after((done) => {
        tunnel.on("close", () => {
            server.close(() => done());
        });
        tunnel.close();
    });

    it("should give long lived access token", (done) => {

        const logLivedAccessToken: any = R.compose(
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);

        logLivedAccessToken(config).fork(done, (response: any) => {
            expect(response).to.be.a("string");
            done();
        });
    });

    it("should set long lived access token", (done) => {

        const persistLongLivedAccessToken = persistLongLivedAccessTokenCurry(Task)(config);

        const logLivedAccessToken: any = R.compose(
            R.chain(persistLongLivedAccessToken),
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);

        logLivedAccessToken(config).fork(done, (promise: any) => {
            promise.then((persisted: boolean) => {
                expect(persisted).to.be.true;
                done();
            });
        });
    });

    it("should get pageIds", (done) => {

        const persistLongLivedAccessToken = persistLongLivedAccessTokenCurry(Task)(config);
        const getPageDetails = getUserPageDetailsCurry(config);
        const lookUpLongLivedAccessToken = lookUpLongLivedAccessTokenCurry(Task)(config);

        const getPageIds: any = R.compose(
            R.map(R.prop("data")),
            R.chain(getPageDetails),
            R.chain(lookUpLongLivedAccessToken),
            R.chain(persistLongLivedAccessToken),
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);

        // pages_show_list
        // manage pages

        getPageIds(config).fork(done, (pageIds: any) => {
            expect(pageIds).to.be.not.empty;
            expect(pageIds).to.be.instanceof(Array);
            done();
        });
    });

    it("should get register app for all the pages", (done) => {

        const persistLongLivedAccessToken = persistLongLivedAccessTokenCurry(Task)(config);
        const getPageDetails = getUserPageDetailsCurry(config);
        const lookUpLongLivedAccessToken = lookUpLongLivedAccessTokenCurry(Task)(config);
        const subscribePageForApp = subscribePageForAppCurry(config);

        const pageIds: any = R.compose(
            R.map(R.prop("data")),
            R.chain(getPageDetails),
            R.chain(lookUpLongLivedAccessToken),
            R.chain(persistLongLivedAccessToken),
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);

        const registerApp: any = R.compose(
            R.unnest,
            R.map(R.sequence(Task.of)),
            R.map(R.map(subscribePageForApp)),
            pageIds);

        registerApp(config).fork(done, (pageIds: any) => {
            expect(pageIds).to.be.not.empty;
            expect(pageIds).to.be.instanceof(Array);
            done();
        });
    });

    it.only("should add callback for page activity", (done) => {

        const persistLongLivedAccessToken = persistLongLivedAccessTokenCurry(Task)(config);
        const getPageDetails = getUserPageDetailsCurry(config);
        const lookUpLongLivedAccessToken = lookUpLongLivedAccessTokenCurry(Task)(config);
        const subscribePageForApp = subscribePageForAppCurry(config);
        const addWebhooksForPageActivity = addWebhooksForPageActivityCurry(config);
        const getAppAccessToken = getAppAccessTokenCurry(config);

        const pageIds: any = R.compose(
            R.map(R.prop("data")),
            R.chain(getPageDetails),
            R.chain(lookUpLongLivedAccessToken),
            R.chain(persistLongLivedAccessToken),
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);

        const registerAppUrlForPageActivity: any = R.compose(
            R.chain(addWebhooksForPageActivity),
            R.map(extractLongLivedAccessTokenFromResponse),
            R.chain(getAppAccessToken),
            R.unnest,
            R.map(R.sequence(Task.of)),
            R.map(R.map(subscribePageForApp)),
            pageIds);

        registerAppUrlForPageActivity(config).fork(done, (obj: any) => {
            expect(obj).to.be.not.empty(obj);
            expect(obj).to.haveOwnProperty("success");
            expect(obj.success).to.to.be.true;
            done();
        });
    });

});
