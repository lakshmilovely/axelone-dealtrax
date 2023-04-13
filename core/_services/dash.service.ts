import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DashService {
  private filterData = new BehaviorSubject<any>({obj : ''})
  private buttonData = new BehaviorSubject<any>({obj : ''});
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(
    private http: HttpClient
  ) { }
/*---------------tags-------*/
  GetTagsData(){
    return this.http.get(`${environment.apiUr}TasksTags`)
   }

   PostTagsData(obj:any){
     return this.http.post(`${environment.apiUr}TasksTags`,JSON.stringify(obj),this.headers)
   }

  getAllUsers(id: any) {
    return this.http.post(`${environment.apiUr}User?uname=${id}`, this.headers)
  }
  getAllStores() {
    return this.http.get(`${environment.apiUr}User/AllStores`, this.headers)
  }
  getUsersByStore(store: any) {
    return this.http.post(`${environment.apiUr}User/UsersByStores?storename=${store}`, this.headers)
  }
  statusview() {
    return this.http.get(`${environment.apiUr}TasksStatus`, this.headers)
  }
  priority() {
    return this.http.get(`${environment.apiUr}TasksPriorities`, this.headers)
  }
  upload(obj: any) {
    // var formdata: any = new FormData();
    // formdata.append('file to upload', obj)
    return this.http.post(`${environment.apiUr}Upload`, obj)
  }
  createAction(obj:any)
  {
    return this.http.post(`${environment.apiUr}Tasks`,obj, this.headers)

  }
  GetTasksbyId(Id:any)
  {
    return this.http.get(`${environment.apiUr}Tasks/${Id}`);
  }
  gettasksbyid(id:any){

    return this.http.get(`${environment.apiUr}Tasks/${id}`, this.headers)

  }

  tasksbyid(obj:any,id:any){
    console.log("",id);
    return this.http.put(`${environment.apiUr}Tasks/${id}`,obj, this.headers)
  }

  updateAction(obj:any,id:any)
  {
    return this.http.put(`${environment.apiUr}Tasks/${id}`,obj, this.headers)
  }
  GetTasks(obj:any){
    return this.http.post(`${environment.apiUr}Tasks/getbyIDs`,obj,this.headers)
  }
  GetTasksByFilters(obj: any){
    // console.log(obj);
    return this.http.post(`${environment.apiUr}Tasks/getTasksbyFilters`,JSON.stringify(obj),this.headers);
  }
  setFilterData(data:any){
    this.filterData.next(data);
  }
  getFilterData(){
    return this.filterData.asObservable();
  }
  setbuttonData(data:any){
    this.buttonData.next(data);
  }
  getbuttonData(){
    return this.buttonData.asObservable();
  }
}
