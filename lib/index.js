"use strict";
const Task = require("data.task");
const R = require("ramda");
const events_1 = require("events");
const subscribeService_1 = require("../src/services/subscribeService");
const accessTokenService_1 = require("../src/services/accessTokenService");
class SocialSubscribe extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.actions = new Map([["status", "post"]]);
        this.config = config;
        const persistLongLivedAccessToken = accessTokenService_1.persistLongLivedAccessToken(Task)(config);
        const getPageDetails = subscribeService_1.getUserPageDetails(config);
        const lookUpLongLivedAccessToken = accessTokenService_1.lookUpLongLivedAccessToken(Task)(config);
        const subscribePageForApp = subscribeService_1.subscribePageForApp(config);
        const addWebhooksForPageActivity = subscribeService_1.addWebhooksForPageActivity(config);
        const getAppAccessToken = subscribeService_1.getAppAccessToken(config);
        const pageIds = R.compose(R.map(R.prop("data")), R.chain(getPageDetails), R.chain(lookUpLongLivedAccessToken), R.chain(persistLongLivedAccessToken), R.map(subscribeService_1.extractLongLivedAccessTokenFromResponse), subscribeService_1.getLongLivedAccessToken);
        const registerAppUrlForPageActivity = R.compose(R.chain(addWebhooksForPageActivity), R.map(subscribeService_1.extractLongLivedAccessTokenFromResponse), R.chain(getAppAccessToken), R.unnest, R.map(R.sequence(Task.of)), R.map(R.map(subscribePageForApp)), pageIds);
        this.recipe = registerAppUrlForPageActivity;
    }
    start() {
        this.recipe(this.config).fork((error) => {
            this.emit("error", error);
        }, (success) => {
            this.emit("success", success);
        });
    }
    apiCallback(request, response, callback) {
        if (request.method === "POST") {
            let data = "";
            request.on("data", (chunk) => {
                data += chunk.toString();
            });
            request.on("end", () => {
                data = JSON.parse(data);
                const emitActivity = (eventEmitter) => (change) => {
                    const { item } = change.value;
                    const activity = this.actions.has(item) && this.actions.get(item) || item;
                    const activityInfo = {
                        from: change.value.sender_id,
                        raw: change,
                        type: activity,
                    };
                    eventEmitter.emit(activity, activityInfo);
                    eventEmitter.emit("activity", change);
                };
                const entryIterator = (entry) => {
                    const mergeEntryIdWithChange = (change) => Object.assign({}, change, { id: entry.id });
                    const changes = R.has("changes")(entry) ? entry.changes : [];
                    const publishedChanges = changes.filter((change) => change.value && change.value.published !== undefined && change.value.published || 1);
                    return publishedChanges && R.map(mergeEntryIdWithChange, publishedChanges) || [];
                };
                const emitActivityForSocialSubScribe = emitActivity(this);
                return R.has("entry")(data) ?
                    R.forEach(R.compose(R.map(emitActivityForSocialSubScribe), entryIterator), data.entry) : null;
            });
        }
    }
}
exports.SocialSubscribe = SocialSubscribe;
;
//# sourceMappingURL=index.js.map