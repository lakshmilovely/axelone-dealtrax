import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HeaderService } from '../core/_services/header/header.service';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrls: ['./chatapp.component.scss']
})
export class ChatappComponent implements OnInit {
  userObj: any;
  user: any;
  url: any;
  isLoading: boolean = false;
  shw: boolean = false;

  constructor(public sanitizer: DomSanitizer, private router: Router, private headerService:HeaderService) {
    this.isLoading = true;
    this.user = localStorage.getItem("uname");
    //this.setmessenger();
    setTimeout(() => {
      this.isLoading = false;
      this.shw = true;
    }, 2000);
  }

  ngOnInit(): void {
    this.headerService.setHideFilter('N');
    this.headerService.setactiveFilter('N');

    let token = { "userid": this.user, "productid": 7 }
    var tkn = btoa(JSON.stringify(token));
    this.url = 'https://axelonechat.axelautomotive.com/' + tkn;

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  setmessenger() {
    let token = { "userid": this.user, "productid": 7 }
    var tkn = btoa(JSON.stringify(token));
    this.url = 'https://axelonechat.axelautomotive.com/' + tkn;

    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    // this.sanitizer.bypassSecurityTrustResourceUrl('https://axelonechat.axelautomotive.com/'+tkn);
    return false;
  }

  close() {
    this.router.navigate(['/deallog']);
  }
}
