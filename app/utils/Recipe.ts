import Big from "big.js";
import {type MeasurementUnit, Measurement} from "./Measurement"
import type { Ingredient } from "./Ingredient";

export const RECIPE_TAGS = {
    // Courses
    BREAKFAST: Symbol("Breakfast"),
    LUNCH: Symbol("Lunch"),
    SUPPER: Symbol("Supper"),
    DESSERT: Symbol("Dessert"),

    // Form-Factor
    DRINK: Symbol("Drink"),
    MAIN_DISH: Symbol("Main Dish"),
    SIDE_DISH: Symbol("Side Dish"),
    CHEESECAKE: Symbol("Cheesecake"),

    CHICKEN: Symbol("Chicken"),
} satisfies Record<string, symbol>;

export type RecipeTag = keyof typeof RECIPE_TAGS;

export interface RecipeData {
    recipeId: any;
    title: string;
    servings: number;
    ingredients: {name: string; quantity: number; unit: string}[];
    cookTime?: any;
    prepTime?: any;
    totalTime?: any;
}

class Recipe {
    private displayImage?: ImageData = new ImageData(1, 1);
    private recipeTags?: RecipeTag[];
    private measurementAdjustable?: boolean;
    private baseServings: number;
    private baseIngredients: Ingredient[];

    private recipeId: any;
    private servingCount: number;
    private cookTime: any;
    private prepTime: any;
    private totalTime: any;
    private ingredients: Ingredient[];
    private totalPrice: Big;

    constructor(data: RecipeData) {
        this.cookTime = data.cookTime
        this.prepTime = data.prepTime
        this.totalTime = data.totalTime

        this.baseServings = this.servingCount = data.servings
        this.baseIngredients = data.ingredients.map(ingredient => ({
            name: ingredient.name,
            measurement: new Measurement(new Big(ingredient.quantity), ingredient.unit as MeasurementUnit)
        }))



    }

    /**
     * Utility function to increment servings by a step (e.g. +1, -1)
     * 
     * @param n - The amount to adjust servings by
     */
    public adjustServings(n: number): void {
        this.setServings(this.servingCount + n)
    }

    /**
     * 
     * @param servings - The new number of servings for the recipe
     */
    public setServings(servings: number): void {
        if (!Number.isInteger(servings)) throw new Error('Servings must be a whole number')
        
        if (servings < 0) throw new Error ('Servings cannot be less than 0')

        this.servingCount = 
    }
}
