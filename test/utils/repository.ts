/**
 * Created by bharatm on 10/02/17.
 */

import {IFbRepository, IPage} from "../../src/recipes/facebook";
const Promise: any = require("bluebird");

export class RepositoryClass implements IFbRepository {

    private tokens = new Map();

    public getLongLivedAccessToken(uuid: string): PromiseLike<string> {
        return new Promise((resolve: Function, reject: Function) => {
            uuid +="logLivedAccessToken";

            if (this.tokens.has(uuid)) {
                resolve(this.tokens.get(uuid));
            } else {
                reject();
            }
        });
    }

    public getAppAccessToken(appId: string): PromiseLike<string> {
        return new Promise((resolve: Function, reject: Function) => {
            if (this.tokens.has(appId)) {
                resolve(this.tokens.get(appId));
            }
            else {
                reject();
            }
        });
    }

    public setLongLivedAccessToken(uuid: string, longLivedAccessToken: string): PromiseLike<boolean> {
        return new Promise((resolve: Function) => {
            this.tokens.set(uuid+"logLivedAccessToken", longLivedAccessToken);
            resolve(true);
        });
    }

    public setAppAccessToken(appId: string, appAccessToken: string): PromiseLike<boolean> {
        return new Promise((resolve: Function) => {
            this.tokens.set(appId, appAccessToken);
            resolve(true);
        });
    }

    public setPages(uuid: string, pages: Array<IPage>) {
        return new Promise((resolve: Function) => {
            this.tokens.set(uuid+"pageIds", pages);
            resolve(true);
        });
    }
    public getPages(uuid: string) {
        return new Promise((resolve: Function, reject: Function) => {
            uuid = uuid.concat("pageIds");
            if (this.tokens.has(uuid)) {
                resolve(this.tokens.get(uuid));
            }
            else {
                reject();
            }
        });
    }
}

export const repository = new RepositoryClass();
