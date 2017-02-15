const Task = require("data.task");
const R = require("ramda");
import  {EventEmitter} from "events";

import {IConfig} from "./config/config";
import {
    getUserPageDetails as getUserPageDetailsCurry,
    extractLongLivedAccessTokenFromResponse,
    getLongLivedAccessToken,
    subscribePageForApp as subscribePageForAppCurry,
    addWebhooksForPageActivity as addWebhooksForPageActivityCurry,
    getAppAccessToken as getAppAccessTokenCurry,
} from "../src/services/subscribeService";

import {
    lookUpLongLivedAccessToken as lookUpLongLivedAccessTokenCurry,
    persistLongLivedAccessToken as persistLongLivedAccessTokenCurry,
} from "../src/services/accessTokenService";

export class SocialSubscribe extends EventEmitter {};

export const register = (config: IConfig) => {
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

    const socialSubscribe = new SocialSubscribe();
    socialSubscribe.on("start", () => {
        registerAppUrlForPageActivity(config).fork((error: Error) => {
            socialSubscribe.emit("error", error);
        }, (success: any) => {
            socialSubscribe.emit("success", success);
        });
    });

    return socialSubscribe;
};


export const fbListener = () => {

};


