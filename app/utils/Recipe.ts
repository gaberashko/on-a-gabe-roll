import type { MeasurementUnitData } from "./MeasurementUnit";

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
}

export type RecipeTag = typeof RECIPE_TAGS[keyof typeof RECIPE_TAGS];


interface Ingredient {
    name: string,
    quantity: number,
    unit: MeasurementUnitData,
    price?: number
}

class Recipe {
    private displayImage?: ImageData,
    private measurementAdjustable?: boolean,
    private recipeTags?: RecipeTag[],
    private
    
    constructor() {}

}