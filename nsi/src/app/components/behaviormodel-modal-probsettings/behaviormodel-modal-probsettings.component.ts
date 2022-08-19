import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormValidationService } from '../../services/formValidation.service';

@Component({
  selector: 'app-behaviormodel-modal-probsettings',
  templateUrl: './behaviormodel-modal-probsettings.component.html',
  styleUrls: ['./behaviormodel-modal-probsettings.component.css']
})

// Modal to edit the likelihood of transition between two nodes in a behavior model
export class BehaviorModelModalProbSettingsComponent {

  public probabilityForm: FormGroup;
  public currentProbability: string = "";
  public onSubmit = new EventEmitter();

  // Constructor: Injects dependencies, retrieves the likelihood (probability) of the link being edited, and initializes the form
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any,
              private fb: FormBuilder,
              private _formValidationService: FormValidationService) {
    if (this.data.currentProbability != "(no value)") {
      this.currentProbability = this.data.currentProbability.slice(0, -1);
    }
    
    this.probabilityForm = this.fb.group({
      currentProbability: [this.currentProbability, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(100)]]
    });
  }

  // Event triggered when the user presses the OK button on the modal, and which emits the form data to the parent controller
  public onOKButtonClicked = () => {
    this.onSubmit.emit(this.probabilityForm.get('currentProbability')?.value);
  }

  // Validation to check if the input is a number
  private numberValidator = (): ValidatorFn => {
    return this._formValidationService.numberValidator();
  }

  // Validation to check if the input is an integer number
  private integerNumberValidator = (): ValidatorFn => {
    return this._formValidationService.integerNumberValidator();
  }

  // Clears an input field
  public clearTextInput = (input: string) => {
    this.probabilityForm.patchValue({[input]: ''});
  }
  
}
