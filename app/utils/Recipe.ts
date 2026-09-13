import type Big from "big.js";
import type { Ingredient } from './Ingredient';

export const RECIPE_TAGS = {
    // Courses
    BREAKFAST: Symbol('Breakfast'),
    LUNCH: Symbol('Lunch'),
    SUPPER: Symbol('Supper'),
    DESSERT: Symbol('Dessert'),


    // Form-Factor
    DRINK: Symbol('Drink'),
    MAIN_DISH: Symbol('Main Dish'),
    SIDE_DISH: Symbol('Side Dish'),
    CHEESECAKE: Symbol('Cheesecake'),

    CHICKEN: Symbol('Chicken')
} satisfies Record<string, symbol>

export type RecipeTag = keyof typeof RECIPE_TAGS;


}

class Recipe {
    private displayImage?: ImageData,
    private recipeTags?: RecipeTag[],
    private measurementAdjustable?: boolean,
    private servingAdjustable?: boolean,
    
    private recipeId: any,
    private servingCount: number,
    private cookTime: any,
    private prepTime: any,
    private totalTime: any,
    private ingredients: Ingredient[],
    private totalPrice: Big
    
    constructor() {}

}