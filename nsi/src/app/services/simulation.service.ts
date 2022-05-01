import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SimulationService {
  url = "http://localhost:4000/api/simulations/";

  constructor(private http: HttpClient) { }

  getSimulations(): Observable<any> {
    return this.http.get(this.url + "/get/");
  }
}