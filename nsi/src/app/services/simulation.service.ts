import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Simulation } from '../models/simulation';

@Injectable({
  providedIn: 'root'
})

export class SimulationService {

  url = "http://localhost:4000/api/simulations/";

  constructor(private http: HttpClient) {
  }

  getSimulations(): Observable<any> {
    return this.http.get(this.url + "get/");
  }

  deleteSimulation(id: string): Observable<any> {
    return this.http.delete(this.url + "delete/" + id);
  }

  createSimulation(simulation: Simulation): Observable<any> {
    return this.http.post(this.url + "create/", simulation);
  }
  
}