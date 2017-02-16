import { IConfig } from "../config/config";
import { ITask } from "../index";
export declare const lookupAppAccessToken: (Task: any) => (config: IConfig) => ITask;
export declare const lookUpLongLivedAccessToken: (Task: any) => (config: IConfig) => any;
export declare const persistLongLivedAccessToken: (Task: any) => (config: IConfig) => any;
export declare const persistAppAccessToken: (Task: any) => (config: IConfig) => (appAccessToken: string) => any;
