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

  getBehaviorModel(_id: string): Observable<any> {
    return this.http.get(this.url + "get/" + _id);
  }

  getBehaviorModels(): Observable<any> {
    return this.http.get(this.url + "get/");
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

  updateBehaviorModel(_id: string, behaviorModel: BehaviorModel): Observable<any> {
    return this.http.put(this.url + "update/" + _id, behaviorModel);
  }

}