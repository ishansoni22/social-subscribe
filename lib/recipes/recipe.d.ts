/// <reference types="node" />
import { ICallbackConfig } from "../config/config";
import { IRecipe } from "../index";
import { IncomingMessage } from "http";
export declare type apiCallbackHandler = (config: ICallbackConfig) => (request: IncomingMessage) => (response: IncomingMessage) => void;
export interface IExternalRecipe {
    name: string;
    recipe: IRecipe;
    apiCallbackHandlerFn: apiCallbackHandler;
}
export declare type Recipes = Map<string, IExternalRecipe>;
export declare const setRecipe: (externalRecipe: IExternalRecipe) => Map<string, IExternalRecipe>;
export declare const getRecipe: (socialNetwork: string) => IRecipe;
export declare const getApiCallback: (socialNetwork: string) => apiCallbackHandler;
