import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
//import { Subject } from 'rxjs';
import { DeallogService } from '../core/_services/deallog/deallog.service';
import { HeaderService } from '../core/_services/header/header.service';
import { LoginService } from '../core/_services/login.service';
import { RolesService } from '../core/_services/roles/roles.service';
import { MessageSignalRService } from '../core/_services/SignalR/message-signal-r.service';
import { UserService } from '../core/_services/user/user.service';
// import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterComponent } from './filter/filter.component';
import { BehaviorSubject } from 'rxjs';
declare var alertify: any;
alertify.set('notifier', 'position', 'top-right');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('closebutton') closebutton: any;
  @Output() selectedId = new EventEmitter();


  Username: any;
  Usertitle: any;
  UserCoraId: any;
  UserToken: any;
  CoraID: any;
  headerdata: any;
  headeronedata: any[] = [];
  headerstorenames: any;
  storeData: any[] = [];
  Ucora_id: any;
  //storageSelectData = new Subject<any>();
  userList: any = '';
  userId: any;
  sent: any;
  to = '';
  cc = '';
  bcc = '';
  text = '';
  subject = '';
  from = '';
  attach = '';
  messagebyid: any;
  data: any[] = [];
  s: any;
  count: number = 0;
  visible: boolean = false;
  simplearray: any[] = [];
  lastpart: string | undefined;
  userToken: any = '';
  userInfo: any = '';
  userI: any = [];
  sessioninfo: any = '';
  sessionstatus: any = '';
  uname: any = '';
  userDetails: any = '';
  role: any = '';
  headertwodata: any[] = [];
  headerthreedata: any[] = [];
  headertwodata1: any = '';
  sess: any;
  dashToken: any;
  encodedData: any;
  checkToken: any = '';
  usname: any;
  usertitle: any;
  uid: any;
  projectId: any;
  headerstoresnames: any;
  headerstoresnames1: any;
  selectedStoreName: any = [];
  storeId: any;
  sample: any;
  storeids: any = [];
  finalStore: any = [];
  selectedstorData: any = [];
  storesData: any = '';
  allStore: any = [];
  selectedsid: any;
  dropdownSettings: IDropdownSettings = {};
  DropStoreData: any = [];
  hideFilters: any;
  totaldata: any;
  filterclose: any;
  storeset: boolean = false;
  activeref: boolean = false;
  activefilters: any;
  storenames: any;
  dateFilters: any;
  dealstatus: any;
  status: any;
  totalCount: any
  allFilters: any;
  firstname: any = '';
  dealType: any = '';
  tradeType: any = '';
  salesPerson1: any = '';
  fandImanager: any = '';
  salesPerson2: any = '';
  salesManager: any = '';
  resetref: boolean = false;
  activeref1: boolean = false;

  constructor(
    private service: LoginService,
    private router: Router,
    private headerservice: HeaderService,
    private headservice: HeaderService,
    private messageSignalR: MessageSignalRService,
    private user: UserService,
    private deallog: DeallogService,
    private act: ActivatedRoute,
    private roleService: RolesService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,

  ) { }
  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
    this.Username = localStorage.getItem('UserName');
    this.Usertitle = localStorage.getItem('rolename');
    this.deallog.getStore()
      .subscribe((res: any) => {
        // console.log(res);
        if (res.val == 1) {
          this.sample = res;
        }
      });
    this.activefilters = 'Y';
    this.headerservice.getactiveFilter()
      .subscribe((res: any) => {
        console.log(res.activefilter);
        this.activefilters = res
      });
  }

  ngOnInit() {
    this.Username = localStorage.getItem('UserName');
    this.Usertitle = localStorage.getItem('rolename');

    this.filterclose = 'Y';
    this.headerservice.getHideFilter()
      .subscribe((res: any) => {
        console.log(res);
        this.filterclose = res
      })
    this.deallog.getFilterRef()
      .subscribe((res: any) => {
        console.log(res);
        this.totaldata = res.data;
        console.log(this.totaldata);
        if (res.data == '') {
          this.activeref = false;
          this.storenames = "All";
          this.dateFilters = "";
          this.dealstatus = "All"
          this.status = "Incomplete"
          this.firstname = '';
          this.dealType = "";
          this.tradeType = "";
          this.salesPerson1 = "";
          this.salesPerson2 = "";
          this.fandImanager = "";
          this.salesManager = "";
          this.totalCount = 3;
        }
        else {
          this.activeref = true;
          const filters = localStorage.getItem('final');
          const splitInternalsArray = new BehaviorSubject(filters ? JSON.parse(filters) : null);
          this.allFilters = splitInternalsArray.value;
          console.log(this.allFilters);
          this.storenames = this.allFilters.storenames.toString();
          this.dateFilters = this.allFilters.date;
          this.dealstatus = this.allFilters.dealstatus.toString();
          this.status = this.allFilters.complete.toString();
          this.firstname = this.allFilters.firstname;
          this.dealType = this.allFilters.dealtype.toString();
          this.tradeType = this.allFilters.trade.toString();
          this.salesPerson1 = this.allFilters.salesperson1;
          this.salesPerson2 = this.allFilters.salesperson2;
          this.fandImanager = this.allFilters.fandiManager;
          this.salesManager = this.allFilters.salesmanager;
          let abc = Object.keys(this.allFilters).filter(x => this.allFilters[x] !== "").length;
          this.totalCount = abc;
        }
      });

    const urlParams = new URLSearchParams(window.location.search);
    const myParam: any = urlParams.get('token'); //set toekn for myparam
    const myparam1 = sessionStorage.getItem('MyParam');

    //changing of token
    if (myparam1 == null) {
      sessionStorage.setItem("MyParam", myParam);
    } else {
      if (myparam1 != myParam && myParam != null) {
        sessionStorage.clear();
        localStorage.clear();
        //  window.location.href = 'https://axelone.swickard.com/';
        window.location.href = 'https://dev.axelautomotive.com/';
      }
    }

    // without token
    if (myParam == null) {
      this.sess = sessionStorage.getItem('session');
      if (this.sess == null) {
        sessionStorage.clear();
        localStorage.clear();
        //   window.location.href = 'https://axelone.swickard.com/';
        window.location.href = 'https://dev.axelautomotive.com/';
      } else {
        this.deallog.getSessionInfo(this.sess).subscribe((data1) => {
          this.sessionstatus = data1;
          if (this.sessionstatus.status == 403) {
            sessionStorage.clear();
            localStorage.clear();
            //   window.location.href = 'https://axelone.swickard.com/';
            window.location.href = 'https://dev.axelautomotive.com/';
          } else {
            // // alert('without token')
            this.ViaOutToken();
          }
        });
      }
    }
    this.userToken = myParam;
    const obj = atob(this.userToken);
    this.userInfo = JSON.parse(obj);
    sessionStorage.setItem('session', this.userInfo.session);
    localStorage.setItem('uname', this.userInfo.userid);
    localStorage.setItem('roleid', this.userInfo.role);

    this.sessioninfo = this.userInfo.session;

    if (this.sessioninfo == '') {
      localStorage.clear();
      sessionStorage.clear();
      // window.location.href = 'https://axelone.swickard.com/';
      window.location.href = 'https://dev.axelautomotive.com/';
    } else {
      this.deallog.getSessionInfo(this.userInfo.session).subscribe((data1) => {
        this.sessionstatus = data1;
        if (this.sessionstatus.status == 403) {
          localStorage.clear();
          sessionStorage.clear();
          //  window.location.href = 'https://axelone.swickard.com/';
          window.location.href = 'https://dev.axelautomotive.com/';
        } else {
          // // alert('with token')
          this.ViaOutToken();
        }
      });
    }
    this.hideFilters = 'Y';
  }

  ViaOutToken() {
    this.uname = localStorage.getItem('uname');
    const roleId = localStorage.getItem('roleid');
    //Set Role Name
    this.roleService.getrolebyid(roleId).subscribe((data) => {
      this.role = data;
      this.Usertitle = this.role.rName
      localStorage.setItem('rolename', this.Usertitle);
    });
    this.headerservice.getUserInfo(this.uname).subscribe((data) => {
      this.userDetails = data;
      localStorage.setItem('UserId', this.userDetails[0].uid);
      this.messageSignalR.startConnection();
      this.messageSignalR.hubConnection2.on('ReceiveMessage', (MId) => { });
      this.Username = this.userDetails[0].ufname + ' ' + this.userDetails[0].ulname;
      localStorage.setItem('UserName', this.Username);
      this.UserCoraId = this.userDetails[0].usid;
      localStorage.setItem('coraId', this.UserCoraId);
      this.headeronedata = this.userDetails[0].usname.split(',');
      this.storeids = this.userDetails[0].usid.split(',');

      for (let i = 0; i < this.headeronedata.length; i++) {
        let obj = { id: this.storeids[i], name: this.headeronedata[i] }
        this.finalStore.push(obj)
      }
      this.finalStore.sort((a: any, b: any) => (a.name < b.name) ? -1 : 1);
      this.DropStoreData = this.finalStore;
    });
  }

  logout() {
    this.router.navigate(['']);
    localStorage.clear();
    sessionStorage.clear();
  }

  navbar() {
    let fade = document.getElementsByClassName('offcanvas-backdrop fade show');
    for (let i = 0; i < fade.length; i++) {
      if (fade.length > 1) {
        fade[0].remove();
      }
    }
  }

  activeModal() {
    let fade = document.getElementsByClassName('modal-backdrop fade show');
    for (let i = 0; i < fade.length; i++) {
      if (fade.length > 1) {
        fade[0].remove();
      }
    }
  }


  deallogpage() {
    this.router.navigate(['/deallog']);
  }

  resetfilters() {
    this.resetref = !this.resetref;
    if (this.resetref == true) {
      this.storenames = "All";
      this.dateFilters = "";
      this.dealstatus = "All"
      this.status = "Incomplete"
      this.firstname = '';
      this.dealType = "";
      this.tradeType = "";
      this.salesPerson1 = "";
      this.salesPerson2 = "";
      this.fandImanager = "";
      this.salesManager = "";
      this.activeref1 = true;
    }
    else {
      this.storenames = this.allFilters.storenames.toString();
      this.dateFilters = this.allFilters.date;
      this.dealstatus = this.allFilters.dealstatus.toString();
      this.status = this.allFilters.complete.toString();
      this.firstname = this.allFilters.firstname;
      this.dealType = this.allFilters.dealtype.toString();
      this.tradeType = this.allFilters.trade.toString();
      this.salesPerson1 = this.allFilters.salesperson1;
      this.salesPerson2 = this.allFilters.salesperson2;
      this.fandImanager = this.allFilters.fandiManager;
      this.salesManager = this.allFilters.salesmanager;
      this.activeref1 = false;
    }
  }

  opensettings() {
    this.router.navigate(['/settings']);
    this.filterclose = 'N'
    this.headerservice.setHideFilter(this.filterclose);
    this.activefilters = 'N';
    this.headerservice.setactiveFilter(this.activefilters);
  }

  openstore() {
    this.router.navigate(['/storesetup']);
    this.storeset = true;
    localStorage.setItem('storeset', JSON.stringify(this.storeset));
    this.activefilters = 'N';
    this.headerservice.setactiveFilter(this.activefilters);
  }

  msgclick() {
    this.router.navigate(['/chatapp']);
  }

  tasqclick() {
    this.router.navigate(['/tasq']);
  }

  openFilter() {
    if (this.totaldata == '') {
      localStorage.setItem('A', this.totaldata)
    }
    else {
      localStorage.setItem('A', this.totaldata)
    }
    const Deals = this.modalService.open(FilterComponent, {
      size: 'xl',
    });
    Deals.componentInstance.stores = [
      {
        stores: this.finalStore,
      },
    ];
  }

  hideTheFilters() {
    this.hideFilters = 'N';
    this.headerservice.setHideFilter(this.hideFilters);
  }

  saveChanges() {
    alertify.confirm('Confirmation...!', 'Do you want to store default filters.', () => {
      this.deallog.setFilterRef({ data: '' });
      this.activeref1 = false;
      this.closebutton.nativeElement.click();

    }, function () { })
      .set({ transition: 'zoom', 'movable': false, 'closable': false, 'labels': { ok: 'Yes', cancel: 'No' } });
  }

}
