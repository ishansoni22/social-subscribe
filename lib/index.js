"use strict";
const Task = require("data.task");
const R = require("ramda");
const events_1 = require("events");
const recipe_1 = require("./recipes/recipe");
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
exports.apiCallback = (request, response, callback, callbackConfig, socialNetwork) => {
    const recipeAPICallback = recipe_1.getApiCallback(socialNetwork);
    recipeAPICallback(callbackConfig)(callback)(request)(response);
};
//# sourceMappingURL=index.js.map