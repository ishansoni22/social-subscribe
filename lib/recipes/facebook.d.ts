import { ITask } from "../index";
import { IRepository, IConfig, ICallbackConfig } from "../config/config";
import { apiCallbackHandler } from "./recipe";
export interface IFbConfig extends IConfig {
    repository: IFbRepository;
}
export interface IValue {
    item: string;
    sender_name: string;
    sender_id: number;
    post_id: string;
    verb: string;
    published: boolean;
    created_time: number;
    message: string;
    comment_id: string;
    parent_id: string;
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
export interface IPage {
    access_token: string;
    category: string;
    name: string;
    id: string;
    perms: Array<string>;
}
export interface IFbCallbackConfig extends ICallbackConfig {
    onComment?: (activityInfo: IActivityInfo) => void;
    onPost?: (activityInfo: IActivityInfo) => void;
    onActivity?: (activityInfo: IActivityInfo) => void;
    filter?: (activityInfo: IActivityInfo) => boolean;
}
export interface IFbRepository extends IRepository {
    getLongLivedAccessToken(uuid: string): PromiseLike<string>;
    getAppAccessToken(appId: string): PromiseLike<string>;
    setLongLivedAccessToken(uuid: string, longLivedAccessToken: string): PromiseLike<boolean>;
    setAppAccessToken(appId: string, appAccessToken: string): PromiseLike<boolean>;
    setPages(uuid: string, pages: Array<IPage>): PromiseLike<boolean>;
    getPages(uuid: string): PromiseLike<Array<IPage>>;
}
export declare const lookupAppAccessToken: (Task: any) => (config: IFbConfig) => ITask;
export declare const lookUpLongLivedAccessToken: (Task: any) => (config: IFbConfig) => () => any;
export declare const persistLongLivedAccessToken: (Task: any) => (config: IFbConfig) => any;
export declare const persistAppAccessToken: (Task: any) => (config: IFbConfig) => (appAccessToken: string) => any;
export declare const lookupPages: (Task: any) => (config: IFbConfig) => () => PromiseLike<IPage[]>;
export declare const persistPages: (Task: any) => (config: IFbConfig) => (pages: IPage[]) => any;
export declare const extractLongLivedAccessTokenFromResponse: (responseString: string) => string;
export interface IRequestLongLivedAccessTokenConfig {
    graphApiHost: string;
    appId: string;
    appSecret: string;
    shortLivedAccessToken: string;
}
export declare const getLongLivedAccessTokenFromShotLivedToken: (config: IRequestLongLivedAccessTokenConfig) => any;
export declare const getLongLivedAccessToken: (config: IConfig) => any;
export declare const getUserPageDetails: (config: IConfig) => (longLivedAccessToken: string) => any;
export declare const subscribePageForApp: (config: IConfig) => (page: IPage) => any;
export declare const addWebhooksForPageActivity: (config: IConfig) => (appAccessToken: string) => any;
export declare const getAppAccessToken: (config: IConfig) => () => any;
export declare const recipe: (config: IConfig) => ITask;
export declare const apiCallbackHandlerFn: apiCallbackHandler;
export declare const publishComment: (graphApiHost: string) => (accessToken: string) => (objectId: string) => (message: string) => any;
export declare const name: string;
