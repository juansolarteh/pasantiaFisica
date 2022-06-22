import { AbstractControl, ValidationErrors } from "@angular/forms"
import * as moment from "moment";

export class FormValidators{

    static today = moment().format('yyyy-MM-D');

    static noPrevDatesFromNow = (
        control: AbstractControl
    ): ValidationErrors | null => {
        const end = control.value
        if (end || end != '') {       
            return moment(end).isSameOrAfter(this.today)
                ? null
                : { noPrevDatesFromNow: true }
        }
        return null
    }
}