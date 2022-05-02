import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-new-simulation',
  templateUrl: './new-simulation.component.html',
  styleUrls: ['./new-simulation.component.css']
})
export class NewSimulationComponent implements OnInit {

  simulationForm: FormGroup;

  constructor(private fb: FormBuilder, private _simulationService: SimulationService) {
    this.simulationForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      numberStudents: ['', Validators.required],
      domain: ['', Validators.required],
      task: ['', Validators.required],
      numberDocuments: ['', Validators.required],
      numberRelevantDocuments: ['', Validators.required],
      randomActions: ['', Validators.required],
      length: ['', Validators.required],
      interval: ['', Validators.required],
      speed: [1, Validators.required],
    })
  }

  ngOnInit(): void {
  }

  addSimulation() {
    const SIMULATION: Simulation = {
      name: this.simulationForm.get('name')?.value,
      description: this.simulationForm.get('description')?.value,
      numberStudents: this.simulationForm.get('numberStudents')?.value,
      domain: this.simulationForm.get('domain')?.value,
      task: this.simulationForm.get('task')?.value,
      numberDocuments: this.simulationForm.get('numberDocuments')?.value,
      numberRelevantDocuments: this.simulationForm.get('numberRelevantDocuments')?.value,
      randomActions: this.simulationForm.get('randomActions')?.value,
      length: this.simulationForm.get('length')?.value,
      interval: this.simulationForm.get('interval')?.value,
      speed: this.simulationForm.get('speed')?.value,
      creationDate: (new Date(Date.now())).toString(),
      lastDeployDate: (new Date(0)).toString()
    }

    this._simulationService.createSimulation(SIMULATION).subscribe(data => {
      console.log("SIMULATION ADDED");
    }), (error: any) => {
      console.log(error);
      this.simulationForm.reset();
    }
  }

  onSliderChange(event: any) {
    this.simulationForm.value.speed = event.value;
  }

}
