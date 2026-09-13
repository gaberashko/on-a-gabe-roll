import type { Measurement } from "./Measurement";

export const INGREDIENT_TAGS = {} satisfies Record<string, symbol>;
export type IngredientTag = keyof typeof INGREDIENT_TAGS;

// Figure out where to add price

interface nutritionalFacts {
    servingSize?: Measurement;
    calories: Measurement;
    fat?: Measurement;
    sodium?: Measurement;
    carbs?: Measurement;
    sugar?: Measurement;
    fiber?: Measurement;
    protein?: Measurement;
}

export class Ingredient {
    private name: string;
    private measurement: Measurement
}
export interface Ingredient {
    name: string;
    measurement: Measurement;
    ingredientTags?: IngredientTag[];
    nutritionalFacts?: nutritionalFacts;
}


