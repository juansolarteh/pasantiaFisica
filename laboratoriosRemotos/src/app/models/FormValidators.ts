import { AbstractControl, ValidationErrors } from "@angular/forms"
import * as moment from "moment";

export class FormValidators{

    static today = moment().format('yyyy-MM-D');

    static noPrevDatesFromNow = (
        control: AbstractControl
    ): ValidationErrors | null => {
        const date = control.value
        if (date || date != '') {       
            return moment(date).isSameOrAfter(this.today)
                ? null
                : { noPrevDatesFromNow: true }
        }
        return null
    }
}