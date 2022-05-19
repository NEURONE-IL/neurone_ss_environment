import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as dayjs from 'dayjs';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

@Component({
  selector: 'app-simulation-settings',
  templateUrl: './simulation-settings.component.html',
  styleUrls: ['./simulation-settings.component.css']
})

export class SimulationSettingsComponent implements OnInit {

  public _id: string = '';
  public simulationForm: FormGroup | null = null;

  constructor(private router: Router,
              private _simulationService: SimulationService,
              private fb: FormBuilder) {

    if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
      this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
    } else {
      this.router.navigate(['/', 'home']);
    }

  }

  async ngOnInit() {
    let simulation = await this._simulationService.getSimulation(this._id).toPromise();


    let creationDate = dayjs(simulation.creationDate).format('YYYY/MM/DD HH:mm:ss');
    let lastDeployDateTime = new Date(simulation.lastDeployDate).getTime();
    let lastDeployDate: string = '';

    if (lastDeployDateTime != 0) {
      lastDeployDate = dayjs(simulation.lastDeployDate).format('YYYY/MM/DD HH:mm:ss');
    } else {
      lastDeployDate = "Never";
    }

    this.simulationForm = this.fb.group({
      name: [simulation.name, []],
      description: [simulation.description, []],
      creationDate: [creationDate, []],
      lastDeployDate: [lastDeployDate, []]
    });
  }

  public configureSimulation = () => {

  }

  public deleteSimulation = () => {
    
  }

}
