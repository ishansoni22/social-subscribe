/**
 * Created by bharatm on 10/02/17.
 */

import {IConfig} from "../config/config";
import {ITask} from "../index";

export const lookupAppAccessToken = (Task: any) => (config: IConfig): ITask =>
    new Task((reject: any, resolve: any) => {
        config.repository.getAppAccessToken(config.appId).then(resolve, reject);
    });

export const lookUpLongLivedAccessToken = (Task: any) => (config: IConfig): any => (): any =>
    new Task((reject: any, resolve: any) => {
        config.repository.getLongLivedAccessToken(config.shortLivedAccessToken).then(resolve, reject);
    });

export const persistLongLivedAccessToken = (Task: any) => (config: IConfig): any =>
    (longLivedAccessToken: string): any =>
        new Task((reject: any, resolve: any) => {
            config.repository.setLongLivedAccessToken(config.shortLivedAccessToken, longLivedAccessToken)
                .then(resolve, reject);
        });

export const persistAppAccessToken = (Task: any) => (config: IConfig) => (appAccessToken: string) =>
    new Task((reject: any, resolve: any) => {
        config.repository.setAppAccessToken(config.appId, appAccessToken).then(resolve, reject)
    });

// export const updateTokens = (config: IConfig) => (updateObj: any)  => Object.assign({}, config, updateObj);


