import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const token=localStorage.getItem('UserToken')
const headData={
 headers:new HttpHeaders({
   'Content-Type': 'application/json',
   'Authorization': `Bearer ${token}`
 })
}


@Injectable({
  providedIn: 'root'
})
export class SettingsService {


  constructor(private http: HttpClient,
  ) { }


  getSettings( token: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set( 'Authorization', `Bearer ${token}`);
     const requestOptions = { headers: headers };
    return this.http.get(`${environment.apiUrl}setting/getSettingSetUp`, requestOptions);
  }

  // addSetting(obj:any,token:any)
  // {
  //   let headers = new HttpHeaders()
  //   .set('content-type','application/json')
  //   .set( 'Authorization', `Bearer ${token}`);
  //    const requestOptions = { headers: headers };
  //   return this.http.post(`${environment.apiUrl}setting/saveSettingSetup`,JSON.stringify(obj), requestOptions);
  // }

  addSetting(obj:any){
    return this.http.post(`${environment.apiUrl}setting/saveSettingSetup`,JSON.stringify(obj),headData)
  }

  getSettingsById(id : any, token : any):Observable<any>{
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set('Authorization',`Bearer ${token}`);
    const requestOptions = { headers: headers};
    return this.http.post(`${environment.apiUrl}setting/getSettingSteps?id=${id}`,{},requestOptions);
  }
  getAllRolls(token:any)
  {
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set( 'Authorization', `Bearer ${token}`);
     const requestOptions = { headers: headers };
     return this.http.get(`${environment.apiUrl}Roles/allRoles`, requestOptions);
  }
}
