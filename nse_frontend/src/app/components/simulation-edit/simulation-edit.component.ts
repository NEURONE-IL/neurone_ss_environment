import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behaviorModel';
import { BehaviorModelService } from '../../services/behaviorModel.service';

import { SimulationModalEditedComponent } from '../simulation-modal-edited/simulation-modal-edited.component';
import { SimulationModalModelNotFoundComponent } from '../simulation-modal-modelnotfound/simulation-modal-modelnotfound.component';

import { FormValidationService } from '../../services/formValidation.service';
import { CatchNotFoundErrorService } from '../../services/catchNotFoundError.service';

// Interface that contains the key properties of the behavior models to be displayed on the behavior models dropdown list
interface behaviorModelPropertiesForm {
  _id: string,
  name: string,
  valid: string
}

@Component({
  selector: 'app-simulation-edit',
  templateUrl: './simulation-edit.component.html',
  styleUrls: ['./simulation-edit.component.css']
})

export class SimulationEditComponent implements OnInit {

  public simulationForm: FormGroup;
  public simulationInitialName: string = '';
  private simulationExistingNames: string[] = [];
  private queryList: string[] = [];
  public queryListEmpty: boolean = false;
  public behaviorModelsPropertiesFormList: behaviorModelPropertiesForm[] | null = null;
  public behaviorModelsPropertiesFormListWithFilter: behaviorModelPropertiesForm[] | null = null;
  private _id: string = '';
  private creationDate: string = '';
  private lastDeployDate: string = '';
  private lastModificationDate: string = '';
  private numberDocumentsSubscribe: Subscription | null = null;
  private validBehaviorModelText = $localize`:Text of the form of the New Simulation component:valid`;
  private invalidBehaviorModelText = $localize`:Text of the form of the New Simulation component:invalid`;
  private simulationEdited = false;

  // Constructor: Injects dependencies, and initializes the simulation edit form with the necessary data
  constructor(private fb: FormBuilder,
              private _simulationService: SimulationService,
              private _behaviorModelService: BehaviorModelService,
              public dialog: MatDialog,
              private router: Router,
              private _formValidationService: FormValidationService,
              private _catchNotFoundErrorService: CatchNotFoundErrorService) {
    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {

      if (this.router.getCurrentNavigation()?.extras.state!['startEdit'] == true) {
        this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
        this._simulationService.getSimulation(this._id).subscribe((data: Simulation) => {
          let length = '';
          if (data.length != -1) {
            length = data.length.toString();
          }

          this.simulationForm = this.fb.group({
            name: [data.name, [Validators.required, this.existingNameValidator(), this.invalidCharactersValidator()]],
            description: [data.description, Validators.required],
            numberStudents: [data.numberStudents, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
            numberDocuments: [data.numberDocuments, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
            numberRelevantDocuments: [data.numberRelevantDocuments, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.lessThanNumberDocumentsValidator()]],
            randomActions: [data.randomActions.toString(), Validators.required],
            behaviorModelId: [data.behaviorModelId, Validators.required],
            length: [length, [this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(60)]],
            sensibility: [data.sensibility, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(100)]],
            interval: [data.interval, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
            speed: [data.speed],
            behaviorModelFilter: ['']
          });

          this.queryList = Object.assign([], data.queryList);
          this.queryListEmpty = false;

          this.simulationInitialName = data.name;
          this.creationDate = data.creationDate;
          this.lastDeployDate = data.lastDeployDate;

          this.numberDocumentsSubscribe = this.simulationForm.controls['numberDocuments']?.valueChanges.subscribe((value: string) =>
            this.simulationForm.controls['numberRelevantDocuments'].updateValueAndValidity()
          );

          return;
        }, (error: any) => {
          this._catchNotFoundErrorService.catchSimulationNotFoundError(error);
        })
      } else {
        let simulationSettings = this.router.getCurrentNavigation()?.extras.state!;
        this._id = simulationSettings['_id'];
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
        if (this.queryList.length == 0) {
          this.queryListEmpty = true;
        }

        this.simulationInitialName = simulationSettings['simulationInitialName'];

        this.numberDocumentsSubscribe = this.simulationForm.controls['numberDocuments']?.valueChanges.subscribe((value: string) =>
            this.simulationForm.controls['numberRelevantDocuments'].updateValueAndValidity()
        );

        return;
      }
    } else {
      this.router.navigate(['/', 'home']);
    }

    // The next statement is included only so that the compilator doesn't complain that simulationForm is not definitely assigned in the constructor
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

  // ngOnInit: Retrieves the list of existing simulation names, and the metadata of the existing behavior models, both of which are needed for the edit form
  async ngOnInit() {
    let simulationNamesList = await this._simulationService.getSimulationNames().toPromise();
    for (let i = 0; i < simulationNamesList.length; i++) {
      this.simulationExistingNames.push(simulationNamesList[i]);
    }
    this.simulationExistingNames.splice(this.simulationExistingNames.indexOf(this.simulationInitialName), 1);

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

  // Saves the edited simulation
  public editSimulation = async () => {
    try {
      let simulation = await this._simulationService.getSimulation(this._id).toPromise();
    } catch (error: any) {
      this._catchNotFoundErrorService.catchSimulationNotFoundError(error);
      return;
    }

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
        this.router.navigate(['/', 'simulation-settings'], { state:
          { _id: this._id
         }});
        return;
      });
      dialogRef.afterClosed().subscribe(() => {
        sub.unsubscribe();
        return;
      });
      return;
    }

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
      creationDate: this.creationDate,
      lastDeployDate: this.lastDeployDate,
      lastModificationDate: (new Date(Date.now())).toString()
    }

    this._simulationService.updateSimulation(this._id, SIMULATION).subscribe(data => {
      this.openSuccessModal();
    }), (error: any) => {
      console.log(error);
      this.router.navigate(['/', 'simulation-settings'], { state:
        { _id: this._id
      }});
    }
  }

  // Open the modal that lets the user know that the simulation was edited successfully
  private openSuccessModal = () => {
    const dialogRef = this.dialog.open(SimulationModalEditedComponent, { width: '25%', disableClose: true } );
    const sub = dialogRef.componentInstance.onSubmit.subscribe((value: any) => {
      dialogRef.close();
      this.router.navigate(['/', 'simulation-settings'], { state:
        { _id: this._id
       }});
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

    if (input === 'numberDocuments') {
      this.simulationForm.patchValue({['numberRelevantDocuments']: ''});
      this.simulationForm.get('numberRelevantDocuments')?.disable();
    }
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
    this.router.navigate(['/', 'simulation-editquerylist'],{ state:
      { _id: this._id,
        name: this.simulationForm.get('name')?.value,
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
        speed: this.simulationForm.get('speed')?.value,
        simulationInitialName: this.simulationInitialName
     }});
  }

  // Checks the length of the query list, so that an error message may be displayed if the query list is empty and the query list component has been visited already
  public checkQueryLength = () => {
    return this.queryList.length;
  }

  // Revalidates the controls of the form
  private revalidateControl = (controlName: string) => {
    if ((this.simulationForm.get(controlName)?.value !== true) &&
      (this.simulationForm.get(controlName)?.value !== false)) {
      this.simulationForm.controls[controlName].markAsTouched();
      this.simulationForm.controls[controlName].markAsDirty();
      this.simulationForm.controls[controlName].updateValueAndValidity();
    }
  }

  // Discard the changes made to the simulation and goes back to the simulation settings component
  public discardChanges = async () => {
    try {
      let simulation = await this._simulationService.getSimulation(this._id).toPromise();
    } catch (error: any) {
      this._catchNotFoundErrorService.catchSimulationNotFoundError(error);
      return;
    }

    this.router.navigate(['/', 'simulation-settings'], { state:
      { _id: this._id
    }});
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