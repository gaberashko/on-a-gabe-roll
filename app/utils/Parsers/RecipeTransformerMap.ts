
// // Type for transformer functions
// type TransformerFunction = (value: any, key?: string) => any;

// interface PropertyTransformerMap {
//   [key: string]: TransformerFunction;
// }

// const propertyTransformerMap: PropertyTransformerMap = {
//   name: transformToString,
//   image: transformImage, // can just be string OR object with url, caption, width, height, thumbnail can be an array of strings
//   description: transformToCleanString,
//   cookTime: transformToTime,
//   prepTime: transformToTime,
//   totalTime: transformToTime,
//   cookTimeOriginalFormat: transformToString,
//   prepTimeOriginalFormat: transformToString,
//   totalTimeOriginalFormat: transformToString,
//   recipeYield: transformToString,
//   recipeIngredients: transformToIngredients,
//   recipeInstructions: transformInstructions, // could be an array howtosteps - each has text with string
//   recipeCategories: transformToList, // array
//   recipeCuisines: transformToList, // array
//   recipeTypes: transformToList,
//   keywords: transformToList,
// };

// export default propertyTransformerMap; 