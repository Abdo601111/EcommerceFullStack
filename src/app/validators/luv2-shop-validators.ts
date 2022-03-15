import { FormControl, ValidationErrors } from '@angular/forms';

export class Luv2ShopValidators {


    static notOnlywhithSpace(control: FormControl): ValidationErrors{
        if((control.value != null) && (control.value.trim().length===0)){
            return {'OnOnlyWithSase': true};
        }else{
            return null;
        }
    }
}
