/**
 * Created by bharatm on 27/02/17.
 */


import * as fbRecipe from "./facebook";

import {ICallbackConfig} from "../config/config";
import {IRecipe} from "../index";
import {IncomingMessage} from "http";


export type apiCallbackHandler = (config: ICallbackConfig) =>
        (request: IncomingMessage) =>
            (response: IncomingMessage) => void;

export interface IExternalRecipe {
    recipe: IRecipe;
    apiCallbackHandlerFn: apiCallbackHandler;
}

const recipes: Map<string,  IExternalRecipe> = new Map();
recipes.set(fbRecipe.name, fbRecipe);


export const getRecipe = (socialNetwork: string): IRecipe => recipes.get(socialNetwork).recipe;
export const getApiCallback = (socialNetwork: string): apiCallbackHandler =>
    recipes.get(socialNetwork).apiCallbackHandlerFn;


