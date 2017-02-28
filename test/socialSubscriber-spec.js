"use strict";
var MockReq = require('mock-req');
var MockRes = require('mock-res');
var Promise = require("bluebird");
var chai = require("chai");
var R = require("ramda");
var Task = require("data.task");
var localtunnel = require('localtunnel');
var repository_1 = require("./utils/repository");
var server_1 = require("./utils/server");
// import {
//     lookUpLongLivedAccessToken as lookUpLongLivedAccessTokenCurry,
// } from "../src/services/accessTokenService";
var index_1 = require("../src/index");
// import {
//     getUserPageDetails as getUserPageDetailsCurry,
//     doFbPostOnPage as doFbPostOnPageCurry,
// } from "../src/services/subscribeService";
var localServerPort = 3050;
var createServer = server_1.createServer(localServerPort);
var expect = chai.expect;
describe("Test subscribe service", function () {
    this.timeout(50000);
    var server;
    var tunnel;
    var shortLivedAccessToken = "EAADvbGAQt94BAA0bov0DedHXaprT9pqKXgx6oiHnv0OIouBemtLLRb06WSBiLLPouO7BtOfgTZC30" +
        "BUU0ZCzhqf8qNwj5cqtDceictPw6Vr8n8LOCKUBpl6LDkJ1aLB7YCtTH6MsVMu0Npy3IwYJk1b75WQnulo1ivOC11ZAxX9ZC5WYo62MgSh" +
        "W2F0HRZAMZD";
    var config = {
        "uuid": "123456789",
        appId: "263248747214814",
        appSecret: "4454810a488876bc8b716e76f8be8de2",
        callBackURL: "http://localhost:3050",
        graphApiHost: "https://graph.facebook.com",
        repository: repository_1.repository,
        shortLivedAccessToken: shortLivedAccessToken,
        socialNetwork: "facebook",
    };
    before(function (done) {
        server = createServer(function (err) {
            if (err) {
                done(err);
            }
            tunnel = localtunnel(localServerPort, function (error, newTunnel) {
                if (error) {
                    done(error);
                }
                config.callBackURL = newTunnel.url;
                done();
            });
        });
    });
    after(function (done) {
        tunnel.on("close", function () {
            server.close(function () { return done(); });
        });
        tunnel.close();
    });
    it("should subscribe to the facebook pages", function (done) {
        var socialSubscribe = new index_1.SocialSubscribe(config);
        socialSubscribe.on("success", function (obj) {
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
        server.on("request", index_1.apiCallback);
        socialSubscribe.start();
    });
    it("should emit proper events for post", function (done) {
        var res = new MockRes(function () {
            console.log('Response finished');
        });
        var req = new MockReq({
            method: "POST",
        });
        var requestObj = {
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
        var onPost = function (activityInfo) {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("post");
            expect(activityInfo.raw).to.be.equal(requestObj.entry[0].changes[0].value);
            done();
        };
        index_1.apiCallback(req, res, function () { return done; }, { onPost: onPost }, config.socialNetwork);
        var requestString = JSON.stringify(requestObj);
        req.write(new Buffer(requestString));
        req.end();
    });
    it.only("should emit proper events for comment", function (done) {
        var res = new MockRes(function () {
            console.log('Response finished');
        });
        var req = new MockReq({
            method: "POST",
        });
        var requestObj = {
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
        var onComment = function (activityInfo) {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("comment");
            // expect(activityInfo.raw).to.be.equal(requestObj.entry[0].changes[0].value);
            done();
        };
        index_1.apiCallback(req, res, function () { return done; }, { onComment: onComment }, config.socialNetwork);
        var requestString = JSON.stringify(requestObj);
        req.write(new Buffer(requestString));
        req.end();
    });
});
