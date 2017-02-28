export interface IConfig {
    uuid: string;
    shortLivedAccessToken: string;
    appId: string;
    appSecret: string;
    callBackURL: string;
    repository: IRepository;
    graphApiHost: string;
    socialNetwork: string;
}
export interface IRepository {
}
export interface ICallbackConfig {
}
