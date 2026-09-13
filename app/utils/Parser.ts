abstract class Parser {
    /**
     * Constructor for an HTML parser that accepts pre-filled list of objects.
     * @param data - Container of objects created from parsed data
     */
    constructor(private _data: any[] = []) {}

    get data(): any[] {
        return this._data
    }

    /**
     * Takes in a string of HTML and sanitizes it for use by recipe-adjacent classes.
     *
     * @param str - The input string (HTML/Markup) to be sanitized
     * @returns Sanitized string to be utilized by recipe-adjacent classes.
     */
    abstract sanitize(str: string): string;

    abstract parseLine(line: string): void;
}
