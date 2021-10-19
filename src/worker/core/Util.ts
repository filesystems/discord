//@ts-ignore - Has no types
import NodeSplit = require("node-split");

import chalk from "chalk";

/**
 * Class with utility functions
 */
export default class Util {

    public static errors: Error[] = [];

    /**
   * Logs all errors
   */
    public static logErrors(): void {
        Util.errors.forEach(e => Util.error(e.toString()))

        Util.log("cache", "Found", this.errors.length, "error(s)");

        Util.errors = [];
    }

    /**
     * posts a message to the console log with colors
     * 
     * @param text {string}
     */
    public static error(text: string): void {
        console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]`,
            `${chalk.red("Error")}:`,
            text
        )
    }

    /**
     * logs an error
     * 
     * @param name {string[]}
     * @param data {any[]}
     */
    public static log(name: string, ...data: any[]): void {
        console.log(
            `[${chalk.gray(new Date().toLocaleTimeString())}]`,
            `(${chalk.cyan(name)})`,
            ...data
        )
    }

    /**
     * Split buffer data into chunks by size
     * 
     * @param data File data to be splitted
     * @param options Options
     * @returns {Promise<Buffer[]>}
     */
    public static splitBytes(data: Blob, options: {
        bytes: string
    } = { bytes: '8MB' }): Promise<Blob[]> {
        return new Promise(resolve => {
            let startPointer = 0;
            let endPointer = data.size;
            let chunks = [];
            while (startPointer < endPointer) {
                let newStartPointer = startPointer + 8e+6;
                chunks.push(data.slice(startPointer, newStartPointer));
                startPointer = newStartPointer;
            }
            resolve(chunks);
        })
    }
}