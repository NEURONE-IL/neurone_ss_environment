import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BehaviorModelService {
  url = "http://localhost:4000/api/behaviorModels/";

  constructor(private http: HttpClient) { }

  getBehaviorModels(): Observable<any> {
    return this.http.get(this.url + "/get/");
  }
}