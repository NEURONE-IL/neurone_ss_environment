import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorModel } from '../models/behavior-model';

@Injectable({
  providedIn: 'root'
})

export class BehaviorModelService {
  
  url = "http://localhost:4000/api/behaviormodels/";

  constructor(private http: HttpClient) {
  }

  getBehaviorModels(): Observable<any> {
    return this.http.get(this.url + "/get/");
  }

  getBehaviorModelsProperties(): Observable<any> {
    return this.http.get(this.url + "/getproperties/");
  }

  deleteBehaviorModel(id: string): Observable<any> {
    return this.http.delete(this.url + "delete/" + id);
  }

  createBehaviorModel(behaviorModel: BehaviorModel): Observable<any> {
    return this.http.post(this.url + "create/", behaviorModel);
  }

}