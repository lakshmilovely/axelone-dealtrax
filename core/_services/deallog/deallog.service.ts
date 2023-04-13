import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const token = localStorage.getItem('UserToken')
const headData = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
@Injectable({
  providedIn: 'root'
})
export class DeallogService {

  private StoreHide = new BehaviorSubject<any>({ status: '' });
  private filtersdata = new BehaviorSubject<any>({data :''})



  constructor(private http: HttpClient) { }

  getSessionInfo(sToken: any) {
    console.log(sToken);
    const obj = { "token": sToken };
    return this.http.post(`https://devaxeloneapi.axelautomotive.com/api/axelone/verifyToken`, obj);
  }

  getSettingsById(id: any): Observable<any> {
    return this.http.get(`${environment.apiUrl}setting/getStoreSettingInternalSteps?id=${id}`, headData);
  }

  getDealDetailsByCid(C_id: any, token: any): Observable<any> {
    let headers = new HttpHeaders()
      .set('content-type', 'text/plain')
    //.set('Authorization',, `Bearer ${token}`);
    const headData = { headers: headers };
    return this.http.get(`${environment.apiUrl}dealLog/dealLog?coraId=${C_id}`, headData);
  }

  getDealsByyIdwPag(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/deallogstatus`, JSON.stringify(obj), headData);
  }

  getDealByExpression(obj :any){
  return this.http.post(`${environment.apiUrl}dealLog/getDealByFilters`,JSON.stringify(obj),headData)
  }

  MessageSend(obj: any){
    return this.http.post(`http://localhost:3001/msgSent`, obj, {responseType: 'text'});
  }

  send(obj: any) {
    return this.http.post(`${environment.apiUrl}messages`, obj, headData)
  }

  messagebyuserid(id: any) {
    return this.http.get(`${environment.apiUrl}messages/UserId?Id=` + id, headData)
  }

  messagebyid(id: any) {
    return this.http.get(`${environment.apiUrl}messages/Id?Id=` + id, headData)
  }

  msgsent(id: any) {
    return this.http.get(`${environment.apiUrl}messages/UserIdSent?Id=` + id, headData)
  }

  upload(obj: any) {
    var formdata: any = new FormData();
    formdata.append('file to upload', obj)
    return this.http.post(`${environment.apiUrl}Upload`, formdata);
  }

  hardRefresh(obj: any) {
    // alert('service');
    return this.http.post(`${environment.apiUrl}dealLog/hardrefresh`, JSON.stringify(obj), headData);
  }

  getRecCount(obj:any) {
    return this.http.post(`${environment.apiUrl}dealLog/getdealCount`, obj);
  }


  updatepdi(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/UpdatePDI`, JSON.stringify(obj), headData);
  }

  updatetemptag(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/UpdateTemptag`, JSON.stringify(obj), headData);
  }

  updatecit(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatecit`, JSON.stringify(obj), headData);
  }

  updatevehiclear(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatevehiclear`, JSON.stringify(obj), headData);
  }

  updatetotalcit(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatetotalcit`, JSON.stringify(obj), headData);
  }

  updatecontract(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatecontract`, JSON.stringify(obj), headData);
  }

  updatepaidOff(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatetradepaidoff`, JSON.stringify(obj), headData);
  }

  updatetradetitle(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatetitlerec`, JSON.stringify(obj), headData);
  }

  updateeweowes(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updateweowes`, JSON.stringify(obj), headData);
  }

  updatedealbooked(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatedealbooked`, JSON.stringify(obj), headData);
  }

  updatefpayOff(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatedeafpoff`, JSON.stringify(obj), headData);
  }

  updatefunded(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatefunded`, JSON.stringify(obj), headData);
  }

  updatefinalized(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatefinalized`, JSON.stringify(obj), headData);
  }

  updatedmv(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatedmv`, JSON.stringify(obj), headData);
  }

  updateplates(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updateplates`, JSON.stringify(obj), headData);
  }

  updatedigitalscan(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatedigitalscan`, JSON.stringify(obj), headData);
  }

  updatemailed(obj: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/Updatemail`, JSON.stringify(obj), headData);
  }

  setFilterRef(data:any){
    this.filtersdata.next(data)
  }
  getFilterRef() {
    return this.filtersdata.asObservable();
  }

  setStore(id: any) {
    this.StoreHide.next(id);
  }
  getStore() {
    return this.StoreHide.asObservable();
  }

  updatedTime(): Observable<any> {
    return this.http.post(`${environment.apiUrl}dealLog/getUpdateTime`, headData);
  }

}
