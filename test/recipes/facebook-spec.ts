"use strict";

import * as chai from "chai";
import {publishComment} from "../../src/recipes/facebook";

const expect = chai.expect;

describe("Fecebook helper", function(){
    this.timeout(80000);
    const accessToken = "EAADvbGAQt94BAAiHuOpqjnLCIMA6CqRlqQackmdAmMvkd7LngYMpN8oybY7hSPFMrlweIXYatkzpq7li2TgpBugYedB" +
        "nyO3QuCKc9zwTFf0aY1dlb6xnIdbXwEC5QASx9JfhM9HyQBXMlOvo2Ilgy9mCDU6YZCrQ9cZAsXRM89ThqmsEJNq9MJB8f8ZAnMZD";
    const graphApiHost = "https://graph.facebook.com";


    it("replies to comment correctly ", (done) => {
        const commentId = "266831690420445_268791033557844";
        let replyMessage = "This is the latest reply with random:";
        replyMessage = replyMessage
            .concat(Math.random().toString())
            .concat(" at time" + new Date());

        publishComment(graphApiHost)(accessToken)(commentId)(replyMessage).fork(done, (data: {id: string}) => {
            expect(data).to.be.not.empty;
            expect(data).to.haveOwnProperty("id");
            done();
        });
    });
});
