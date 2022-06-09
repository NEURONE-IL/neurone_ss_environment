import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

import { SimulationEditedModalComponent } from '../simulation-edited-modal/simulation-edited-modal.component';

@Component({
  selector: 'app-edit-simulation',
  templateUrl: './edit-simulation.component.html',
  styleUrls: ['./edit-simulation.component.css']
})

export class EditSimulationComponent implements OnInit {

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

  constructor(private fb: FormBuilder, private _simulationService: SimulationService, private _behaviorModelService: BehaviorModelService, public dialog: MatDialog, private router: Router) {

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {

      if (this.router.getCurrentNavigation()?.extras.state!['startEdit'] == true) {
        this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
        this._simulationService.getSimulation(this._id).subscribe((data: Simulation) => {
          this.simulationForm = this.fb.group({
            name: [data.name, [Validators.required, this.existingNameValidator()]],
            description: [data.description, Validators.required],
            numberStudents: [data.numberStudents, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
            numberDocuments: [data.numberDocuments, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
            numberRelevantDocuments: [data.numberRelevantDocuments, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.lessThanNumberDocumentsValidator()]],
            randomActions: [data.randomActions.toString(), Validators.required],
            behaviorModelId: [data.behaviorModelId, Validators.required],
            length: [data.length, [this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(60)]],
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
          console.log(error);
        })
      } else {
        let simulationSettings = this.router.getCurrentNavigation()?.extras.state!;
        this._id = simulationSettings['_id'];
        this.simulationForm = this.fb.group({
          name: [simulationSettings['name'], [Validators.required, this.existingNameValidator()]],
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

    // SOLO PARA QUE EL COMPILADOR NO DIGA QUE SIMULATIONFORM NO ES DEFINITIVAMENTE ASIGNADO EN EL CONSTRUCTOR
    this.simulationForm = this.fb.group({
      name: ['', [Validators.required, this.existingNameValidator()]],
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
        behaviorModelsPropertiesForm.push({_id: behaviorModelsProperties[i]._id, name: behaviorModelsProperties[i].name, valid: "valid"});
      } else {
        behaviorModelsPropertiesForm.push({_id: behaviorModelsProperties[i]._id, name: behaviorModelsProperties[i].name, valid: "invalid"});
      }
    }
    this.behaviorModelsPropertiesFormList = Object.assign([], behaviorModelsPropertiesForm);
    this.behaviorModelsPropertiesFormListWithFilter = Object.assign([], behaviorModelsPropertiesForm);

  }

  ngOnDestroy() {
    this.numberDocumentsSubscribe?.unsubscribe();
  }

  public addSimulation = () => {

    const SIMULATION: Simulation = {
      name: this.simulationForm.get('name')?.value,
      description: this.simulationForm.get('description')?.value,
      numberStudents: this.simulationForm.get('numberStudents')?.value,
      numberDocuments: this.simulationForm.get('numberDocuments')?.value,
      numberRelevantDocuments: this.simulationForm.get('numberRelevantDocuments')?.value,
      randomActions: this.simulationForm.get('randomActions')?.value,
      expiration: true,
      queryList: this.queryList,
      behaviorModelId: this.simulationForm.get('behaviorModelId')?.value,
      length: this.simulationForm.get('length')?.value,
      sensibility: this.simulationForm.get('sensibility')?.value,
      interval: this.simulationForm.get('interval')?.value,
      speed: this.simulationForm.get('speed')?.value,
      creationDate: this.creationDate,
      lastDeployDate: this.lastDeployDate,
      lastModificationDate: (new Date(Date.now())).toString()
    }

    this._simulationService.updateSimulation(this._id, SIMULATION).subscribe(data => {
      console.log("Simulation updated");
      this.openSuccessModal();
    }), (error: any) => {
      console.log(error);
      this.router.navigate(['/', 'simulation-settings'], { state:
        { _id: this._id
      }});
    }

  }

  private openSuccessModal = () => {

    const dialogRef = this.dialog.open(SimulationEditedModalComponent, { width: '25%' } );
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

  public onSliderChange = (event: any) => {

    this.simulationForm.value.speed = event.value;

  }

  public clearTextInput = (input: string) => {

    this.simulationForm.patchValue({[input]: ''});

    if (input === 'numberDocuments') {
      this.simulationForm.patchValue({['numberRelevantDocuments']: ''});
      this.simulationForm.get('numberRelevantDocuments')?.disable();
    }

  }

  private existingNameValidator = (): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      let value = control.value.trim();

      if (!value) {
          return null;
      }

      let nameDoesntExist = true;

      for (let i = 0; i < this.simulationExistingNames.length; i++) {
        if (this.simulationExistingNames[i].toLowerCase() === value.toLowerCase()) {
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

  private lessThanNumberDocumentsValidator = (): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      if (!/^[0-9]*[1-9][0-9]*$/.test(control.parent?.get('numberDocuments')?.value)) {

        return null;

      }

      else {

        const value = parseInt(control.value);

        if (!value) {
            return null;
        }

        const numberDocuments = control.parent?.get('numberDocuments')?.value;

        const lessThanNumberDocuments = (value <= numberDocuments);
        const forbidden = !lessThanNumberDocuments;

        return forbidden ? {lessThanNumberDocuments: {value: value}} : null;

      }

    };

  }

  public openQueryListPage = () => {

    this.router.navigate(['/', 'edit-simulation-query-list'],{ state:
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

  public checkQueryLength = () => {

    return this.queryList.length;

  }

  private revalidateControl = (controlName: string) => {

    if ((this.simulationForm.get(controlName)?.value !== true) &&
      (this.simulationForm.get(controlName)?.value !== false)) {
      this.simulationForm.controls[controlName].markAsTouched();
      this.simulationForm.controls[controlName].markAsDirty();
      this.simulationForm.controls[controlName].updateValueAndValidity();
    }

  }

  public revalidateNumberRelevantDocuments = () => {

    this.simulationForm.controls['numberRelevantDocuments'].markAsTouched();
    this.simulationForm.controls['numberRelevantDocuments'].markAsDirty();
    this.simulationForm.controls['numberRelevantDocuments'].updateValueAndValidity();

  }

  public discardChanges = () => {
    this.router.navigate(['/', 'simulation-settings'], { state:
      { _id: this._id
     }});
  }

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

  public removeFilter = () => {

    this.simulationForm.controls['behaviorModelFilter']!.patchValue('');
    this.behaviorModelsPropertiesFormListWithFilter = Object.assign([], this.behaviorModelsPropertiesFormList);

  }

}

interface behaviorModelProperties {
  _id: string,
  name: string,
  valid: boolean
}

interface behaviorModelPropertiesForm {
  _id: string,
  name: string,
  valid: string
}