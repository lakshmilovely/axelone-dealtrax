import { HttpHeaders , HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const token = localStorage.getItem("UserToken");
// console.log("Token",token);

const headersData = {
  headers: new HttpHeaders({
    'Content-Type':'application/json',
    'Authorization':`Bearer ${token}`
  }),
};


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http : HttpClient) {}

  SettingsSetup(token: any): Observable<any> {
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set( 'Authorization', `Bearer ${token}`);
     const requestOptions = { headers: headers };
    return this.http.get(`${environment.apiUrl}setting/getSettingSetUp`, requestOptions);
  }

  saveStoreSetup(Obj : any,token : any): Observable<any>{
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set( 'Authorization', `Bearer ${token}`);
     const requestOptions = { headers: headers };
    return this.http.post(`${environment.apiUrl}setting/saveStoreSettingSetup`,JSON.stringify(Obj), requestOptions);
  }

  getStoreSettings(id: any){
    let headers = new HttpHeaders()
    .set('content-type','application/json')
    .set('Authorization', `Bearer ${token}`);
    const requestOptions = {headers : headers};
    return this.http.get(`${environment.apiUrl}setting/getStoreSettingStepUp?id=${id}`,requestOptions);
  }

  getStoreFloring(id:any){
    return this.http.post(`${environment.apiUrl}accounts/FlooringInfo?id=${id}`,JSON.stringify(id),headersData)
  }

  getStoreCitCreate(id:any){
    return this.http.post(`${environment.apiUrl}accounts/CitInfo?id=${id}`,JSON.stringify(id),headersData)
  }

  getStoreWeOwe(id:any){
    return this.http.post(`${environment.apiUrl}accounts/WeOweInfo?id=${id}`,JSON.stringify(id),headersData)
  }

  getStoreTradePaid(id:any){
    return this.http.post(`${environment.apiUrl}accounts/TradePayInfo?id=${id}`,JSON.stringify(id),headersData)
  }

}
