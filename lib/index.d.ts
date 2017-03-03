/// <reference types="node" />
import { EventEmitter } from "events";
import { IConfig, ICallbackConfig } from "./config/config";
import { apiCallbackHandler } from "./recipes/recipe";
import * as helpers from "./recipes/index";
export declare const socialSubscribeHelpers: typeof helpers;
export declare type IFork = (error: (error: Error) => void, success: (T: any) => void) => void;
export { IConfig, ICallbackConfig, apiCallbackHandler };
export interface ITask {
    fork: IFork;
}
export declare type IRecipe = (config: IConfig) => ITask;
export declare class SocialSubscribe extends EventEmitter {
    private recipe;
    private config;
    constructor(config: IConfig);
    start(): void;
}
export declare const apiCallback: (socialNetwork: string) => apiCallbackHandler;
