/// <reference types="node" />
import { ICallbackConfig } from "../config/config";
import { IRecipe } from "../index";
import { IncomingMessage } from "http";
export declare type apiCallbackHandler = (config: ICallbackConfig) => (request: IncomingMessage) => (response: IncomingMessage) => void;
export interface IExternalRecipe {
    recipe: IRecipe;
    apiCallbackHandlerFn: apiCallbackHandler;
}
export declare const getRecipe: (socialNetwork: string) => IRecipe;
export declare const getApiCallback: (socialNetwork: string) => apiCallbackHandler;
