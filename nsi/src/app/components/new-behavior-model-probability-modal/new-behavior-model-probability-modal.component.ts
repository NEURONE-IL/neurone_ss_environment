import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-behavior-model-probability-modal',
  templateUrl: './new-behavior-model-probability-modal.component.html',
  styleUrls: ['./new-behavior-model-probability-modal.component.css']
})

export class NewBehaviorModelProbabilityModalComponent {

  public probabilityForm: FormGroup;
  public currentProbability: string = "";
  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {

    if (this.data.currentProbability != "(no value)") {
      this.currentProbability = this.data.currentProbability.slice(0, -1);
    }
    
    this.probabilityForm = this.fb.group({
      currentProbability: [this.currentProbability, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(100)]]
    });

  }

  public onOKButtonClicked = () => {
    this.onSubmit.emit(this.probabilityForm.get('currentProbability')?.value);
  }

  private numberValidator = (): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const isNumber = /^-?[0-9]\d*(\.\d+)?$/.test(value);
      const forbidden = !isNumber;

      return forbidden ? {notNumber: {value: value}} : null;

    };

  }

  private integerNumberValidator = (): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const isInteger = /^-?[0-9]\d*(\d+)?$/.test(value);
      const forbidden = !isInteger;

      return forbidden ? {notInteger: {value: value}} : null;

    };

  }

  public clearTextInput = (input: string) => {

    this.probabilityForm.patchValue({[input]: ''});

  }
  
}
