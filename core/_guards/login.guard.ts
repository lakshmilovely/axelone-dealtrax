import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, ParamMap, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DeallogService } from '../_services/deallog/deallog.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  userToken: any="";
  userInfo: any=""

  constructor(private rtr : Router,  private act: ActivatedRoute,private deallogservice: DeallogService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  
      if(localStorage.getItem("UserToken") == null){
      this.rtr.navigate(['/'])
      return false;
    }else{
      return true;
    }
  }

}
