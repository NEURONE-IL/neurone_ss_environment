import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Simulation } from '../models/simulation';
import { Settings } from '../settings';

@Injectable({
  providedIn: 'root'
})

// Offers methods to contact the backend and perform tasks relating to simulations (not simulation deploys, however)
export class SimulationService {

  url = Settings.backendURL + "/api/simulations/";

  constructor(private http: HttpClient) {
  }

  // Makes a copy of an existing simulation
  copySimulation(_id: string, copyText: string): Observable<any> {
    return this.http.post(this.url + "copy/", {id: _id, copyText: copyText});
  }

  // Gets a single simulation
  getSimulation(_id: string): Observable<any> {
    return this.http.get(this.url + "get/" + _id);
  }

  // Gets all simulations
  getSimulations(): Observable<any> {
    return this.http.get(this.url + "get/");
  }

  // Gets the names of all simulations
  getSimulationNames(): Observable<any> {
    return this.http.get(this.url + "getnames/");
  }

  // Deletes a single simulation
  deleteSimulation(_id: string): Observable<any> {
    return this.http.delete(this.url + "delete/" + _id);
  }

  // Creates a new simulation
  createSimulation(simulation: Simulation): Observable<any> {
    return this.http.post(this.url + "create/", simulation);
  }

  // Updates a simulation
  updateSimulation(_id: string, simulation: Simulation): Observable<any> {
    return this.http.put(this.url + "update/" + _id, simulation);
  }

  // Updates the last deploy date of a simulation
  updateSimulationLastDeployDate(_id: string): Observable<any> {
    return this.http.put(this.url + "updatelastdeploydate/" + _id, {id: _id});
  }

  // Gets a list of all simulation names and their respective behavior model IDs
  getSimulationBehaviorModels(): Observable<any> {
    return this.http.get(this.url + "getmodels/");
  }
  
}