import { defineEventHandler, getQuery, createError } from "h3";
import recipeDataScraper from "~/services/recipe-data-scraper";
import { RecipeJSON } from "~/services/recipe-data-scraper";
import { Recipe } from "~/utils/Recipe";

export default defineEventHandler(async (event) => {
    const { url } = getQuery(event) as { url?: string };

    // 2. Instead of scraping a live site, return placeholder test data instantly
    // return {
    //     success: true,
    //     message: "Your backend server is configured and running properly!",
    //     youPassedThisUrl: url || "No URL was provided",
    //     data: {
    //         name: "Test Pancake Blueprint",
    //         recipeYield: "6 servings",
    //         ingredients: ["2 cups of Flour", "1 tbsp of Sugar", "2 Eggs"],
    //     },
    // };

    if (!url) {
        throw createError({ statusCode: 400, statusMessage: "Target URL is not recognized." });
    }

    // TODO: Uncomment when done testing
    // try {
    //     const recipeData = await recipeDataScraper(url);
    //     console.log("Recipe data:", recipeData);

    //     return { success: true, data: recipeData };
    // } catch (error: any) {
    //     throw createError({
    //         statusCode: 422,
    //         statusMessage: `Failed parsing this domain structure: ${error.message || error}`,
    //     });
    // }

    const mockRecipeJSON = {
        success: true,
        data: {
            name: "Million Dollar Cottage Cheese Bagels",
            image: "https://www.allrecipes.com/thmb/IbFbPrOJtavoomb7uTztvAZZMU0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11934028-Loaded-Cottage-Cheese-Flagels-PIFS-Beauty-4x3-4ca7ba883f874ecb9a860d0fef301afb.jpg",
            description:
                "These million dollar cottage cheese bagels are loaded with bacon, green onion, and Cheddar cheese. With extra protein from cottage cheese, these tackle a hearty appetite for breakfast or lunch. Serve with extra bacon and cheese.",
            cookTime: "20 minutes",
            cookTimeOriginalFormat: "PT20M",
            prepTime: "15 minutes",
            prepTimeOriginalFormat: "PT15M",
            totalTime: "40 minutes",
            totalTimeOriginalFormat: "PT40M",
            recipeYield: "5",
            recipeIngredients: [
                "1 cup low fat cottage cheese",
                "2 tablespoons sour cream",
                "1 cup and 2 tablespoon all-purpose flour, plus additional for working with dough",
                "3 teaspoon baking powder",
                "1 teaspoon salt",
                "1 tablespoon olive oil",
                "2 pieces of bacon, fully cooked and crumbled",
                "1 medium sized green onion, sliced thin",
                "1/4 cup shredded sharp cheddar cheese",
                "1 large egg",
            ],
            recipeInstructions: [
                "Preheat the oven to 375 degrees F (190 degrees C). Line a baking sheet with parchment paper. Add cottage cheese and sour cream to a food processor. Pulse until smooth.",
                "Place cottage cheese mixture in a bowl. Add flour, baking powder, salt, olive oil, bacon, green onion, and Cheddar cheese. Using a large spoon, mix the ingredients together to form a dough. The dough will be very sticky and will take some time to incorporate. Sprinkle on more flour if needed to pull it together.",
                "Turn dough mixture out onto a floured surface. Dust hands with flour and knead the dough until it holds together, 3 to 4 minutes.",
                "Divide dough into 6 pieces. Flatten each piece into a circle. Place on the prepared baking sheet. Make a hole in the center of each flagel with a finger or blunt end of a kitchen knife.",
                "Beat egg in a small dish. Using a pastry brush, brush egg on top of each bagel. Try not to let the egg drip onto the baking sheet as this can cause sticking.",
                "Bake in the preheated oven for 15 minutes, then rotate the baking pan. Bake until golden brown, about 5 more minutes.",
                "Remove from the oven and allow to cool slightly. Can be gently split and stuffed with additional bacon and cheese.",
            ],
            recipeCategories: ["Side Dish", "Breakfast", "Lunch", "Bread"],
            recipeCuisines: ["American"],
            url: "https://www.allrecipes.com/million-dollar-cottage-cheese-bagels-recipe-11934028",
        },
    };
    return mockRecipeJSON;
});
