import { ObjectDB } from "./ObjectDB";

export interface PracticeExecution {
    plantName: string,
    constants?: ObjectDB<number[]>[],
    units: any;
    range: any;
} 