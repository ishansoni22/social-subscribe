/**
 * Created by bharatm on 10/02/17.
 */

import {IConfig} from "../config/config";

export const lookupAppAccessToken = (config: IConfig) =>
  config.repository.getAppAccessToken(config.appId);

export const lookUpLongLivedAccessToken = (config: IConfig) =>
  config.repository.getLongLivedAccessToken(config.shortLivedAccessToken);

export const persistLongLivedAccessToken = (config: IConfig) =>  (longLivedAccessToken: string) =>
  config.repository.setLongLivedAccessToken(config.shortLivedAccessToken, longLivedAccessToken);

export const persistAppAccessToken =  (config: IConfig) => ( appAccessToken: string) =>
  config.repository.setAppAccessToken(config.appId, appAccessToken);

// export const updateTokens = (config: IConfig) => (updateObj: any)  => Object.assign({}, config, updateObj);


