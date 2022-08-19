import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Settings } from '../settings';

@Injectable({
  providedIn: 'root'
})

// Offers methods to contact the backend and perform tasks relating to simulation deploys
export class SimulationDeployService {

  url = Settings.backendURL + "/api/simulationdeploy/";

  constructor(private http: HttpClient) {
  }

  // Starts a simulation (deploys it)
  startSimulation(_id: string): Observable<any> {
    return this.http.get(this.url + "start/" + _id);
  }

  // Stops a simulation
  stopSimulation(simDeployId: string): Observable<any> {
    return this.http.get(this.url + "stop/" + simDeployId);
  }
  
}