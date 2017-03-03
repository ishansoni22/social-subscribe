"use strict";

import * as chai from "chai";
import {publishComment} from "../../src/recipes/facebook";

const expect = chai.expect;

describe("Fecebook helper", function(){
    this.timeout(80000);
    const accessToken = "EAADvbGAQt94BAA9yKHhwMFDGAnUmCGPQnOVSTr3eYmGnW9DR95UuljxpIlAsQL4ala7riaWQXd3cCENWuXvvBp" +
        "sN8eKoODetGzXXXlo1ZAo6S1jcydmSdlQ1LuoZBEy6H4REM4ARPu6FmXvGe88kJUEhDvuswOqhauN0A1OtyGyZCdSG5o4kgps1JZCE2l0ZD";
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
