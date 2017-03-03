# Social Subscribe
The goal of this library is to provide an abstraction over most popular social networks for subscribing to 
user activity.

In it's current state it can help to subscribe users facebook pages. It will give you an event emitter which emits events like "post", "comment" etc. with the 
update as soon as there is any activity on pages. 

## Installation
You can install this package from npm via following command 
```sh
npm install social-subscribe@alpha
```

## How to use

To import package.
```js
import { SocialSubscribe, apiCallback } from "social-subscribe";
```

To register for subscription:

First create instance of SocialSubscribe with configuration.
```js
const socialSubscribe = new SocialSubscribe(config);
```

Interface for configuration is  
```js
export interface IConfig {
    uuid: string,
    shortLivedAccessToken: string;
    appId: string;
    appSecret: string;
    callBackURL: string;
    repository: IRepository;
    graphApiHost: string;
    socialNetwork: string; //facebook
}

export interface IFbRepository extends IRepository {
    getLongLivedAccessToken(uuid: string): PromiseLike<string>;
    getAppAccessToken(appId: string): PromiseLike<string>;
    setLongLivedAccessToken(uuid: string, longLivedAccessToken: string): PromiseLike<boolean>;
    setAppAccessToken(appId: string, appAccessToken: string): PromiseLike<boolean>;
    setPages(uuid: string, pages: Array<IPage>): PromiseLike<boolean>;
    getPages(uuid: string): PromiseLike<Array<IPage>>;
}

```
Now call a start to do subscription as shown below. Currently only facebook is supported.
For repository use `IFbRepository` interface. 

```js
socialSubscribe.start();
```

You may attach `success` and `error` event listeners to `socialSubscribe`. 
The success event will be emitted when subscription to facebook pages is completed. The error event will be emitted
if any error occurs in the process

```js
socialSubscribe.on("error", () => {
    
});

socialSubscribe.on("success", () => {
    
});
```


P.S.: I have used typescript to write this library, and give examples. It is not mandatory to use typescript in 
your project to consume this library. 


Along with subscriptions we are providing helper functions. 

#### Callback Helper

As per social-subscribe configuration implementer need to provide the `callBackURL`. 
The handling for request on this URL can be done via handler function provided via helpers. 

```js
// Assuming you are using native http server
 server.on("request",(req: IncomingMessage, res: IncomingMessage)=> {
            apiCallback(config.socialNetwork)({onPost})((args: any) => console.log(args))(req);
        });

```
Type of `apiCallback` is :
```js
export type apiCallbackHandler = (config: ICallbackConfig) =>
    (callback: (data: any) => void) => (request: IncomingMessage) => void
```

Here `ICallbackConfig` will be defined by the recipe / social network you are implementing for 
e.g. for facebook 

```js
export interface IFbCallbackConfig extends ICallbackConfig {
    onComment?: (activityInfo: IActivityInfo) => void;
    onPost?: (activityInfo: IActivityInfo) => void;
    onActivity?: (activityInfo: IActivityInfo) => void;
    filter?: (activityInfo: IActivityInfo) => boolean;
}
```

This way `apiCallback` will be executing your `onComment` function whenever their is any activity on facebook page
 it has subscribed. Also the `callback` function passed before request will be called once the `activity` i.e. onComment
  is called. This can be used to call `next` in case of express server or do the next processing. 

`filter` Above is used to ignore those activities which you might not be interested in. 
e.g. replies on comment while reacting to all the comments on a post

The example for same is shown in [tests] (../blob/master/test/socialSubscriber-spec.ts#L62) 
Use cases
---------
  This can be used when application needs to get continuous updates of the user from social networks to process the 
  update and perform certain analysis on it. 
  
  This library helps in quick bootstrapping of social subscription 

How it works
------------
coming up ...

Future Plan
------------
Currently this library does not consider the social API call limits. We plan to add that in future as of now the API
 limits are expected to be handled by application.

Library has included recipe in itself. We plan to separate it so that it can grow on it's own, in areas like
 adding more events for subscription and specialised API calls per social network. 

We will also provide helper functions which will include independent API calls that we make to do subscription, along 
 with specialised API calls per social network to ease the integration. The helper functions 

## TODO
- [ ]  Add documentation for Installation
- [ ]  Add documentation for How to use
- [ ]  Add documentation for How it works
- [X]  Create NPM package
- [ ]  Add code coverage
