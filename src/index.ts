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
import {emit} from "cluster";

export interface IValue {
    item: string;
    sender_name: string;
    sender_id: number;
    post_id: string;
    verb: string;
    published: boolean;
    created_time: number;
    message: string;
    comment_id: string,
    parent_id: string,
}
export interface IChange {
    field: string;
    value: IValue;
}
export interface IEntry {
    changes: IChange[];
    id: string;
    time: number;
}

export interface IActivityInfo {
    from: number;
    raw: IChange;
    type: string;
}
export type IFork = (error: (error: Error) => void, success: (T: any) => void) => void;

export interface ITask {
    fork: IFork;
}
export type IRecipe =  (config: IConfig) => ITask;

export class SocialSubscribe extends EventEmitter {

    private recipe: IRecipe;

    private config: IConfig;

    private actions: Map<string, string>;

    public constructor(config: IConfig) {
        super();
        this.actions = new Map([["status", "post"]]);
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

    public apiCallback(request: IncomingMessage, response: IncomingMessage, callback: (data: any) => void) {
        if (request.method === "POST") {
            let data: any = "";
            request.on("data", (chunk: any) => {
                data += chunk.toString();

            })
            request.on("end", () => {
                data = JSON.parse(data);

                const emitActivity = (eventEmitter: SocialSubscribe) => (change: IChange) => {
                    const {item} = change.value;
                    const activity: string = this.actions.has(item) && this.actions.get(item) || item;

                    const activityInfo: IActivityInfo = {
                        from: change.value.sender_id,
                        raw: change,
                        type: activity,
                    };

                    eventEmitter.emit(activity, activityInfo)
                    eventEmitter.emit("activity", change);
                };

                const entryIterator = (entry: IEntry) => {

                    const mergeEntryIdWithChange = (change: IChange) =>
                        Object.assign({}, change, {id: entry.id});

                    const changes = R.has("changes")(entry) ? entry.changes : [];

                    const publishedChanges = changes.filter((change: IChange) =>
                    change.value && change.value.published !== undefined && change.value.published || 1);

                    return publishedChanges && R.map(mergeEntryIdWithChange, publishedChanges) || [];
                };

                const emitActivityForSocialSubScribe = emitActivity(this);

                return R.has("entry")(data) ?
                    R.forEach(R.compose(
                        R.map(emitActivityForSocialSubScribe),
                        entryIterator,
                    ), data.entry) : null;

            });
        }

    }
}
;
