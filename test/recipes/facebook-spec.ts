"use strict";

import * as chai from "chai";
import {publishComment} from "../../src/recipes/facebook";
import {config} from "../utils/config";

const expect = chai.expect;

describe("Fecebook helper", function(){
    this.timeout(80000);



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
});
