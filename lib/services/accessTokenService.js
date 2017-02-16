"use strict";
exports.lookupAppAccessToken = (Task) => (config) => new Task((reject, resolve) => {
    config.repository.getAppAccessToken(config.appId).then(resolve, reject);
});
exports.lookUpLongLivedAccessToken = (Task) => (config) => () => new Task((reject, resolve) => {
    config.repository.getLongLivedAccessToken(config.shortLivedAccessToken).then(resolve, reject);
});
exports.persistLongLivedAccessToken = (Task) => (config) => (longLivedAccessToken) => new Task((reject, resolve) => {
    config.repository.setLongLivedAccessToken(config.shortLivedAccessToken, longLivedAccessToken)
        .then(resolve, reject);
});
exports.persistAppAccessToken = (Task) => (config) => (appAccessToken) => new Task((reject, resolve) => {
    config.repository.setAppAccessToken(config.appId, appAccessToken).then(resolve, reject);
});
//# sourceMappingURL=accessTokenService.js.map