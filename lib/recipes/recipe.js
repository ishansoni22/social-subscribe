"use strict";
const fbRecipe = require("./facebook");
const recipes = new Map();
const setRecipeCurry = (recipes) => (externalRecipe) => recipes.set(externalRecipe.name, externalRecipe);
exports.setRecipe = setRecipeCurry(recipes);
exports.setRecipe(fbRecipe);
const getRecipeCurry = (recipes) => (socialNetwork) => recipes.get(socialNetwork).recipe;
exports.getRecipe = getRecipeCurry(recipes);
const getApiCallbackCurry = (recipes) => (socialNetwork) => recipes.get(socialNetwork).apiCallbackHandlerFn;
exports.getApiCallback = getApiCallbackCurry(recipes);
//# sourceMappingURL=recipe.js.map