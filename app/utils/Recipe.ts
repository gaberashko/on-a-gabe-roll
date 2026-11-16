import _ from "lodash";
import Big from "big.js";
import type { RecipeJSON } from "~/services/recipe-data-scraper";
import type { Ingredient } from "./Ingredient";
import type { SectionalRecipeData, SectionalInstructions } from "./types";
import { type MeasurementUnit, Measurement } from "./Measurement";

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

export class Recipe {
    private displayImage?: string | ImageData;
    private recipeTags?: RecipeTag[];
    private measurementAdjustable?: boolean;
    private readonly baseServings: number;
    private readonly baseIngredientSections: IngredientSection[];
    private readonly instructionSections: SectionalInstructions[];

    private recipeId: string;
    private servingCount: number;
    private cookTime?: any;
    private prepTime?: any;
    private totalTime?: any;
    private ingredients: Ingredient[] = [];
    private totalPrice: Big = new Big(0);

    constructor(
        data: SectionalRecipeData & {
            imageUrl?: string;
            cookTime?: any;
            prepTime?: any;
            totalTime?: any;
        },
    ) {
        this.recipeId = data.recipeId;
        this.title = data.title;
        this.displayImage = data.imageUrl;
        this.cookTime = data.cookTime;
        this.prepTime = data.prepTime;
        this.totalTime = data.totalTime;

        this.baseServings = this.servingCount = data.servings > 0 ? data.servings : 1;
        this.baseIngredientSections = data.sectionalIngredients.map((section) => ({
            sectionTitle: section.sectionTitle,
            ingredients: section.ingredients.map((ingredient) => {
                const ingredientObj: Ingredient = {
                    name: ingredient.name,
                    measurement: new Measurement(
                        new Big(ingredient.quantity),
                        ingredient.unit as MeasurementUnit
                    )
                };
                this.totalPrice = this.totalPrice.plus(_.get(ingredientObj, "price", new Big(0)));

                return ingredientObj;
            })
    }))

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
