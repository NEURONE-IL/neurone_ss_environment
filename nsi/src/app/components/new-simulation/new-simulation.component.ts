import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

import { SimulationAddedModalComponent } from '../simulation-added-modal/simulation-added-modal.component';

@Component({
  selector: 'app-new-simulation',
  templateUrl: './new-simulation.component.html',
  styleUrls: ['./new-simulation.component.css']
})

export class NewSimulationComponent implements OnInit {

  public simulationForm: FormGroup;
  private simulationExistingNames: string[] = [];
  private queryList: string[] = [];
  public queryListAccessed: boolean = false;
  public behaviorModelsPropertiesFormList: behaviorModelPropertiesForm[] | null = null;
  private numberDocumentsSubscribe: Subscription | null = null;

  constructor(private fb: FormBuilder, private _simulationService: SimulationService, private _behaviorModelService: BehaviorModelService, public dialog: MatDialog, private router: Router) {

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      let simulationSettings = this.router.getCurrentNavigation()?.extras.state!;
      this.simulationForm = this.fb.group({
        name: [simulationSettings['name'], [Validators.required, this.existingNameValidator()]],
        description: [simulationSettings['description'], Validators.required],
        numberStudents: [simulationSettings['numberStudents'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
        numberDocuments: [simulationSettings['numberDocuments'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
        numberRelevantDocuments: [simulationSettings['numberRelevantDocuments'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.lessThanNumberDocumentsValidator()]],
        randomActions: [simulationSettings['randomActions'], Validators.required],
        expiration: [simulationSettings['expiration'], Validators.required],
        behaviorModelId: [simulationSettings['behaviorModelId'], Validators.required],
        length: [simulationSettings['length'], [this.lengthValidator(), this.maxLengthValidator()]],
        sensibility: [simulationSettings['sensibility'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(100)]],
        interval: [simulationSettings['interval'], [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
        speed: [simulationSettings['speed']]
      });

      this.queryList = Object.assign([], simulationSettings['queryList']);
      this.queryListAccessed = true;

      this.numberDocumentsSubscribe = this.simulationForm.controls['numberDocuments']?.valueChanges.subscribe((value: string) =>
        this.simulationForm.controls['numberRelevantDocuments'].updateValueAndValidity()
      );

      return;
    }

    this.simulationForm = this.fb.group({
      name: ['', [Validators.required, this.existingNameValidator()]],
      description: ['', Validators.required],
      numberStudents: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      numberDocuments: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      numberRelevantDocuments: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.lessThanNumberDocumentsValidator()]],
      randomActions: ['', Validators.required],
      expiration: ['', Validators.required],
      behaviorModelId: ['', Validators.required],
      length: ['', [this.lengthValidator(), this.maxLengthValidator()]],
      sensibility: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), Validators.max(100)]],
      interval: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      speed: [1],
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

  }

  ngOnDestroy() {
    this.numberDocumentsSubscribe?.unsubscribe();
  }

  public addSimulation = () => {

    let creationDate = (new Date(Date.now())).toString();

    const SIMULATION: Simulation = {
      name: this.simulationForm.get('name')?.value,
      description: this.simulationForm.get('description')?.value,
      numberStudents: this.simulationForm.get('numberStudents')?.value,
      numberDocuments: this.simulationForm.get('numberDocuments')?.value,
      numberRelevantDocuments: this.simulationForm.get('numberRelevantDocuments')?.value,
      randomActions: this.simulationForm.get('randomActions')?.value,
      expiration: this.simulationForm.get('randomActions')?.value,
      queryList: this.queryList,
      behaviorModelId: this.simulationForm.get('behaviorModelId')?.value,
      length: this.lengthToSeconds(this.simulationForm.get('length')?.value),
      sensibility: this.simulationForm.get('sensibility')?.value,
      interval: this.simulationForm.get('interval')?.value,
      speed: this.simulationForm.get('speed')?.value,
      creationDate: creationDate,
      lastDeployDate: (new Date(0)).toString(),
      lastModificationDate: creationDate
    }

    this._simulationService.createSimulation(SIMULATION).subscribe(data => {
      console.log("Simulation added");
      this.openSuccessModal();
    }), (error: any) => {
      console.log(error);
      this.simulationForm.reset();
    }

  }

  private openSuccessModal = () => {

    const dialogRef = this.dialog.open(SimulationAddedModalComponent, { width: '25%' } );
    const sub = dialogRef.componentInstance.onSubmit.subscribe((value: any) => {
      dialogRef.close();
      this.router.navigate(['/', 'home']);
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

  private lengthValidator = (): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const validLength = /^(([0]?[0-9][0-9]|[0-9]):([0-9][0-9]))$/.test(value);
      const forbidden = !validLength;

      return forbidden ? {invalidLength: {value: value}} : null;

    };

  }

  private maxLengthValidator = (): ValidatorFn => {

    return (control: AbstractControl): ValidationErrors | null => {

      const value = control.value;

      if (!value) {
          return null;
      }

      const validLength = /^(([0]?[0-5][0-9]|[0-9]):([0-5][0-9]))$/.test(value);
      const forbidden = !validLength;

      return forbidden ? {maxLength: {value: value}} : null;

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

  private lengthToSeconds = (length: string) => {

    var minutes = parseInt(length.slice(0, 2));
    var seconds = parseInt(length.slice(-2));
    return minutes * 60 + seconds;

  }

  public openQueryListPage = () => {

    this.router.navigate(['/', 'query-list'],{ state:
      { name: this.simulationForm.get('name')?.value,
        description: this.simulationForm.get('description')?.value,
        numberStudents: this.simulationForm.get('numberStudents')?.value,
        numberDocuments: this.simulationForm.get('numberDocuments')?.value,
        numberRelevantDocuments: this.simulationForm.get('numberRelevantDocuments')?.value,
        randomActions: this.simulationForm.get('randomActions')?.value,
        expiration: this.simulationForm.get('expiration')?.value,
        queryList: this.queryList,
        behaviorModelId: this.simulationForm.get('behaviorModelId')?.value,
        length: this.simulationForm.get('length')?.value,
        sensibility: this.simulationForm.get('sensibility')?.value,
        interval: this.simulationForm.get('interval')?.value,
        speed: this.simulationForm.get('speed')?.value
     }});

  }

  public checkQueryLength = () => {

    return this.queryList.length;

  }

  private revalidateControl = (controlName: string) => {

    if ((this.simulationForm.get(controlName)?.value !== '') &&
      (this.simulationForm.get(controlName)?.value !== true) &&
      (this.simulationForm.get(controlName)?.value !== false)) {
      this.simulationForm.controls[controlName].markAsTouched();
      this.simulationForm.controls[controlName].markAsDirty();
      this.simulationForm.controls[controlName].updateValueAndValidity();
    }

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