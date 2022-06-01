import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SimulationDeployService {

  url = "http://localhost:4000/api/simulationdata/deploy/";

  constructor(private http: HttpClient) {
  }

  // DESPUES PONER PARAMETRO DE ID DE SIMULACION
  startSimulation(): Observable<any> {
    return this.http.get(this.url + "start/");
  }

  stopSimulation(): Observable<any> {
    return this.http.get(this.url + "stop/");
  }

  getBookmarks(): Observable<any> {
    return this.http.get(this.url + "getbookmarks/");
  }

  getLatestBookmarks(cursor: number): Observable<any> {
    return this.http.get(this.url + "getlatestbookmarks/" + cursor.toString());
  }

  getKeystrokes(): Observable<any> {
    return this.http.get(this.url + "getkeystrokes/");
  }

  getLatestKeystrokes(cursor: number): Observable<any> {
    return this.http.get(this.url + "getlatestkeystrokes/" + cursor.toString());
  }

  getQueries(): Observable<any> {
    return this.http.get(this.url + "getqueries/");
  }

  getLatestQueries(cursor: number): Observable<any> {
    return this.http.get(this.url + "getlatestqueries/" + cursor.toString());
  }

  getVisitedlinks(): Observable<any> {
    return this.http.get(this.url + "getvisitedlinks/");
  }

  getLatestVisitedlinks(cursor: number): Observable<any> {
    return this.http.get(this.url + "getlatestvisitedlinks/" + cursor.toString());
  }
  
}