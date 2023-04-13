import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public loginUserdetails = new BehaviorSubject<any>({Obj:''});

  constructor(private http : HttpClient) { }

  loginUser(obj: any){
    // console.log("Object",obj)
    return this.http.post(`${environment.apiUrl}Users/login`,obj);
  }

  setUserdata(result: any){
    console.log("result ",result)
    this.loginUserdetails.next(result);
  }

  getUserdata(): Observable<any>{
    console.log(this.loginUserdetails);
    return this.loginUserdetails.asObservable();
  }
}
