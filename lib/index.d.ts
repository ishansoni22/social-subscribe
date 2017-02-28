/// <reference types="node" />
import { IncomingMessage } from "http";
import { EventEmitter } from "events";
import { IConfig, ICallbackConfig } from "./config/config";
import { apiCallbackHandler } from "./recipes/recipe";
export declare type IFork = (error: (error: Error) => void, success: (T: any) => void) => void;
export { IConfig, ICallbackConfig, apiCallbackHandler };
export interface ITask {
    fork: IFork;
}
export declare type IRecipe = (config: IConfig) => ITask;
export declare class SocialSubscribe extends EventEmitter {
    private recipe;
    private config;
    private actions;
    constructor(config: IConfig);
    start(): void;
}
export declare const apiCallback: (request: IncomingMessage, response: IncomingMessage, callbackConfig: ICallbackConfig, socialNetwork: string) => void;
