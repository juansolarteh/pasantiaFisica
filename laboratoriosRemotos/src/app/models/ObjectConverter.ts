import { DocumentData } from "@angular/fire/compat/firestore";
import { ClassConstructor, plainToInstance } from "class-transformer";

export function convertTo<T>(cls: ClassConstructor<T>, docData: DocumentData): T {
    let dataString = JSON.stringify(docData)
    let data = JSON.parse(dataString) as Object
    let newObject: T =  plainToInstance(cls, data)
    return newObject
}
