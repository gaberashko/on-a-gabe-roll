import Big from "big.js";

export const BASE_UNITS = { VOLUME: "ml", WEIGHT: "g" } as const;

interface MeasurementUnitData {
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
    // (BASE_UNITS.VOLUME)
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
    // (BASE_UNITS.WEIGHT)
    g: {
        label: "g",
        aliases: ["g", "gram", "g.", "grams"],
        system: "metric",
        type: "weight",
        baseValue: new Big(1),
    },
} as const satisfies Record<string, MeasurementUnitData>;
export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[keyof typeof MEASUREMENT_UNITS]["label"];

export class Measurement {
    constructor(
        public quantity: Big,
        public readonly unit: MeasurementUnit,
    ) {}

    /**
     * Converts a given quantity of the first unit of measurement to the quantity of the second unit
     * of measurement
     *
     * @param toUnit - The desired unit of measurement
     * @returns The measurement as represented in the second unit of measurement
     */
    public convertTo(toUnit: MeasurementUnit): Measurement {
        const [fromUnitData, toUnitData] = [
            MEASUREMENT_UNITS[this.unit],
            MEASUREMENT_UNITS[toUnit],
        ];

        if (!fromUnitData || !toUnitData) throw new Error("Invalid units!");
        if (fromUnitData.type !== toUnitData.type) throw new Error("Unit type mismatch!");

        const convertedMeasurement: Big = this.quantity
            .times(fromUnitData.baseValue)
            .div(toUnitData.baseValue);

        return new Measurement(convertedMeasurement, toUnit);
    }

    /**
     * Multiplies a measurement by factor argument and returns the new measurement.
     *
     * @param factor - The amount to factor the measurement value by
     * @returns The scaled measurement.
     */
    public scaleBy(factor: Big): Measurement {
        return new Measurement(this.quantity.times(factor), this.unit);
    }
}

/**
 * Takes an input string and matches it to a measurement unit.
 *
 * @param str - Text containing potential reference to unit of measurement
 * @returns Associated measurement unit if identifiable. Otherwise, returns null.
 */
export function getUnitData(str: string): MeasurementUnitData | undefined {
    const measurementUnit: MeasurementUnitData | undefined = (
        MEASUREMENT_UNITS as Record<string, MeasurementUnitData>
    )[str]
        ? (MEASUREMENT_UNITS as Record<string, MeasurementUnitData>)[str]
        : Object.values(MEASUREMENT_UNITS).find((measurementUnit) => {
              measurementUnit.aliases.some((alias) => alias === str);
          });

    return measurementUnit;
}

/**
 * Takes an input string and matches it to a measurement unit label.
 *
 * @param str - Text containing potential reference to unit of measurement
 * @returns Associated measurement unit if identifiable. Otherwise, returns null.
 */
export function getUnitLabel(str: string): MeasurementUnit | undefined {
    const unitLabel: MeasurementUnit | undefined = getUnitData(str)?.label as MeasurementUnit;

    return unitLabel;
}
