"use strict";

import * as chai from "chai";
import {publishComment} from "../../src/recipes/facebook";

const expect = chai.expect;

describe("Fecebook helper", function(){
    this.timeout(80000);
    const accessToken = "EAADvbGAQt94BADNudSJSk7XwlE8WEKLo8Pw32f6GtRZCDK3X7kllKXT4fiXVnTmEdVKRi7ecAA4yZCzNpKk" +
        "YLrzBrOOzRfxDIXcv8t6Od9NYuBh952UkjKCVZBa0XezQkYsIX1mmP7Y7IO35JSpYMqZBZBZCUR2IMJuZAys5cZCg3MqZAZB3C4B" +
        "T3ZBbH9TxAFYkdgZD";
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
})
