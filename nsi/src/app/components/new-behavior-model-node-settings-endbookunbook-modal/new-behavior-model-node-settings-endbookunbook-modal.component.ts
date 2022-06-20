import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-behavior-model-node-settings-endbookunbook-modal',
  templateUrl: './new-behavior-model-node-settings-endbookunbook-modal.component.html',
  styleUrls: ['./new-behavior-model-node-settings-endbookunbook-modal.component.css']
})
export class NewBehaviorModelNodeSettingsEndbookunbookModalComponent {

  public nodeSettingsForm: FormGroup;
  public nodeName: string;
  private existingNodeNames: string[];
  public onSubmit = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {

    this.nodeName = this.data.nodeName;
    
    this.existingNodeNames = this.data.existingNodeNames;
    var index = this.existingNodeNames.indexOf(this.nodeName);
    if (index !== -1) {
      this.existingNodeNames.splice(index, 1);
    }

    this.nodeSettingsForm = this.fb.group({
      nodeName: [this.nodeName, [Validators.required, this.existingNameValidator(this.existingNodeNames)]]
    });

  }

  public onOKButtonClicked = () => {
    var output = {
      nodeName: this.nodeSettingsForm.get('nodeName')?.value.trim().replace(/_/g, '')
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

  public clearTextInput = (input: string) => {

    this.nodeSettingsForm.patchValue({[input]: ''});

  }
  
}
