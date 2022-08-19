import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorModel } from '../models/behaviorModel';
import { Settings } from '../settings';

@Injectable({
  providedIn: 'root'
})

// Offers methods to contact the backend and perform tasks relating to behavior models
export class BehaviorModelService {
  
  url = Settings.backendURL + "/api/behaviormodels/";

  constructor(private http: HttpClient) {
  }

  // Makes a copy of an existing behavior model
  copyBehaviorModel(_id: string, copyText: string): Observable<any> {
    return this.http.post(this.url + "copy/", {id: _id, copyText: copyText});
  }

  // Gets a single behavior model
  getBehaviorModel(_id: string): Observable<any> {
    return this.http.get(this.url + "get/" + _id);
  }

  // Gets all behavior models
  getBehaviorModels(): Observable<any> {
    return this.http.get(this.url + "get/");
  }

  // Gets the properties of all behavior models (all the metadata without the models themselves)
  getBehaviorModelsProperties(): Observable<any> {
    return this.http.get(this.url + "getproperties/");
  }

  // Deletes a single behavior model
  deleteBehaviorModel(id: string): Observable<any> {
    return this.http.delete(this.url + "delete/" + id);
  }

  // Creates a new behavior model
  createBehaviorModel(behaviorModel: BehaviorModel): Observable<any> {
    return this.http.post(this.url + "create/", behaviorModel);
  }

  // Updates a behavior model
  updateBehaviorModel(_id: string, behaviorModel: BehaviorModel): Observable<any> {
    return this.http.put(this.url + "update/" + _id, behaviorModel);
  }

}