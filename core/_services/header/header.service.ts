import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

const token = localStorage.getItem('UserToken');
const heardsdata = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class HeaderService {

  private selectId = new BehaviorSubject<any>({ sid: '' });
  private selectName = new BehaviorSubject<any>({ sname: '' });
  private hidefilters = new BehaviorSubject<any>({ hide: '' });
  private activefilters = new BehaviorSubject<any>({ activefilter: '' })

  constructor(private http: HttpClient) { }
  DisplaycoraIddata() {
    return this.http.get(`${environment.apiUrl}store`, heardsdata);
  }
  getStores(token: any) {
    let headers = new HttpHeaders()
      .set('content-type', 'application/json');
    const requestOptions = { headers: headers };
    return this.http.get(`${environment.apiUrl}store`, requestOptions);
  }
  getUserInfo(uname: any) {
    console.log(uname);

    return this.http.post(`${environment.apiUrl}Users/getUserInfo?uname=` + uname, heardsdata);
  }


  setSelectId(id: any) {
    this.selectId.next(id);
  }
  getSelectId() {
    return this.selectId.asObservable();
  }


  setSelectName(name: any) {
    this.selectName.next(name);
  }
  getSelectName() {
    return this.selectName.asObservable();
  }


  setHideFilter(value: any) {
    this.hidefilters.next(value);
  }
  getHideFilter() {
    return this.hidefilters.asObservable();
  }

  setactiveFilter(value: any) {
    this.activefilters.next(value);
  }

  getactiveFilter() {
    return this.activefilters.asObservable();
  }
}
