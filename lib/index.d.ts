/// <reference types="node" />
import { IncomingMessage } from "http";
import { EventEmitter } from "events";
import { IConfig } from "./config/config";
export declare type IFork = (error: (error: Error) => void, success: (T: any) => void) => void;
export interface ITask {
    fork: IFork;
}
export declare type IRecipe = (config: IConfig) => ITask;
export declare class SocialSubscribe extends EventEmitter {
    private recipe;
    private config;
    constructor(config: IConfig);
    start(): void;
    apiCallback(request: IncomingMessage, response: IncomingMessage, callback: () => void): void;
}
