import dayjs from 'dayjs';
import { JSONObject } from './Datatypes';

export function intersection<A>(setA: Set<A>, setB: Set<A>): Set<A> {
    let intersection = new Set<A>();
    for (let elem of setB) {
        if (setA.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
}

export function haveIntersection<A>(setA: Set<A>, setB: Set<A>) {
    return intersection(setA, setB).size > 0;
}

// Set the precision of a float
export function precise(x: number, n = 3) {
    return x.toPrecision(n);
}

// Parse the date in any format
export function parseDate(input, format?) {
    return dayjs(input, format);
}

export function mapToJSON(map: Map<any, any>): string {
    return JSON.stringify(Object.fromEntries(map));
}

export function mapFromJSON(jsonString: JSONObject): Map<any, any> {
    return new Map<any, any>(Object.entries(jsonString));
}