import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator, FormControl } from '@angular/forms';

@Directive({
   selector: '[validNIF]',
   // We add our directive to the list of existing validators
   providers: [
     { provide: NG_VALIDATORS, useExisting: ValidNIFDirective, multi: true }
   ]
})
export class ValidNIFDirective implements Validator {
    // This method is the one required by the Validator interface
    validate(c: FormControl): ValidationErrors | null {
        // Here we call our static validator function 
        return ValidNIFDirective.validateNif(c);
    }

    static validateNif(control: FormControl): ValidationErrors {
        var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
        var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
        var nieRexp = /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]$/i;
        var str = control.value.toString().toUpperCase();
    
        if (!nifRexp.test(str) && !nieRexp.test(str)) return {nif : 'error'};
    
        var nie = str
            .replace(/^[X]/, '0')
            .replace(/^[Y]/, '1')
            .replace(/^[Z]/, '2');
    
        var letter = str.substr(-1);
        var charIndex = parseInt(nie.substr(0, 8)) % 23;
    
        if (validChars.charAt(charIndex) === letter) return null;
    
        return {nif : 'error'};
    }
}