import { Component, EventEmitter, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormValidationService } from '../../services/formValidation.service';

@Component({
  selector: 'app-behaviormodel-modal-nodesettingsq',
  templateUrl: './behaviormodel-modal-nodesettingsq.component.html',
  styleUrls: ['./behaviormodel-modal-nodesettingsq.component.css']
})

// NodeSettingsQ: Node settings modal for Query nodes
export class BehaviorModelModalNodeSettingsQComponent {

  public nodeSettingsForm: FormGroup;
  public nodeName: string;
  public minTransitionTime: string = "";
  public maxTransitionTime: string = "";
  private existingNodeNames: string[];
  public onSubmit = new EventEmitter();
  private minTransitionTimeSubscribe: Subscription | null = null;

  // Constructor: Injects dependencies, retrieves the data of the node being edited, retrieves the list of existing node names needed for validation, and initializes the form
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any,
              private fb: FormBuilder,
              private _formValidationService: FormValidationService) {
    this.nodeName = this.data.nodeName;

    if (this.data.minTransitionTime != -1) {
      this.minTransitionTime = this.data.minTransitionTime.toString();
    }

    if (this.data.maxTransitionTime != -1) {
      this.maxTransitionTime = this.data.maxTransitionTime.toString();
    }

    this.existingNodeNames = this.data.existingNodeNames;
    var index = this.existingNodeNames.indexOf(this.nodeName);
    if (index !== -1) {
      this.existingNodeNames.splice(index, 1);
    }

    this.nodeSettingsForm = this.fb.group({
      nodeName: [this.nodeName, [Validators.required, this.existingNodeNameValidator(), this.invalidCharactersValidator()]],
      minTransitionTime: [this.minTransitionTime, [this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      maxTransitionTime: [this.maxTransitionTime, [this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.moreThanMinTransitionTimeValidator()]],
    });

    this.minTransitionTimeSubscribe = this.nodeSettingsForm.controls['minTransitionTime']?.valueChanges.subscribe((value: string) =>
      this.nodeSettingsForm.controls['maxTransitionTime'].updateValueAndValidity()
    );
  }

  // ngOnDestroy: Applies the necessary unsubscribe methods
  ngOnDestroy() {
    this.minTransitionTimeSubscribe?.unsubscribe();
  }

  // Event triggered when the user presses the OK button on the modal, and which emits the form data to the parent controller
  public onOKButtonClicked = () => {
    var minTransitionTime = -1;
    var maxTransitionTime = -1;

    if (this.nodeSettingsForm.get('minTransitionTime')?.value.trim() != "") {
      minTransitionTime = parseInt(this.nodeSettingsForm.get('minTransitionTime')?.value.trim());
    }

    if (this.nodeSettingsForm.get('maxTransitionTime')?.value.trim() != "") {
      maxTransitionTime = parseInt(this.nodeSettingsForm.get('maxTransitionTime')?.value.trim());
    }

    var output = {
      nodeName: this.nodeSettingsForm.get('nodeName')?.value.trim().replace(/_/g, ''),
      minTransitionTime: minTransitionTime,
      maxTransitionTime: maxTransitionTime
    }
    this.onSubmit.emit(output);
  }

  // Validation to check if the name of the node is already in use
  private existingNodeNameValidator = (): ValidatorFn => {
    return this._formValidationService.existingNodeNameValidator(this.existingNodeNames);
  }

  // Validation to check if the input is a number
  private numberValidator = (): ValidatorFn => {
    return this._formValidationService.numberValidator();
  }

  // Validation to check if the input is an integer number
  private integerNumberValidator = (): ValidatorFn => {
    return this._formValidationService.integerNumberValidator();
  }

  // Validation to check if the maximum transition time is greater than or equal to the minimum transition time
  private moreThanMinTransitionTimeValidator = (): ValidatorFn => {
    return this._formValidationService.moreThanMinTransitionTimeValidator();
  }

  // Validation to check if the input text only contains letters, numbers and spaces
  private invalidCharactersValidator = (): ValidatorFn => {
    return this._formValidationService.invalidCharactersValidator();
  }

  // Rechecks the form when the transition time input fields are modified
  public onTransitionTimeChange = () => {
    this.nodeSettingsForm.get('minTransitionTime')?.updateValueAndValidity();
    this.nodeSettingsForm.get('maxTransitionTime')?.updateValueAndValidity();
  }
  
  // Clears an input field
  public clearTextInput = (input: string) => {
    this.nodeSettingsForm.patchValue({[input]: ''});
    this.nodeSettingsForm.get('minTransitionTime')?.updateValueAndValidity();
    this.nodeSettingsForm.get('maxTransitionTime')?.updateValueAndValidity();
  }
  
}
