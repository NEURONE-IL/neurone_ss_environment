import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortable } from '@angular/material/sort';

import { Simulation } from '../../models/simulation';
import { SimulationService } from '../../services/simulation.service';

import { BehaviorModel } from '../../models/behavior-model';
import { BehaviorModelService } from '../../services/behavior-model.service';

@Component({
  selector: 'app-deploy-simulation',
  templateUrl: './deploy-simulation.component.html',
  styleUrls: ['./deploy-simulation.component.css']
})

export class DeploySimulationComponent implements OnInit {

  private _id: string = '';
  public status: string = 'Stopped';
  public simulationName: string = '';
  public deployEnabled: boolean = true;
  public stopEnabled: boolean = false;
  public restartEnabled: boolean = false;

  private actionsList: Action[] = [];
  public columns = ['username', 'action', 'timestamp'];
  public dataSource: any;
  public filterInput: string = "";
  private firstSort = true;

  // HAY QUE REFRESCAR ACTIONSLIST CADA 10 SEGUNDOS, POR EJEMPLO

  @ViewChild(MatSort, {static: true}) private sort!: MatSort;

  constructor(private _simulationService: SimulationService, private _behaviorModelService: BehaviorModelService, private router: Router) {

      if (this.router.getCurrentNavigation()?.extras.state! !== undefined) {
        this._id = this.router.getCurrentNavigation()?.extras.state!['_id'];
      } else {
        this.router.navigate(['/', 'home']);
      }

  }

  async ngOnInit() {
    this.actionsList.push({username: 'participant1', action: 'keystroke | 8', timestamp: '07-03-2022 14:11:50'});
    this.actionsList.push({username: 'participant1', action: 'visitedlink | access | d12', timestamp: '07-03-2022 14:12:33'});
    this.actionsList.push({username: 'participant21', action: 'query | "machine learning"', timestamp: '07-03-2022 14:21:49'});

    let simulation = await this._simulationService.getSimulation(this._id).toPromise();
    this.simulationName = simulation.name;
    // CONSEGUIR TODAS LAS COSAS DE LA SIMULACION, EJECUTAR FUNCION DE SIMPLIFICACION DE GRAFO Y ARMAR JSON

    this.dataSource = new MatTableDataSource<Action>(this.actionsList);
    if (this.firstSort === true) {
      this.sort.sort(({ id: 'timestamp', start: 'desc'}) as MatSortable);
      this.firstSort = false;
    }
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: Action, filter: string) => data.username.includes(filter);
  }

  public goToSimulationSettings = () => {
    this.router.navigate(['/', 'simulation-settings'], { state:
      { _id: this._id
    }});
  }

  public applyFilter = (event: Event) => {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }

  public removeFilter = () => {

    this.filterInput = "";
    this.dataSource.filter = "";

  }

  public async deploy() {
    this.deployEnabled = false;
    this.status = "Deploying...";
    await new Promise(f => setTimeout(f, 1000));
    this.status = "Deployed"
    this.stopEnabled = true;
    this.restartEnabled = true;

    // ENVIAR JSON A SIMULADOR Y DESPLEGAR SIMULACION; ESPERAR AVISO DE QUE SE DESPLEGO SIMULACION
  }

  public async stop() {
    this.stopEnabled = false;
    this.restartEnabled = false;
    this.status = "Stopping...";
    await new Promise(f => setTimeout(f, 1000));
    this.status = "Stopped"
    this.deployEnabled = true;

    // DETENER SIMULACION; ESPERAR AVISO DE QUE SE DETUVO SIMULACION
  }

  public async restart() {
    this.restartEnabled = false;
    this.stopEnabled = false;
    this.status = "Restarting...";
    await new Promise(f => setTimeout(f, 1000));
    this.status = "Deployed"
    this.restartEnabled = true;
    this.stopEnabled = true;

    // DETENER SIMULACION; ESPERAR AVISO DE QUE SE DETUVO SIMULACION
    // LIMPIAR TABLA DE ACCIONES
    // ENVIAR JSON A SIMULADOR Y DESPLEGAR SIMULACION; ESPERAR AVISO DE QUE SE DESPLEGO SIMULACION
  }

}

interface Action {
  username: string,
  action: string,
  timestamp: string
}