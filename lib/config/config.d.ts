export interface IConfig {
    shortLivedAccessToken: string;
    appId: string;
    appSecret: string;
    callBackURL: string;
    repository: IRepository;
    graphApiHost: string;
}
export interface IRepository {
    getLongLivedAccessToken(shortLivedAccessToken: string): PromiseLike<string>;
    getAppAccessToken(appId: string): PromiseLike<string>;
    setLongLivedAccessToken(shortLivedAccessToken: string, longLivedAccessToken: string): PromiseLike<boolean>;
    setAppAccessToken(appId: string, appAccessToken: string): PromiseLike<boolean>;
}
