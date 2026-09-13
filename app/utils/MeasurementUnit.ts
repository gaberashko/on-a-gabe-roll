import Big from "big.js";

export const BASE_ANCHORS = { VOLUME: "ml", WEIGHT: "g" } as const;

export interface MeasurementUnitData {
    label: string;
    aliases: readonly string[];
    system: "metric" | "imperial" | "neutral";
    type: "volume" | "weight" | "count";
    baseValue: Big;
}

export const MEASUREMENT_UNITS = {
    // Volume Units
    tsp: {
        label: "tsp",
        aliases: ["tsp", "teaspoon", "tsp.", "tsps", "teaspoons", "tsps."],
        system: "imperial",
        type: "volume",
        baseValue: new Big(4.92892),
    },
    tbsp: {
        label: "tbsp",
        aliases: ["tbsp", "tablespoon", "tbsp.", "tbsps", "tablespoons", "tsps."],
        system: "imperial",
        type: "volume",
        baseValue: new Big(14.7868),
    },
    cup: {
        label: "cup",
        aliases: ["cup", "cups", "c."],
        system: "imperial",
        type: "volume",
        baseValue: new Big(236.588),
    },
    "fl oz": {
        label: "fl oz",
        aliases: ["fl oz", "fl oz.", "fl. oz.", "fluid ounce", "fluid ounces"],
        system: "imperial",
        type: "volume",
        baseValue: new Big(29.5735),
    },
    // (BASE_ANCHOR.VOLUME)
    ml: {
        label: "ml",
        aliases: ["ml", "milliliter", "ml.", "mls", "milliliters", "mls.", "mL", "mL."],
        system: "metric",
        type: "volume",
        baseValue: new Big(1),
    },
    // Weight Units
    lb: {
        label: "lb",
        aliases: ["lb", "pound", "lb.", "lbs", "pounds", "lbs."],
        system: "imperial",
        type: "weight",
        baseValue: new Big(453.592),
    },
    // (BASE_ANCHOR.WEIGHT)
    g: {
        label: "g",
        aliases: ["g", "gram", "g.", "grams"],
        system: "metric",
        type: "weight",
        baseValue: new Big(1),
    },
} as const satisfies Record<string, MeasurementUnitData>;

export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[keyof typeof MEASUREMENT_UNITS]["label"];

/**
 * Converts a given quantity of the first unit of measurement to the quantity of the second unit
 * of measurement
 *
 * @param measurement - The measurement of the unit to be converted
 * @param fromUnit - The unit to be converted
 * @param toUnit - The desired unit of measurement
 * @returns The measurement as represented in the second unit of measurement
 */
export function convertUnit(
    measurement: number,
    fromUnit: MeasurementUnit,
    toUnit: MeasurementUnit,
): Big {
    const [fromUnitData, toUnitData] = [MEASUREMENT_UNITS[fromUnit], MEASUREMENT_UNITS[toUnit]];

    if (!fromUnitData || !toUnitData) throw new Error("Invalid units!");
    if (fromUnitData.type !== toUnitData.type) throw new Error("Unit type mismatch!");

    const convertedMeasurement: Big = new Big(measurement)
        .times(fromUnitData.baseValue)
        .div(toUnitData.baseValue);

    return convertedMeasurement;
}
