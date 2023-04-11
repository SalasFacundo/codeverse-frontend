import { AbstractControl, ValidatorFn } from '@angular/forms';

export class customValidator {

    static dniDuplicated(students: any[], id?: number,): ValidatorFn {

        return (control: AbstractControl): any => {
            if (id) {
                if (students.find(obj => obj.dni == control.value && obj.id != id)) {
                    return { dniDuplicated: true };
                }
            } else {
                if (students.find(obj => obj.dni == control.value)) {
                    return { dniDuplicated: true };
                }
            }
            return null;
        };
    }

    static dniJustNumbers() {
        
        return (control: AbstractControl): any => {
            const regex = /^[0-9]+$/;
            if (control.value.toString().match(regex) !== null) {
                return null;
            } else {
                return { dniJustNumbers: true };
            }
        };
    }
}
