import {IncomingMessage} from "http";
const Task = require("data.task");
const R = require("ramda");
import  {EventEmitter} from "events";

import {IConfig, ICallbackConfig} from "./config/config";

import {getRecipe, getApiCallback, apiCallbackHandler} from "./recipes/recipe";

import * as helpers from "./recipes/index";

export const socialSubscribeHelpers = helpers;

export type IFork = (error: (error: Error) => void, success: (T: any) => void) => void;

export {IConfig, ICallbackConfig, apiCallbackHandler};

export interface ITask {
    fork: IFork;
}
export type IRecipe =  (config: IConfig) => ITask;


export class SocialSubscribe extends EventEmitter {

    private recipe: IRecipe;

    private config: IConfig;

    public constructor(config: IConfig) {
        super();
        this.config = config;
        this.recipe = getRecipe(config.socialNetwork);
    }

    public start() {
        this.recipe(this.config).fork((error: Error) => {
            this.emit("error", error);
        }, (success: any) => {
            this.emit("success", success);
        });
    }


}
;

export const apiCallback = (request: IncomingMessage,
                            response: IncomingMessage,
                            callbackConfig: ICallbackConfig,
                            socialNetwork: string) => {

    const recipeAPICallback: apiCallbackHandler = getApiCallback(socialNetwork);
    recipeAPICallback(callbackConfig)(request)(response);
};
