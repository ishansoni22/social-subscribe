"use strict";
const Task = require("data.task");
const R = require("ramda");
const events_1 = require("events");
const recipe_1 = require("./recipes/recipe");
const helpers = require("./recipes/index");
exports.socialSubscribeHelpers = helpers;
class SocialSubscribe extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.recipe = recipe_1.getRecipe(config.socialNetwork);
    }
    start() {
        this.recipe(this.config).fork((error) => {
            this.emit("error", error);
        }, (success) => {
            this.emit("success", success);
        });
    }
}
exports.SocialSubscribe = SocialSubscribe;
;
exports.apiCallback = (socialNetwork) => recipe_1.getApiCallback(socialNetwork);
//# sourceMappingURL=index.js.map