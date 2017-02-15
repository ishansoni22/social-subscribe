"use strict";

import {EventEmitter} from "events";
import * as R from "ramda";
import {IConfig} from "./config/config";
import {getLongLivedAccessToken} from "./services/subscribeService";

// import {
//   getUserPageDetails, getLongLivedAccessToken,
//   setLongLivedFBAccessToken, addWebhooksForPageActivity, subscribePageForApp,
//   extractPagesFromUserPageDetailsResponse
// } from "./services/subscribeService";


const graphApiHost = "https://graph.facebook.com"


export class SocialSubscribeClass extends EventEmitter {

  public subscribe(config: IConfig) {

  //   const subscribeAndAddWebhook: any = R.compose(
  //     R.chain(addWebhooksForPageActivity(config.graphApiHost)),
  //     subscribePageForApp(config.graphApiHost));
  //
  //   const register: Function = R.compose(R.chain(subscribePages(config.graphApiHost)),
  //     R.map(extractPagesFromUserPageDetailsResponse)
  //   R.chain(getUserPageDetails(config)),
  //     R.map(setLongLivedFBAccessToken),
  //     getLongLivedAccessToken(config)
  // )
  //   ;

    // const register: Function = R.pPipe(getLongLivedAccessToken(config))

    // @ToDo: Validations for config object
    // register(config)
    //   .fork(
    //     (error: Error) => this.emit("registerFailedEvent", error),
    //     (result: any) => this.emit("registerSuccessEvent", result)
    //   );
  }
}
