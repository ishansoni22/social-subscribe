"use strict";

import * as chai from "chai";
import {publishComment, IPage, isPageSubscriptionAliveCheckApiCall} from "../../src/recipes/facebook";
import {config} from "../utils/config";
import {SocialSubscribe} from "../../src/index";
import {IConfig} from "../../src/config/config";
import {createServer as createServerCurry} from "../utils/server";
const localtunnel = require('localtunnel');

const expect = chai.expect;


const localServerPort = 3050;
const createServer = createServerCurry(localServerPort);

describe("Fecebook helper", function () {
    this.timeout(80000);


    let server: any;
    let tunnel: any;

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

    it("replies to comment correctly ", (done) => {
        const commentId = "266831690420445_268791033557844";
        let replyMessage = "This is the latest reply with random:";
        replyMessage = replyMessage
            .concat(Math.random().toString())
            .concat(" at time" + new Date());

        publishComment(config.graphApiHost)(config.shortLivedAccessToken)(commentId)(replyMessage).fork(done, (data: {id: string}) => {
            expect(data).to.be.not.empty;
            expect(data).to.haveOwnProperty("id");
            done();
        });
    });

    it("checks if subscription is still alive", (done) => {
        interface IApp {
            category: string;
            id: string;
            link: string;
            name: string;
        }

        const checkIfFacebookPageSubscriptionIsAlive = (config: IConfig) =>
            (pageDetails: {pageAccessToken: string, pageId: string}): PromiseLike<any> => {

                const pageSubscriptionCheckFn = isPageSubscriptionAliveCheckApiCall(
                    config.graphApiHost,
                    pageDetails.pageId,
                    pageDetails.pageAccessToken);

                return new Promise((resolve, reject) => {
                    pageSubscriptionCheckFn.fork(reject, resolve);
                })
            };



        const socialSubscribe = new SocialSubscribe(config);
        socialSubscribe.on("success", (obj: any) => {

            let {repository, uuid} = config;

            repository.getPages(uuid)
                .then((data: Array<IPage>) => {
                    return data.map((page: IPage) =>
                        ({"pageAccessToken": page.access_token, "pageId": page.id}))
                }).then(
                (pageDetails: Array<{pageAccessToken: string, pageId: string}>) =>
                    Promise.all(pageDetails.map(checkIfFacebookPageSubscriptionIsAlive(config)))
            ).then((pageSubscriptionStatus: any) => {

                pageSubscriptionStatus.map((status: {
                    data: Array<IApp>
                }) => status.data.map((app: IApp) => app.id).map((id: string) =>
                    expect(config.appId).to.be.equal(id)
                ))
                done();
            }).catch(done);


        });
        socialSubscribe.on("error", done);
        socialSubscribe.start();

    })
});
