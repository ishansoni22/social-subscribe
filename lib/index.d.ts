/// <reference types="node" />
import { IncomingMessage } from "http";
import { EventEmitter } from "events";
import { IConfig } from "./config/config";
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
export declare type IFork = (error: (error: Error) => void, success: (T: any) => void) => void;
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
    apiCallback(request: IncomingMessage, response: IncomingMessage, callback: (data: any) => void): void;
}
