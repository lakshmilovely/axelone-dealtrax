import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ActionService {
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private http: HttpClient) { }

  getUsersByStore(store: any) {
    return this.http.post(`${environment.apitask}User/UsersByStores?storename=${store}`, this.headers)
  }

  modulesData() {
    return this.http.get(`${environment.apitask}User/projinfo`)
  }

  upload(obj: any) {
    return this.http.post(`${environment.apitask}Upload`, obj)
  }

  statusview() {
    return this.http.get(`${environment.apitask}TasksStatus`, this.headers)
  }

  priority() {
    return this.http.get(`${environment.apitask}TasksPriorities`, this.headers)
  }

  GetTagsData() {
    return this.http.get(`${environment.apitask}TasksTags`)
  }

  PostTagsData(obj: any) {
    return this.http.post(`${environment.apitask}TasksTags`, JSON.stringify(obj), this.headers)
  }

  createAction(obj:any)
  {
    return this.http.post(`${environment.apitask}Tasks`,obj, this.headers)
  }
  updateTaskStatus(obj:any)
  {
    return this.http.post(`${environment.apiUrl}dealLog/UpdateTaskStatus`,obj, this.headers)
  }
  getTaskById(id:any)
  {
    return this.http.get(`${environment.apitask}Tasks/${id}`,this.headers)
  }
  updateAction(obj:any,id:any)
  {
    return this.http.put(`${environment.apitask}Tasks/${id}`,obj, this.headers)
  }
}
