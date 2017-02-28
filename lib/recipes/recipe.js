"use strict";
const fbRecipe = require("./facebook");
const recipes = new Map();
recipes.set(fbRecipe.name, fbRecipe);
exports.getRecipe = (socialNetwork) => recipes.get(socialNetwork).recipe;
exports.getApiCallback = (socialNetwork) => recipes.get(socialNetwork).apiCallbackHandlerFn;
//# sourceMappingURL=recipe.js.map