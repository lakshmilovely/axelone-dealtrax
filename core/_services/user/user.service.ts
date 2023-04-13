import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
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
export class UserService {

  constructor(private http : HttpClient) { }

  getAllUser(){
    return this.http.get(`${environment.apiUrl}Users`,headersData)
  }

  addUser(obj:any){
    console.log("Service AddUser Obj",obj,headersData);

   return this.http.post(`${environment.apiUrl}Users/register`,obj,headersData)
  }

  stores(){
    return this.http.get(`${environment.apiUrl}store`,headersData)
  }

  storeid(id:any){
    return this.http.post(`${environment.apiUrl}store/storeDetails?Id=1`,JSON.stringify(id),headersData)
  }

 ViewAllRoles(){
  return this.http.get(`${environment.apiUrl}Roles/allRoles`,headersData)
 }
 postingUser(obj:any)
 {
   return this.http.post(`${environment.apiUrl}Users/register`,JSON.stringify(obj),headersData)
 }
 userbyid(obj:any)
 {
   return this.http.get(`${environment.apiUrl}Users/userbyId?id=${obj}`,headersData)
 }
}
