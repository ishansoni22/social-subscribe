import { IConfig } from "../config/config";
export declare const getLongLivedAccessToken: (config: IConfig) => any;
export declare const extractLongLivedAccessTokenFromResponse: (responseString: string) => string;
export declare const getUserPageDetails: (config: IConfig) => (longLivedAccessToken: string) => any;
export declare const subscribePageForApp: (config: IConfig) => (page: any) => any;
export declare const addWebhooksForPageActivity: (config: IConfig) => (appAccessToken: string) => any;
export declare const getAppAccessToken: (config: IConfig) => () => any;
export declare const doFbPostOnPage: (config: IConfig) => (message: string) => (longLivedAccessToken: string) => (page: any) => any;
