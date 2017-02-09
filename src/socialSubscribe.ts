"use strict";

import * as EventEmitter from "events";
import * as R from "ramda";
// const Task = require('data.task')
import {configInterface} from "./config/config";
import {subscribePages, getUserPageDetails, getLongLivedAccessToken,
   setLongLivedFBAccessToken} from "./services/subscribeService";
// import {requestHelper as requestHelperCurry} from "./";
// let requestHelper = requestHelperCurry(Task);


const graphApiHost = 'https://graph.facebook.com'


export class socialSubscribeClass extends EventEmitter {

  public subscribe(config:configInterface) {

    let register: Function =   R.compose(R.chain(subscribePages(config.graphApiHost)),
      R.chain(getUserPageDetails(config.graphApiHost)),
      R.map(setLongLivedFBAccessToken),
      getLongLivedAccessToken(config.graphApiHost));

    //@ToDo: Validations for config object
    register(config)
      .fork(
             (error: Error) => socialSubscribe.emit('registerFailedEvent', error),
             (result: any) => socialSubscribe.emit('registerSuccessEvent', result)
           );
  }
}



// socialSubscribe.register = function(configInterface){
//     socialSubscribe['configParams'] = configInterface
//     register(socialSubscribe.configParams).fork((error) => socialSubscribe.emit('registerFailedEvent', error),
//                            (result) => socialSubscribe.emit('registerSuccessEvent', result))
// }
