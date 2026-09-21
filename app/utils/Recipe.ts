import _ from "lodash";
import Big from "big.js";
import type { RecipeJSON } from "~/services/recipe-data-scraper";
import { type MeasurementUnit, Measurement } from "./Measurement";
import type { Ingredient } from "./Ingredient";

export const RECIPE_TAGS = {
    // Courses
    BREAKFAST: Symbol("Breakfast"),
    LUNCH: Symbol("Lunch"),
    SUPPER: Symbol("Supper"),
    DESSERT: Symbol("Dessert"),

    // Form-Factor
    MAIN_DISH: Symbol("Main Dish"),
    SIDE_DISH: Symbol("Side Dish"),
    CAKE: Symbol("Cake"),
    DRINK: Symbol("Drink"),

    CHICKEN: Symbol("Chicken"),
} satisfies Record<string, symbol>;

export type RecipeTag = keyof typeof RECIPE_TAGS;

// TODO: Consider if we use this or recipe-data-scraper object
export interface RecipeData {
    recipeId: any;
    title: string;
    servings: number;
    ingredients: { name: string; quantity: number; unit: string }[];
    cookTime?: any;
    prepTime?: any;
    totalTime?: any;
}

export class Recipe {
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
    private ingredients: Ingredient[] = [];
    private totalPrice: Big = new Big(0);

    constructor(data: RecipeData) {
        this.cookTime = data.cookTime;
        this.prepTime = data.prepTime;
        this.totalTime = data.totalTime;

        this.baseServings = this.servingCount = data.servings;
        this.baseIngredients = this.ingredients = data.ingredients.map((ingredient) => ({
            name: ingredient.name,
            measurement: new Measurement(
                new Big(ingredient.quantity),
                ingredient.unit as MeasurementUnit,
            ),
        }));
        this.baseIngredients.forEach((ingredient) => {
            this.totalPrice = this.totalPrice.plus(_.get(ingredient, "price", new Big(0)));
        });
    }

    /**
     * Utility function to increment servings by a step (e.g. +1, -1)
     *
     * @param n - The amount to adjust servings by
     */
    public adjustServings(n: number): void {
        this.setServings(this.servingCount + n);
    }

    /**
     *
     * @param servings - The new number of servings for the recipe
     */
    public setServings(servings: number): void {
        if (!Number.isInteger(servings)) throw new Error("Servings must be a whole number");

        if (servings < 0) throw new Error("Servings cannot be less than 0");

        this.servingCount = servings;
    }
}
