"use strict";

const rp = require('request-promise');

module.exports = function(){

  var requestHelper = {

    request : function(options){
        return rp(options)
    }

  }


  return requestHelper
}
