import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const token=localStorage.getItem('UserToken')
const headData={
 headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class DealprogressService {

  constructor(private http:HttpClient) {}

PostDealData(Did:any,Cid:any){
  console.log("TwoIds",Did,Cid);
 return this.http.post(`${environment.apiUrl}dealLog/dealdetails?dealno=${Did}&coraId=${Cid}`,JSON.stringify(Did,Cid),headData)
}
addnote(obj:any){
  return this.http.post(`${environment.apiUrl}nOTES/saveNotes`,JSON.stringify(obj),headData)
}
getnote(obj:any){
  console.log(obj);

  return this.http.post(`${environment.apiUrl}nOTES?input=${obj}`,headData)
}
AllStatus(obj:any)
{
  return this.http.post(`${environment.apiUrl}dealLog/UpdatedealStatus`,JSON.stringify(obj),headData)
}

}
