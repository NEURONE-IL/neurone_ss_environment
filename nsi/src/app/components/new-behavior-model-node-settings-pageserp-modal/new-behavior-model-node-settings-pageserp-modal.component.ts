import { Component, EventEmitter, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-behavior-model-node-settings-pageserp-modal',
  templateUrl: './new-behavior-model-node-settings-pageserp-modal.component.html',
  styleUrls: ['./new-behavior-model-node-settings-pageserp-modal.component.css']
})

export class NewBehaviorModelNodeSettingsPageserpModalComponent {

  public nodeSettingsForm: FormGroup;
  public nodeName: string;
  public minTransitionTime: string = "";
  public maxTransitionTime: string = "";
  public relevantPage: string;
  private existingNodeNames: string[];
  public onSubmit = new EventEmitter();
  private minTransitionTimeSubscribe: Subscription | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {

    this.nodeName = this.data.nodeName;

    if (this.data.minTransitionTime != -1) {
      this.minTransitionTime = this.data.minTransitionTime.toString();
    }

    if (this.data.maxTransitionTime != -1) {
      this.maxTransitionTime = this.data.maxTransitionTime.toString();
    }

    this.relevantPage = this.data.relevantPage.toString();

    this.existingNodeNames = this.data.existingNodeNames;
    var index = this.existingNodeNames.indexOf(this.nodeName);
    if (index !== -1) {
      this.existingNodeNames.splice(index, 1);
    }

    this.nodeSettingsForm = this.fb.group({
      nodeName: [this.nodeName, [Validators.required, this.existingNameValidator(this.existingNodeNames)]],
      minTransitionTime: [this.minTransitionTime, [this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      maxTransitionTime: [this.maxTransitionTime, [this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.moreThanMinTransitionTimeValidator()]],
      relevantPage: [this.relevantPage, Validators.required]
    });

    this.minTransitionTimeSubscribe = this.nodeSettingsForm.controls['minTransitionTime']?.valueChanges.subscribe((value: string) =>
      this.nodeSettingsForm.controls['maxTransitionTime'].updateValueAndValidity()
    );

  }

  ngOnDestroy() {
    this.minTransitionTimeSubscribe?.unsubscribe();
  }

  public onOKButtonClicked = () => {
    var minTransitionTime = -1;
    var maxTransitionTime = -1;

    if (this.nodeSettingsForm.get('minTransitionTime')?.value != "") {
      minTransitionTime = parseInt(this.nodeSettingsForm.get('minTransitionTime')?.value);
    }

    if (this.nodeSettingsForm.get('maxTransitionTime')?.value != "") {
      maxTransitionTime = parseInt(this.nodeSettingsForm.get('maxTransitionTime')?.value);
    }

    var output = {
      nodeName: this.nodeSettingsForm.get('nodeName')?.value.trim().replace(/_/g, ''),
      minTransitionTime: this.nodeSettingsForm.get('minTransitionTime')?.value,
      maxTransitionTime: this.nodeSettingsForm.get('maxTransitionTime')?.value,
      relevantPage: this.nodeSettingsForm.get('relevantPage')?.value === 'true'
    }
    this.onSubmit.emit(output);
  }

  private existingNameValidator = (existingNodeNames: string[]): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      let value = control.value.trim().replace(/_/g, '');

      if (!value) {
          return null;
      }

      let nameDoesntExist = true;

      for (let i = 0; i < existingNodeNames.length; i++) {
        if (existingNodeNames[i].toLowerCase() === value.toLowerCase()) {
          nameDoesntExist = false;
          break;
        }
      }

      const forbidden = !nameDoesntExist;

      return forbidden ? {nameExists: {value: value}} : null;
      
    };
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

  private moreThanMinTransitionTimeValidator = (): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      if (!/^[0-9]*[1-9][0-9]*$/.test(control.parent?.get('minTransitionTime')?.value)) {

        return null;

      }

      else {

        const value = parseInt(control.value);

        if (!value) {
            return null;
        }

        const minTransitionTime = control.parent?.get('minTransitionTime')?.value;
        let moreThanMinTransitionTime = true;

        if (/^\d+$/.test(minTransitionTime)) {
          if (parseInt(minTransitionTime, 10) >= 1) {
            moreThanMinTransitionTime = (value >= parseInt(minTransitionTime, 10));
          }
        }
        
        const forbidden = !moreThanMinTransitionTime;

        return forbidden ? {moreThanMinTransitionTime: {value: value}} : null;

      }

    };

  }

  public onTransitionTimeChange = () => {

    this.nodeSettingsForm.get('minTransitionTime')?.updateValueAndValidity();
    this.nodeSettingsForm.get('maxTransitionTime')?.updateValueAndValidity();

  }
  
  public clearTextInput = (input: string) => {

    this.nodeSettingsForm.patchValue({[input]: ''});
    this.nodeSettingsForm.get('minTransitionTime')?.updateValueAndValidity();
    this.nodeSettingsForm.get('maxTransitionTime')?.updateValueAndValidity();

  }
  
}
