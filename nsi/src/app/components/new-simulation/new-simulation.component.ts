import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { SimulationAddedModalComponent } from '../simulation-added-modal/simulation-added-modal.component';

@Component({
  selector: 'app-new-simulation',
  templateUrl: './new-simulation.component.html',
  styleUrls: ['./new-simulation.component.css']
})

export class NewSimulationComponent implements OnInit {

  public simulationForm: FormGroup;
  private simulationExistingNames: string[] = [];

  constructor(private fb: FormBuilder, private _simulationService: SimulationService, public dialog: MatDialog, private router: Router) {

    this.simulationForm = this.fb.group({
      name: ['', [Validators.required, this.existingNameValidator()]],
      description: ['', Validators.required],
      numberStudents: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      domain: ['', Validators.required],
      task: ['', Validators.required],
      numberDocuments: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      numberRelevantDocuments: [{value: '', disabled: true}, [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1), this.lessThanNumberDocumentsValidator()]],
      randomActions: ['', Validators.required],
      length: ['', [this.lengthValidator(), this.maxLengthValidator()]],
      interval: ['', [Validators.required, this.numberValidator(), this.integerNumberValidator(), Validators.min(1)]],
      speed: [1],
    });

  }

  ngOnInit(): void {

    this._simulationService.getSimulations().subscribe((data: any) => {
      let simulationList = data;

      for (let i = 0; i < simulationList.length; i++) {
        this.simulationExistingNames.push(simulationList[i].name);
      }
    }, (error: any) => {
      console.log(error);
    })

  }

  public addSimulation = () => {

    const SIMULATION: Simulation = {
      name: this.simulationForm.get('name')?.value,
      description: this.simulationForm.get('description')?.value,
      numberStudents: this.simulationForm.get('numberStudents')?.value,
      domain: this.simulationForm.get('domain')?.value,
      task: this.simulationForm.get('task')?.value,
      numberDocuments: this.simulationForm.get('numberDocuments')?.value,
      numberRelevantDocuments: this.simulationForm.get('numberRelevantDocuments')?.value,
      randomActions: this.simulationForm.get('randomActions')?.value,
      expiration: true, // ATENCION
      queryList: [], // ATENCION
      behaviorModelId: '-1', // ATENCION
      length: this.lengthToSeconds(this.simulationForm.get('length')?.value),
      sensibility: 90, // ATENCION
      interval: this.simulationForm.get('interval')?.value,
      speed: this.simulationForm.get('speed')?.value,
      creationDate: (new Date(Date.now())).toString(),
      lastDeployDate: (new Date(0)).toString()
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

      const value = parseInt(control.value);

      if (!value) {
          return null;
      }

      const numberDocuments = control.parent?.get('numberDocuments')?.value;

      const lessThanNumberDocuments = (value <= numberDocuments);
      const forbidden = !lessThanNumberDocuments;

      return forbidden ? {lessThanNumberDocuments: {value: value}} : null;

    };

  }

  public onNumberDocumentsChange = () => {

    if (!this.simulationForm.get('numberDocuments')?.hasError('required') &&
        !this.simulationForm.get('numberDocuments')?.hasError('notNumber') &&
        !this.simulationForm.get('numberDocuments')?.hasError('notInteger') &&
        !this.simulationForm.get('numberDocuments')?.hasError('min')) {
      this.simulationForm.get('numberRelevantDocuments')?.enable();
    } else {
      this.simulationForm.get('numberRelevantDocuments')?.patchValue('');
      this.simulationForm.get('numberRelevantDocuments')?.disable();
    }

  }

  private lengthToSeconds = (length: string) => {

    var minutes = parseInt(length.slice(0, 2));
    var seconds = parseInt(length.slice(-2));
    return minutes * 60 + seconds;

  }

}