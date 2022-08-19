import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behaviorModel';
import { BehaviorModelService } from '../../services/behaviorModel.service';

import { SimulationModalAddedComponent } from '../simulation-modal-added/simulation-modal-added.component';
import { SimulationModalModelNotFoundComponent } from '../simulation-modal-modelnotfound/simulation-modal-modelnotfound.component';

import { FormValidationService } from '../../services/formValidation.service';

// Interface that contains the key properties of the behavior models to be displayed on the behavior models dropdown list
interface behaviorModelPropertiesForm {
  _id: string,
  name: string,
  valid: string
}

@Component({
  selector: 'app-simulation-new',
  templateUrl: './simulation-new.component.html',
  styleUrls: ['./simulation-new.component.css']
})

// Component to configure and add a new simulation
export class SimulationNewComponent implements OnInit {

  public simulationForm: FormGroup;
  private simulationExistingNames: string[] = [];
  private queryList: string[] = [];
  public queryListAccessed: boolean = false;
  public behaviorModelsPropertiesFormList: behaviorModelPropertiesForm[] | null = null;
  public behaviorModelsPropertiesFormListWithFilter: behaviorModelPropertiesForm[] | null = null;
  private numberDocumentsSubscribe: Subscription | null = null;
  private validBehaviorModelText = $localize`:Text of the form of the New Simulation component:valid`;
  private invalidBehaviorModelText = $localize`:Text of the form of the New Simulation component:invalid`;

  // Constructor: Injects dependencies, and initializes the new simulation form with the necessary data
  constructor(private fb: FormBuilder,
              private _simulationService: SimulationService,
              private _behaviorModelService: BehaviorModelService,
              public dialog: MatDialog,
              private router: Router,
              private _formValidationService: FormValidationService) {
    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      let simulationSettings = this.router.getCurrentNavigation()?.extras.state!;
      this.simulationForm = this.fb.group({
        name: [simulationSettings['name'], [Validators.required, this.existingNameValidator(), this.invalidCharactersValidator()]],
        description: [simulationSettings['description'], Validators.required],
        numberStudents: [simulationSettings['numberStudents'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
        numberDocuments: [simulationSettings['numberDocuments'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
        numberRelevantDocuments: [simulationSettings['numberRelevantDocuments'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.lessThanNumberDocumentsValidator()]],
        randomActions: [simulationSettings['randomActions'], Validators.required],
        behaviorModelId: [simulationSettings['behaviorModelId'], Validators.required],
        length: [simulationSettings['length'], [this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(60)]],
        sensibility: [simulationSettings['sensibility'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(100)]],
        interval: [simulationSettings['interval'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
        speed: [simulationSettings['speed']],
        behaviorModelFilter: ['']
      });

      this.queryList = Object.assign([], simulationSettings['queryList']);
      this.queryListAccessed = true;

      this.numberDocumentsSubscribe = this.simulationForm.controls['numberDocuments']?.valueChanges.subscribe((value: string) =>
        this.simulationForm.controls['numberRelevantDocuments'].updateValueAndValidity()
      );

      return;
    }

    this.simulationForm = this.fb.group({
      name: ['', [Validators.required, this.existingNameValidator(), this.invalidCharactersValidator()]],
      description: ['', Validators.required],
      numberStudents: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      numberDocuments: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      numberRelevantDocuments: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.lessThanNumberDocumentsValidator()]],
      randomActions: ['', Validators.required],
      behaviorModelId: ['', Validators.required],
      length: ['', [this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(60)]],
      sensibility: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(100)]],
      interval: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      speed: [1],
      behaviorModelFilter: ['']
    });

    this.numberDocumentsSubscribe = this.simulationForm.controls['numberDocuments']?.valueChanges.subscribe((value: string) =>
      this.simulationForm.controls['numberRelevantDocuments'].updateValueAndValidity()
    );
  }

  // ngOnInit: Retrieves the list of existing simulation names, and the metadata of the existing behavior models, both of which are needed for the new simulation form
  async ngOnInit() {
    let simulationNamesList = await this._simulationService.getSimulationNames().toPromise();
    for (let i = 0; i < simulationNamesList.length; i++) {
      this.simulationExistingNames.push(simulationNamesList[i]);
    }

    Object.keys(this.simulationForm.controls).forEach(field => {
     this.revalidateControl(field);
    })

    let behaviorModelsProperties = await this._behaviorModelService.getBehaviorModelsProperties().toPromise();
    let behaviorModelsPropertiesForm: behaviorModelPropertiesForm[] = [];
    for (let i = 0; i < behaviorModelsProperties.length; i++) {
      if (behaviorModelsProperties[i].valid == true) {
        behaviorModelsPropertiesForm.push({_id: behaviorModelsProperties[i]._id, name: behaviorModelsProperties[i].name, valid: this.validBehaviorModelText});
      } else {
        behaviorModelsPropertiesForm.push({_id: behaviorModelsProperties[i]._id, name: behaviorModelsProperties[i].name, valid: this.invalidBehaviorModelText});
      }
    }
    this.behaviorModelsPropertiesFormList = Object.assign([], behaviorModelsPropertiesForm);
    this.behaviorModelsPropertiesFormListWithFilter = Object.assign([], behaviorModelsPropertiesForm);
  }

  // ngOnDestroy: Applies the necessary unsubscribe methods
  ngOnDestroy() {
    this.numberDocumentsSubscribe?.unsubscribe();
  }

  // Saves the simulation
  public addSimulation = async () => {
    let behaviorModelsProperties = await this._behaviorModelService.getBehaviorModelsProperties().toPromise();
    let selectedModelStillExists = false;
    for (let i = 0; i < behaviorModelsProperties.length; i++) {
      if (behaviorModelsProperties[i]._id == this.simulationForm.get('behaviorModelId')?.value) {
        selectedModelStillExists = true;
        break;
      }
    }

    if (selectedModelStillExists == false) {
      const dialogRef = this.dialog.open(SimulationModalModelNotFoundComponent, { width: '35%', disableClose: true } );
      const sub = dialogRef.componentInstance.onSubmit.subscribe((value: any) => {
        dialogRef.close();
        this.router.navigate(['/', 'home']);
        return;
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
        return;
      });
      return;
    }

    let creationDate = (new Date(Date.now())).toString();

    let formLength = this.simulationForm.get('length')?.value;
    let length: number = -1;
    if (formLength !== '') {
      length = parseInt(formLength);
    }

    const SIMULATION: Simulation = {
      name: this.simulationForm.get('name')?.value.trim(),
      description: this.simulationForm.get('description')?.value,
      numberStudents: parseInt(this.simulationForm.get('numberStudents')?.value),
      numberDocuments: parseInt(this.simulationForm.get('numberDocuments')?.value),
      numberRelevantDocuments: parseInt(this.simulationForm.get('numberRelevantDocuments')?.value),
      randomActions: this.simulationForm.get('randomActions')?.value,
      expiration: true,
      queryList: this.queryList,
      behaviorModelId: this.simulationForm.get('behaviorModelId')?.value,
      length: length,
      sensibility: parseInt(this.simulationForm.get('sensibility')?.value),
      interval: parseInt(this.simulationForm.get('interval')?.value),
      speed: this.simulationForm.get('speed')?.value,
      creationDate: creationDate,
      lastDeployDate: (new Date(0)).toString(),
      lastModificationDate: creationDate
    }

    this._simulationService.createSimulation(SIMULATION).subscribe(data => {
      this.openSuccessModal();
    }), (error: any) => {
      console.log(error);
      this.simulationForm.reset();
    }
  }

  // Open the modal that lets the user know that the simulation was added successfully
  private openSuccessModal = () => {
    const dialogRef = this.dialog.open(SimulationModalAddedComponent, { width: '25%', disableClose: true } );
    const sub = dialogRef.componentInstance.onSubmit.subscribe((value: any) => {
      dialogRef.close();
      this.router.navigate(['/', 'home']);
    });
    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  // Changes the number displayed next to the speed slider, when said slider is moved
  public onSliderChange = (event: any) => {
    this.simulationForm.value.speed = event.value;
  }

  // Clears the text of an input field
  public clearTextInput = (input: string) => {
    this.simulationForm.patchValue({[input]: ''});
  }

  // Validation to check if the name of a simulation is already in use
  private existingNameValidator = (): ValidatorFn => {
    return this._formValidationService.existingNameValidator(this.simulationExistingNames);
  }

  // Validation to check if the input is a number
  private numberValidator = (): ValidatorFn => {
    return this._formValidationService.numberValidator();
  }

  // Validation to check if the input is an integer number
  private integerNumberValidator = (): ValidatorFn => {
    return this._formValidationService.integerNumberValidator();
  }

  // Validation to check if the number of relevant documents is less than or equal to the number of documents
  private lessThanNumberDocumentsValidator = (): ValidatorFn => {
    return this._formValidationService.lessThanNumberDocumentsValidator();
  }

  // Validation to check if the input text only contains letters, numbers and spaces
  private invalidCharactersValidator = (): ValidatorFn => {
    return this._formValidationService.invalidCharactersValidator();
  }

  // Navigates to the query list component
  public openQueryListPage = () => {
    this.router.navigate(['/', 'simulation-newquerylist'],{ state:
      { name: this.simulationForm.get('name')?.value,
        description: this.simulationForm.get('description')?.value,
        numberStudents: this.simulationForm.get('numberStudents')?.value,
        numberDocuments: this.simulationForm.get('numberDocuments')?.value,
        numberRelevantDocuments: this.simulationForm.get('numberRelevantDocuments')?.value,
        randomActions: this.simulationForm.get('randomActions')?.value,
        queryList: this.queryList,
        behaviorModelId: this.simulationForm.get('behaviorModelId')?.value,
        length: this.simulationForm.get('length')?.value,
        sensibility: this.simulationForm.get('sensibility')?.value,
        interval: this.simulationForm.get('interval')?.value,
        speed: this.simulationForm.get('speed')?.value
     }});
  }

  // Checks the length of the query list, so that an error message may be displayed if the query list is empty and the query list component has been visited already
  public checkQueryLength = () => {
    return this.queryList.length;
  }

  // Revalidates the controls of the form
  private revalidateControl = (controlName: string) => {
    if ((this.simulationForm.get(controlName)?.value !== '') &&
      (this.simulationForm.get(controlName)?.value !== true) &&
      (this.simulationForm.get(controlName)?.value !== false)) {
      this.simulationForm.controls[controlName].markAsTouched();
      this.simulationForm.controls[controlName].markAsDirty();
      this.simulationForm.controls[controlName].updateValueAndValidity();
    }
  }

  // Applies a filter to the behavior models list
  public applyFilter = (event: Event) => {
    const filterValue = this.simulationForm.get('behaviorModelFilter')!.value.trim().toLowerCase();
    const currentModelId = this.simulationForm.get('behaviorModelId')?.value;
    for (let i = 0; i < this.behaviorModelsPropertiesFormList!.length; i++) {
      if (this.behaviorModelsPropertiesFormList![i]._id == currentModelId) {
        if (!this.behaviorModelsPropertiesFormList![i].name.trim().toLowerCase().includes(filterValue)) {
          this.simulationForm.controls['behaviorModelId']!.patchValue('');
        }
      }
    }

    this.behaviorModelsPropertiesFormListWithFilter = this.behaviorModelsPropertiesFormList!.filter(
      behaviorModelProperties => behaviorModelProperties.name.trim().toLowerCase().includes(filterValue)
    );
  }

  // Removes the filter of the behavior models list
  public removeFilter = () => {
    this.simulationForm.controls['behaviorModelFilter']!.patchValue('');
    this.behaviorModelsPropertiesFormListWithFilter = Object.assign([], this.behaviorModelsPropertiesFormList);
  }

}