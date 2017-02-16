import {IncomingMessage} from "http";
const Task = require("data.task");
const R = require("ramda");
import  {EventEmitter} from "events";


import {IConfig} from "./config/config";
import {
    addWebhooksForPageActivity as addWebhooksForPageActivityCurry,
    extractLongLivedAccessTokenFromResponse,
    getLongLivedAccessToken,
    getAppAccessToken as getAppAccessTokenCurry,
    getUserPageDetails as getUserPageDetailsCurry,
    subscribePageForApp as subscribePageForAppCurry,
} from "../src/services/subscribeService";

import {
    lookUpLongLivedAccessToken as lookUpLongLivedAccessTokenCurry,
    persistLongLivedAccessToken as persistLongLivedAccessTokenCurry,
} from "../src/services/accessTokenService";
import {ClientResponse} from "http";


export type IFork = (error: (error: Error) => void, success: (T: any) => void) => void;

export interface ITask {
    fork: IFork;
}
export type IRecipe =  (config: IConfig) => ITask;

export class SocialSubscribe extends EventEmitter {

    private recipe: IRecipe;

    private config: IConfig;

    public constructor(config: IConfig) {
        super();

        this.config = config;

        // @todo: Move recipe to separate repository
        const persistLongLivedAccessToken = persistLongLivedAccessTokenCurry(Task)(config);
        const getPageDetails = getUserPageDetailsCurry(config);
        const lookUpLongLivedAccessToken = lookUpLongLivedAccessTokenCurry(Task)(config);
        const subscribePageForApp = subscribePageForAppCurry(config);
        const addWebhooksForPageActivity = addWebhooksForPageActivityCurry(config);
        const getAppAccessToken = getAppAccessTokenCurry(config);


        const pageIds: ITask = R.compose(
            R.map(R.prop("data")),
            R.chain(getPageDetails),
            R.chain(lookUpLongLivedAccessToken),
            R.chain(persistLongLivedAccessToken),
            R.map(extractLongLivedAccessTokenFromResponse),
            getLongLivedAccessToken);

        const registerAppUrlForPageActivity: IRecipe = R.compose(
            R.chain(addWebhooksForPageActivity),
            R.map(extractLongLivedAccessTokenFromResponse),
            R.chain(getAppAccessToken),
            R.unnest,
            R.map(R.sequence(Task.of)),
            R.map(R.map(subscribePageForApp)),
            pageIds);
        this.recipe = registerAppUrlForPageActivity;
    }

    public start() {
        this.recipe(this.config).fork((error: Error) => {
            this.emit("error", error);
        }, (success: any) => {
            this.emit("success", success);
        });
    }

    public apiCallback(request: IncomingMessage, response: IncomingMessage, callback: () => void) {
        if (request.method === "POST") {
            let data = "";
            const post: any = {};
            request.on("data", (chunk: any) => {
                data += chunk.toString();

            })
            request.on("end", () => {
                data.split("&")
                    .forEach((values) => {
                         post[values.split("=")[0]] = values.split("=")[1];
                    });
            });

            console.log(post);

        }

    }
}
;
