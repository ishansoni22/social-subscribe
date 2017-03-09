/**
 * Created by bharatm on 06/03/17.
 */

import {repository} from "./repository";
const shortLivedAccessToken = "EAADvbGAQt94BAB9MlnpcVU4dyS6ZBZAIAk47ngrHe4D6NjJDkPMrGHYjvf0Az52IhoIw9ow3AgN" +
    "gPW9UR8pGoW0SyClV63JEEZBhOZARGXjxdx4JnfveSa3QhH3uHBrIjQYhaZCCylMhZBRuE2wAm4Ho0iZBs8IuW6ZCHVRRfpv0mE" +
    "3iPZBTFa9K5hCrWp2oo7fUZD";
export const config = {
    uuid: "123456789",
    appId: "263248747214814",
    appSecret: "4454810a488876bc8b716e76f8be8de2",
    callBackURL: "http://localhost:3050",
    graphApiHost: "https://graph.facebook.com",
    repository,
    shortLivedAccessToken,
    socialNetwork: "facebook",
};
