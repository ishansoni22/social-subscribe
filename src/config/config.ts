


export interface configInterface {
  shortLivedAccessToken: string,
  appId: string,
  appSecret:  string,
  callBackURL:  string,
  repository(): repositoryInterface,
  graphApiHost: string
}

export interface repositoryInterface {
  getLongLivedAccessToken(shortLivedAccessToken: string): string
  getAppAccessToken(appId:string):  string
  setLongLivedAccessToken(shortLivedAccessToken: string): boolean
  setAppAccessToken(appId:string):  boolean
}


// module.exports = function(){
//
//   return {
//     getShortLivedAccessToken : 'EAAPbxRgFEWEBALc3YCNZByeIuJFSCnZA1cxQXlzVYFCNSHarL5KmHRGTumNuh45g5XnMqfmVrPMUshorf9B3Yc6rJs5HljxKzZBjessziQ469ehBJfWSAqOQcZCcsJON3PAlJrt2jrlIZBJh2wbViV1ztLOgY0k6SZCmvSgg8XJxTN6lF1ZBNVPaMHVPKsRq0cZD',
//     getLongLivedAccessToken : 'EAAPbxRgFEWEBALc3YCNZByeIuJFSCnZA1cxQXlzVYFCNSHarL5KmHRGTumNuh45g5XnMqfmVrPMUshorf9B3Yc6rJs5HljxKzZBjessziQ469ehBJfWSAqOQcZCcsJON3PAlJrt2jrlIZBJh2wbViV1ztLOgY0k6SZCmvSgg8XJxTN6lF1ZBNVPaMHVPKsRq0cZD',
//     getAppID :'1086064488157537',
//     getAppSecret : 'ad5f4df77906e536473d4be485404abd',
//     getCallBackURL : 'https://localhost:9999/fb-activity',
//     getAppAccessToken : '1327518453953323|ezht-KOy9BekwkMkyUhFIFfneXw',
//
//     setLongLivedAccessToken : function(token){return true}
//
//   }
// }
