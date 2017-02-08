var express = require("express")
var config = require("./config/mockConfig.ts")()
var socialSubscribe = require("./socialSubscribe.ts")()

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

socialSubscribe.on('registerSuccessEvent', function(result){
                   console.log("Successful Register Event")
                   console.log(result)
                   })
socialSubscribe.on('registerFailedEvent', function(error){
                   console.log("Failed Register Event")
                   console.log(error)
                   })
