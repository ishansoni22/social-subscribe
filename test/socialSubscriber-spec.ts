const MockReq: any = require('mock-req');
const MockRes: any = require('mock-res');

const Promise: any = require("bluebird");
import * as chai from "chai";
const R = require("ramda");
const Task = require("data.task");
const localtunnel = require('localtunnel');

import {repository} from "./utils/repository";
import {createServer as createServerCurry} from "./utils/server";
// import {
//     lookUpLongLivedAccessToken as lookUpLongLivedAccessTokenCurry,
// } from "../src/services/accessTokenService";
import {SocialSubscribe, IActivityInfo} from "../src/index";
// import {
//     getUserPageDetails as getUserPageDetailsCurry,
//     doFbPostOnPage as doFbPostOnPageCurry,
// } from "../src/services/subscribeService";

const localServerPort = 3050;
const createServer = createServerCurry(localServerPort);
const expect = chai.expect;

describe("Test subscribe service", function () {
    this.timeout(50000);
    let server: any;
    let tunnel: any;
    const shortLivedAccessToken = "EAADvbGAQt94BAA0bov0DedHXaprT9pqKXgx6oiHnv0OIouBemtLLRb06WSBiLLPouO7BtOfgTZC30" +
        "BUU0ZCzhqf8qNwj5cqtDceictPw6Vr8n8LOCKUBpl6LDkJ1aLB7YCtTH6MsVMu0Npy3IwYJk1b75WQnulo1ivOC11ZAxX9ZC5WYo62MgSh" +
        "W2F0HRZAMZD";
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
            tunnel = localtunnel(localServerPort, (error: Error, newTunnel: any) => {
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

    it("should subscribe to the facebook pages", (done) => {
        const socialSubscribe = new SocialSubscribe(config);
        socialSubscribe.on("success", (obj: any) => {
            expect(obj).to.be.not.empty;
            expect(obj).to.haveOwnProperty("success");
            expect(obj.success).to.to.be.true;
            done();

            // const getPageDetails = getUserPageDetailsCurry(config);
            // const doFbPostOnPage = doFbPostOnPageCurry(config)("This is a test post");
            // const lookUpLongLivedAccessToken = lookUpLongLivedAccessTokenCurry(Task)(config);
            //
            //
            // const pageIds: any = R.compose(
            //     R.map(R.prop("data")),
            //     R.chain(getPageDetails),
            //     lookUpLongLivedAccessToken,
            //     );
            //
            //
            //
            // const doFbPostOnPageAccessToken = R.compose(
            //     R.map(doFbPostOnPage),
            //     lookUpLongLivedAccessToken);
            //
            //
            // const doFbPost = R.compose(
            //
            //     R.unnest,
            //     R.map((R.sequence(Task.of))),
            //     R.map(
            //         R.map(
            //             //=> pageId
            //             doFbPostOnPageAccessToken
            //         )
            //     ),
            //     pageIds);

            // pages_show_list
            // manage pages
            // publish_actions

            // const temp: any = doFbPost();
            // doFbPost(config).fork(done, (pageIds: any) => {
            //     pageIds[0]();
            //     expect(pageIds).to.be.not.empty;
            //     expect(pageIds).to.be.instanceof(Array);
            //
            //     done();
            // });

        });

        socialSubscribe.on("error", done);

        server.on("request", socialSubscribe.apiCallback);

        socialSubscribe.start();

    });

    it("should emit proper events for post", (done) => {
        const socialSubscribe = new SocialSubscribe(config);

        const res = new MockRes(function () {
            console.log('Response finished');
        });
        const req = new MockReq({
            method: "POST",
        });

        const requestObj = {
            entry: [
                {
                    changes: [
                        {
                            field: "feed",
                            value: {
                                comment_id: "266831690420445_268791033557844",
                                created_time: 1487572270,
                                item: "comment",
                                message: "#newcomment fresh comment",
                                parent_id: "265660650537549_266831690420445",
                                post_id: "265660650537549_266831690420445",
                                sender_id: 265660650537549,
                                sender_name: "JS Artist",
                                verb: "add",
                            },
                        },
                    ],
                    id: "265660650537549",
                    time: 1487572270,
                },
            ],
            object: "page",
        };
        socialSubscribe.on("post", (activityInfo: IActivityInfo) => {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("post");
            expect(activityInfo.raw).to.be.equal(requestObj.entry[0].changes[0].value);
            done();
        });


        socialSubscribe.apiCallback(req, res, () => done);
        const requestString = JSON.stringify(requestObj);
        req.write(new Buffer(requestString));
        req.end();
    });

    it.only("should emit proper events for comment", (done) => {
        const socialSubscribe = new SocialSubscribe(config);

        const res = new MockRes(function () {
            console.log('Response finished');
        });
        const req = new MockReq({
            method: "POST",
        });

        const requestObj = {
            entry: [
                {
                    changes: [
                        {
                            field: "feed",
                            value: {
                                comment_id: "266831690420445_268791033557844",
                                created_time: 1487572270,
                                item: "comment",
                                message: "#newcomment fresh comment",
                                parent_id: "265660650537549_266831690420445",
                                post_id: "265660650537549_266831690420445",
                                sender_id: 265660650537549,
                                sender_name: "JS Artist",
                                verb: "add",
                            }
                        }
                    ],
                    id: "265660650537549",
                    time: 1487572270
                }
            ],
            object: "page"
        };
        socialSubscribe.on("comment", (activityInfo: IActivityInfo) => {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("comment");
            // expect(activityInfo.raw).to.be.equal(requestObj.entry[0].changes[0].value);
            done();
        });


        socialSubscribe.apiCallback(req, res, () => done);
        const requestString = JSON.stringify(requestObj);
        req.write(new Buffer(requestString));
        req.end();
    });

});
