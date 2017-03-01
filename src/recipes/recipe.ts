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
    name: string,
    recipe: IRecipe;
    apiCallbackHandlerFn: apiCallbackHandler;
}

export type Recipes =  Map<string,  IExternalRecipe>;
const recipes: Recipes = new Map();

const setRecipeCurry = (recipes: Recipes) =>
    (externalRecipe: IExternalRecipe) => recipes.set(externalRecipe.name, externalRecipe);

export const setRecipe = setRecipeCurry(recipes);
setRecipe(fbRecipe);


const getRecipeCurry = (recipes: Recipes) =>
    (socialNetwork: string): IRecipe =>
        recipes.get(socialNetwork).recipe;

export const getRecipe = getRecipeCurry(recipes);

const getApiCallbackCurry = (recipes: Recipes) =>
    (socialNetwork: string): apiCallbackHandler => recipes.get(socialNetwork).apiCallbackHandlerFn;

export const getApiCallback = getApiCallbackCurry(recipes);
