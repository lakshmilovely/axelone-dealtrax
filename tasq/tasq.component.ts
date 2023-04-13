import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HeaderService } from '../core/_services/header/header.service';

@Component({
  selector: 'app-tasq',
  templateUrl: './tasq.component.html',
  styleUrls: ['./tasq.component.scss'],
})
export class TasqComponent implements OnInit, AfterViewInit {
  tasqtoken: any = '';
  url: any;
  isLoading: boolean = false;
  shw: boolean = false;
  storeId: any;
  usname: any;
  usertitle: any;
  uid: any;
  projectId: any;
  encodedData: any;
  dashToken: any;

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    private headerservice: HeaderService
  ) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.shw = true;
    }, 2000);
  }
  ngAfterViewInit() {
    this.headerservice.getSelectId().subscribe((data: any) => {
      console.log(data.sid);
      this.setTasq(data.sid);
    });
  }

  ngOnInit(): void {
    this.headerservice.setHideFilter('N');
    this.headerservice.setactiveFilter('N');
    this.setTasq(0);
  }
  setTasq(val: number) {
    this.usname = localStorage.getItem('UserName');
    this.projectId = 7;
    this.usertitle = localStorage.getItem('rolename');
    this.uid = localStorage.getItem('UserId');
    if (val == 0)
      this.storeId = localStorage.getItem('selectedStoreId');
    else
      this.storeId = val;

    let eData = {
      uname: this.usname,
      utitle: this.usertitle,
      uid: this.uid,
      pid: this.projectId,
      storeId: this.storeId,
    };
    console.log(eData);
    this.encodedData = btoa(JSON.stringify(eData));
    localStorage.setItem('dashToken', this.encodedData);
    this.dashToken = this.encodedData;

    this.tasqtoken = localStorage.getItem('dashToken');
    console.log(this.tasqtoken);

    this.url = 'https://devtask.axelautomotive.com/auth/' + this.tasqtoken;
    // this.url = 'https://task.swickard.com/auth/' + this.tasqtoken;
    // this.url = 'http://localhost:9200/auth/' + this.tasqtoken;
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  close() {
    this.router.navigate(['/deallog']);
  }
}
