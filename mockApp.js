var express = require("express")
var config = require("./mockConfig.js")()
var socialSubscribe = require("./socialSubscribe.js")()

var server = express()
server.listen(9999, function(err){
  if(err){
    //
  }else{
    console.log("Server started at port 9999")
  }
})

server.get('/', function(req, res){
  socialSubscribe.register(config)
  res.end("Hi")
})
