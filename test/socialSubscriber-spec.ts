
const MockReq: any = require('mock-req');
const MockRes: any = require('mock-res');


import * as chai from "chai";
import {IActivityInfo} from "../src/recipes/facebook";
const localtunnel = require('localtunnel');

import {repository} from "./utils/repository";
import {createServer as createServerCurry} from "./utils/server";
import {SocialSubscribe, apiCallback} from "../src/index";
import {IncomingMessage} from "http";


const localServerPort = 3050;
const createServer = createServerCurry(localServerPort);
const expect = chai.expect;

describe("Test subscribe service", function () {
    this.timeout(50000);
    let server: any;
    let tunnel: any;
    const shortLivedAccessToken = "EAADvbGAQt94BAAiHuOpqjnLCIMA6CqRlqQackmdAmMvkd7LngYMpN8oybY7hSPFMrlw" +
        "eIXYatkzpq7li2TgpBugYedBnyO3QuCKc9zwTFf0aY1dlb6xnIdbXwEC5QASx9JfhM9HyQBXMlOvo2Ilgy9mCDU6YZCrQ9cZAs" +
        "XRM89ThqmsEJNq9MJB8f8ZAnMZD";
    const config = {
        uuid: "123456789",
        appId: "263248747214814",
        appSecret: "4454810a488876bc8b716e76f8be8de2",
        callBackURL: "http://localhost:3050",
        graphApiHost: "https://graph.facebook.com",
        repository,
        shortLivedAccessToken,
        socialNetwork: "facebook",
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
            expect(obj.success).to.be.true;
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

        const onPost = (activityInfo: IActivityInfo) => {
            expect(activityInfo.type).to.be.not.empty;

            // expect(activityInfo.raw).to.be.equal(requestObj.entry[0].changes[0].value);
             done();
        };

        server.on("request",(req: IncomingMessage, res: IncomingMessage)=> {
            apiCallback(config.socialNetwork)({onPost})((args: any) => console.log(args))(req);
        });

        socialSubscribe.start();

    });

    it("should emit proper events for post", (done) => {

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
                                item: "status",
                                sender_name: "JS Artist",
                                sender_id: 265660650537549,
                                post_id: "265660650537549_268789846891296",
                                verb: "add",
                                published: 1,
                                created_time: 1487572043,
                                message: "Good Morning!!!"
                            }
                        }
                    ],
                    id: "265660650537549",
                    time: 1487572044
                }
            ],

            object: "page",
        };
        const onPost = (activityInfo: IActivityInfo) => {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("status");
            // expect(activityInfo.raw).to.be.equal(requestObj.entry[0].changes[0].value);
            done();
        };


        apiCallback( config.socialNetwork) ({onPost}) (() => done())(req);
        const requestString = JSON.stringify(requestObj);
        req.write(new Buffer(requestString));
        req.end();
    });

    it("should emit proper events for comment", (done) => {


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
        const onComment = (activityInfo: IActivityInfo) => {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("comment");
            // expect(activityInfo.raw).to.be.equal(requestObj.entry[0].changes[0].value);
            done();
        };


        apiCallback(config.socialNetwork)({onComment})(() => {})(req);
        const requestString = JSON.stringify(requestObj);
        req.write(new Buffer(requestString));
        req.end();
    });

    it("should emit proper events for comment with filter", (done) => {


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
        const onComment = (activityInfo: IActivityInfo) => {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("comment");

        };

        const filter = (activityInfo: IActivityInfo) => {
           return true;
        };

        apiCallback(config.socialNetwork) ({onComment, filter})(() => {})(req);
        const requestString = JSON.stringify(requestObj);
        req.write(new Buffer(requestString));
        req.end();


        const newReq = new MockReq({
            method: "POST",
        });
        const onCommentNext = (activityInfo: IActivityInfo) => {
            const error = new Error("onComment should not be called");
            done(error);
        };
        apiCallback(config.socialNetwork)({onComment:onCommentNext, filter: () => false})(() => {
            done()
        })(newReq);

        newReq.write(new Buffer(requestString));
        newReq.end();


    });

    it.only("should emit proper events for comment with express like request", (done) => {
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
        const onComment = (activityInfo: IActivityInfo) => {
            expect(activityInfo.type).to.be.not.empty;
            expect(activityInfo.type).to.be.equal("comment");

        };

        const filter = (activityInfo: IActivityInfo) => {
            return true;
        };
        req.body = requestObj;

        apiCallback(config.socialNetwork) ({onComment, filter})(() => done())(req);
        // const requestString = JSON.stringify(requestObj);

        // req.write(new Buffer(requestString));
        req.end();

    })
});
