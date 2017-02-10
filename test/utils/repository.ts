/**
 * Created by bharatm on 10/02/17.
 */
import {IRepository} from "../../src/config/config";
const Promise: any = require("bluebird");

export class RepositoryClass implements IRepository {

    private tokens = new Map();

    public getLongLivedAccessToken(shortLivedAccessToken: string): PromiseLike<string> {
        return new Promise((resolve: Function, reject: Function) => {
            if(this.tokens.has(shortLivedAccessToken)) {
                resolve(this.tokens.get(shortLivedAccessToken))
            }
            else {
                reject();
            }
        });
    }

    public getAppAccessToken(appId: string): PromiseLike<string> {
        return new Promise((resolve: Function, reject: Function) => {
            if(this.tokens.has(appId)) {
                resolve(this.tokens.get(appId))
            }
            else {
                reject();
            }
        });
    }

    public setLongLivedAccessToken(shortLivedAccessToken: string, longLivedAccessToken: string): PromiseLike<boolean> {
        return new Promise((resolve: Function) => {
            this.tokens.set(shortLivedAccessToken, longLivedAccessToken);
            resolve(true);
        });
    }

    public setAppAccessToken(appId: string, appAccessToken: string): PromiseLike<boolean> {
        return new Promise((resolve: Function) => {
            this.tokens.set(appId, appAccessToken);
            resolve(true);
        });
    }
}

export const repository = new RepositoryClass();
