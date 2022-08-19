import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormValidationService } from '../../services/formValidation.service';

@Component({
  selector: 'app-behaviormodel-modal-nodesettingsbue',
  templateUrl: './behaviormodel-modal-nodesettingsbue.component.html',
  styleUrls: ['./behaviormodel-modal-nodesettingsbue.component.css']
})

// NodeSettingsBUE: Node settings modal for Bookmark, Unbookmark and End nodes
export class BehaviorModelModalNodeSettingsBUEComponent {

  public nodeSettingsForm: FormGroup;
  public nodeName: string;
  private existingNodeNames: string[];
  public onSubmit = new EventEmitter();

  // Constructor: Injects dependencies, retrieves the name of the node being edited, retrieves the list of existing node names needed for validation, and initializes the form
  constructor(@Inject(MAT_DIALOG_DATA)
              public data: any,
              private fb: FormBuilder,
              private _formValidationService: FormValidationService) {
    this.nodeName = this.data.nodeName;
    
    this.existingNodeNames = this.data.existingNodeNames;
    var index = this.existingNodeNames.indexOf(this.nodeName);
    if (index !== -1) {
      this.existingNodeNames.splice(index, 1);
    }

    this.nodeSettingsForm = this.fb.group({
      nodeName: [this.nodeName, [Validators.required, this.existingNodeNameValidator(), this.invalidCharactersValidator()]]
    });
  }

  // Event triggered when the user presses the OK button on the modal, and which emits the form data to the parent controller
  public onOKButtonClicked = () => {
    var output = {
      nodeName: this.nodeSettingsForm.get('nodeName')?.value.trim().replace(/_/g, '')
    }
    this.onSubmit.emit(output);
  }

  // Validation to check if the name of the node is already in use
  private existingNodeNameValidator = (): ValidatorFn => {
    return this._formValidationService.existingNodeNameValidator(this.existingNodeNames);
  }

  // Validation to check if the input text only contains letters, numbers and spaces
  private invalidCharactersValidator = (): ValidatorFn => {
    return this._formValidationService.invalidCharactersValidator();
  }

  // Clears an input field
  public clearTextInput = (input: string) => {
    this.nodeSettingsForm.patchValue({[input]: ''});
  }
  
}
