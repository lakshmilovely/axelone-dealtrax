import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  ParamMap,
} from '@angular/router';
// import $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeallogService } from '../core/_services/deallog/deallog.service';
import { HeaderService } from '../core/_services/header/header.service';
import { UserService } from '../core/_services/user/user.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActionService } from '../core/_services/action/action.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionComponent } from '../action/action.component';
// import { BehaviorSubject, first, take } from 'rxjs';
import { DealprogressService } from '../core/_services/deallog/dealprogress.service';
import { BehaviorSubject } from 'rxjs';

declare var alertify: any;

@Component({
  selector: 'app-deallog',
  templateUrl: './deallog.component.html',
  styleUrls: ['./deallog.component.scss'],
})
export class DeallogComponent implements OnInit, OnDestroy {
  @ViewChild('closemd') closemd: any;
  @ViewChild('messageclosemodal') messageclosemodal: any;
  @Input() dataFromParent: any;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closeFollowers') closeFollowers: any;
  @ViewChild('actionClose') actionClose: any;
  @ViewChild('dealogDiv', { static: true })
  dealogDiv!: ElementRef;

  private noOfItemsToShowInitially: number = 35;
  private itemsToLoad: number = 5;
  public itemsToShow: any;
  public isFullListDisplayed: boolean = false;
  CoraId: any;
  UserToken: any;
  SettingsData: any[] = [];
  DealData: any[] = [];
  SortAgeArray: any[] = [];
  p: number = 1;
  topFilteredData: any = '';
  colSpanValue: any;
  splitInternalSteps: any;
  splitInternals: any[] = [];
  allData: any[] = [];
  pagenumber: any;
  extendData: any;
  seperateInternals: any = [];
  subColumnsData: any[] = [];
  removearray: any;
  splitlength: any;
  allusers: any = [];
  names: any = [];
  url: any;
  select: any;
  clearfiltersButtonRef: boolean = false;
  data: any = [];
  DealData2: any = [];
  DealData3: any = [];
  selectValue!: boolean;
  sequenceArray: any = [];
  result: any = [];
  mergeArray: any = [];
  filterString: any;
  oldDate: any;
  xData: any;
  removeTime = 'T00:00:00';
  onlyspanvalues: any[] = [];
  colorArray: any[] = [];
  encodedData: any;

  //Create Action Variables
  selectedStore: any = '';
  storeNames: any[] = [];
  userDetails: any = [];
  imgURL: any;
  moduleNamesArray: any = [];
  ext: any;
  show: any = '';
  task: any;
  view: boolean = false;
  priorityRef!: boolean;
  public date = new Date();
  checkSubData: any = [];
  color: any;
  dataLength: any = '';
  dataPno: any = '';
  particularId: any = [];
  dealdata: any;
  UpdatedTime: any = '';
  TheTime: any;
  dealprogressvalue: any = 'true';
  deal: any = [];
  noRec: boolean = false;
  RecCount: any = '';
  dealstatusChar: any;
  sdn: any = [];
  searchvalue: boolean = false;
  onlyExp: any;
  expData: any;
  dealSort: boolean = false;
  orderState: any = '';
  count: any = 0;

  constructor(
    private act: ActivatedRoute,
    private deallogservice: DeallogService,
    private rtr: Router,
    private spinner: NgxSpinnerService,
    private headservice: HeaderService,
    private user: UserService,
    private fb: FormBuilder,
    private actsrvc: ActionService,
    private modalService: NgbModal,
    private progresservice: DealprogressService
  ) {
    this.selectValue = false;
  }

  ngOnInit() {
    alertify.set('notifier', 'position', 'top-right');
    this.headservice.setHideFilter('Y');
    localStorage.setItem('dealstatusID', 'A');
    this.dealprogressvalue = localStorage.getItem('progresstodeal');
    this.updatedTimeAt();
    this.encodedData = localStorage.getItem('dashToken');
    this.viewuser();
    this.priorityRef = false;
    this.getUserDetails();
    this.imgURL = environment.thumbUrl;
    this.actsrvc.modulesData().subscribe((data) => {
      this.moduleNamesArray = data;
    });
    localStorage.removeItem('value');
  }

  // AFTER APPLY FILTER THIS FUNCTION WILL WORKING...
  ngAfterViewInit() {
    this.headservice.setactiveFilter('Y');
    this.deallogservice.getFilterRef().subscribe((res: any) => {
      this.selectedStore = localStorage.getItem('SS');
      this.onlyExp = res;
      if (this.onlyExp.data == '' || this.onlyExp == '') {
        localStorage.setItem('SS', '');
        this.particularId = 0;
        this.expData = "as_Id in(" + localStorage.getItem('coraId') + ")" + " and dealstatus in('B','D','F') and status!='Y'";
        this.gridFunction();
      } else {
        if (this.selectedStore == '') {
          this.particularId = 0;
        } else {
          this.particularId = this.selectedStore;
        }
        this.expData = this.onlyExp;
        this.gridFunction();
      }
    });

  }

  // UPDATE TIME FUNCTION...
  updatedTimeAt() {
    this.deallogservice.updatedTime().subscribe((data) => {
      const getUpDate = data;
      const theGetDate = getUpDate.slice(0, 10);
      const theGetTime = getUpDate.slice(11, 16);
      const gyear = theGetDate.slice(2, 4);
      const gmonth = theGetDate.slice(5, 7);
      const gdate = theGetDate.slice(8, 10);
      this.TheTime = theGetTime.slice(0, 2);
      let ampm = '';
      if (this.TheTime < 12) {
        ampm = 'AM';
      } else {
        ampm = 'PM';
      }
      this.UpdatedTime =
        gmonth + '.' + gdate + '.' + gyear + ' ' + theGetTime + ' ' + ampm;
    });
  }

  // TOTAL GRID FUNCTION.....
  gridFunction() {
    localStorage.removeItem('storeset');
    this.noRec = false;
    this.DealData = [];
    this.SettingsData = [];
    this.result = [];
    this.CoraId = '';
    this.pagenumber = 1;
    this.spinner.show();
    this.UserToken = localStorage.getItem('UserToken');
    this.dealstatusChar = localStorage.getItem('dealstatusID');

    const obj = {
      expression: this.expData,
      sortby: 'contractdate ASC',
      rowno: this.pagenumber,
    };

    // console.log('MO : ', obj);
    this.deallogservice.getDealByExpression(obj).subscribe((data: any) => {
      // console.log(data);
      this.SortAgeArray = data;
      this.griddata();
    });
    this.updatedTimeAt();
  }

  // INTERNALSTEPS AND TRACKINGSTEPS FUNCTION.....
  griddata() {
    let newarr = this.SortAgeArray;
    this.DealData = newarr;

    let obj = {
      expression: this.expData,
    };

    // console.log(obj);
    this.deallogservice.getRecCount(obj).subscribe((data) => {
      // console.log('second deal data', data);
      this.RecCount = data;
      localStorage.setItem('dealCount', this.RecCount);
    });
    // console.log('last = ', this.particularId);
    this.deallogservice
      .getSettingsById(this.particularId)
      .subscribe((data: any) => {
        this.sequenceArray = data;
        // console.log('last', this.sequenceArray);
        this.sequenceArray = this.sequenceArray.filter(
          (v: any, i: any) =>
            this.sequenceArray.findIndex(
              (item: { sTrackingsteps: any }) =>
                item.sTrackingsteps == v.sTrackingsteps
            ) === i
        );
        // console.log(this.sequenceArray);
        let newarry1 = this.sequenceArray.sort(
          (a: any, b: any) => a.ssSequence - b.ssSequence
        );
        this.SettingsData = newarry1;
        this.allData = [];
        this.onlyspanvalues = [];
        this.splitInternals = [];
        if (this.SettingsData.length != 0) {
          for (let i = 0; i < this.SettingsData.length; i++) {
            const Mysteps = this.SettingsData[i].sInternalsteps;
            this.splitInternalSteps = Mysteps.split(',');
            this.colSpanValue = this.splitInternalSteps.length;
            this.allData.push({
              Data: this.SettingsData[i],
              colSpValue: this.colSpanValue,
            });
            this.onlyspanvalues.push(this.colSpanValue);

            for (let j = 0; j < this.splitInternalSteps.length; j++) {
              this.splitInternals.push(this.splitInternalSteps[j]);
            }
          }
          this.colorArray = [];
          for (let y = 0; y < this.onlyspanvalues.length; y++) {
            const spanValue = this.onlyspanvalues[y];
            for (let z = 0; z < spanValue; z++) {
              if (z == spanValue - 1) {
                this.colorArray.push('1px solid #ccc');
              } else {
                this.colorArray.push('');
              }
            }
          }
          this.seperateInternals = [];
          for (let a = 0; a < this.SettingsData.length; a++) {
            const InSteps = this.SettingsData[a].sInternalsteps.split(',');
            const InLength = InSteps.length;
            for (let b = 0; b < InSteps.length; b++) {
              const Iname = InSteps[b];
              const Tname = this.SettingsData[a].sTrackingsteps + Iname;
              const columnTI = Tname.replace(/[^\w\s]/gi, '');
              const TIcolumn = columnTI.replace(/\s/g, '').toLowerCase();
              this.seperateInternals.push(TIcolumn);
            }
          }
          this.subColumnsData = [];

          for (let x = 0; x < this.DealData.length; x++) {
            for (let y = 0; y < this.seperateInternals.length; y++) {
              const DTname = this.DealData[x];
              let result = DTname.hasOwnProperty(this.seperateInternals[y]);
              if (result == true) {
                Object.keys(DTname).forEach((prop) => {
                  if (this.seperateInternals[y] == prop) {
                    const amountCheck = prop.indexOf('amount') !== -1;

                    if (amountCheck == true) {
                      if (DTname[prop] == 0) {
                        this.subColumnsData.push('--');
                      } else {
                        this.subColumnsData.push(DTname[prop]);
                      }
                    } else {
                      this.subColumnsData.push(DTname[prop]);
                    }
                    if (prop == 'temptagexpiration') {
                      if (DTname[prop] == '0001-01-01T00:00:00') {
                        this.oldDate = '';
                      } else {
                        this.oldDate = DTname[prop];
                      }
                    }
                  }
                });
              } else {
                if (this.seperateInternals[y] == 'temptagdaysremaining') {
                  if (this.oldDate != null && this.oldDate != '') {
                    const expirationdate = new Date(this.oldDate);
                    const currentdata = new Date();
                    let days = -Math.floor(
                      (currentdata.getTime() - expirationdate.getTime()) /
                      1000 /
                      60 /
                      60 /
                      24
                    );
                    if (days == 1 || days == -1) {
                      this.subColumnsData.push(days + ' Day');
                    } else {
                      this.subColumnsData.push(days + ' Days');
                    }
                  } else {
                    this.subColumnsData.push('');
                  }
                } else {
                  this.subColumnsData.push('');
                }
              }
            }
          }

          this.checkSubData = [];
          this.checkSubData = this.subColumnsData;
          this.subColumnsData = [];
          for (let a = 0; a < this.checkSubData.length; a++) {
            if (this.checkSubData[a] == '0001-01-01T00:00:00') {
              this.subColumnsData.push('');
            } else {
              this.subColumnsData.push(this.checkSubData[a]);
            }
          }
          this.result = [];

          for (let m = 0; m < this.subColumnsData.length; m++) {
            this.splitlength = this.seperateInternals.length;
            for (let i = 0; i < this.DealData.length; i++) {
              this.removearray = this.subColumnsData.splice(
                0,
                this.splitlength
              );
              this.result.push({
                details: this.DealData[i],
                cdata: this.removearray,
                sline: this.colorArray,
              });
            }
          }
        } else {
          this.result = [];
          for (let i = 0; i < this.DealData.length; i++) {
            this.result.push({ details: this.DealData[i] });
          }
        }
        // console.log(this.result);

        this.DealData2 = this.result;
        this.dataPno = 1;
        this.dataLength = this.DealData2.length;
        this.DealData3 = this.result;
        if (this.DealData2.length == 0) {
          this.noRec = true;
        } else {
          this.noRec = false;
        }

        this.spinner.hide();
        const value = localStorage.getItem('value');
        // this.orderState = localStorage.getItem('dealOrder');
        if (value != null) {
          this.isDesc = !this.isDesc;
          this.Sortfun(value);
          // var AscendingArray = this.getSort(this.orderState, value);
          // this.DealData2 = this.DealData2.sort(AscendingArray);
        }
      });
    this.dealogDiv.nativeElement.scrollTop = 0;
  }

  // ONSCROLL FUNCTION...
  onScroll() {
    // debugger;
    if (this.DealData3.length != this.RecCount) {
      if (this.clearfiltersButtonRef == false) {
        this.mergeArray = [];
        this.pagenumber++;
        this.spinner.show();

        this.dealstatusChar = localStorage.getItem('dealstatusID');
        const obj = {
          expression: this.expData,
          sortby: 'contractdate ASC',
          rowno: this.pagenumber,
        };
        // console.log(obj);

        this.deallogservice.getDealByExpression(obj).subscribe((data: any) => {
          this.extendData = data;
          // console.log(this.extendData);

          if (this.extendData.length) {
            this.DealData = this.extendData;
            if (this.SettingsData.length != 0) {
              // // // // // // // alert("1111")
              this.seperateInternals = [];
              for (let a = 0; a < this.SettingsData.length; a++) {
                const InSteps = this.SettingsData[a].sInternalsteps.split(',');
                for (let b = 0; b < InSteps.length; b++) {
                  const Iname = InSteps[b];
                  const Tname = this.SettingsData[a].sTrackingsteps + Iname;
                  const columnTI = Tname.replace(/[^\w\s]/gi, '');
                  const TIcolumn = columnTI.replace(/\s/g, '').toLowerCase();
                  this.seperateInternals.push(TIcolumn);
                }
              }
              this.subColumnsData = [];
              for (let x = 0; x < this.DealData.length; x++) {
                for (let y = 0; y < this.seperateInternals.length; y++) {
                  const DTname = this.DealData[x];
                  let result = DTname.hasOwnProperty(this.seperateInternals[y]);
                  if (result == true) {
                    Object.keys(DTname).forEach((prop) => {
                      if (this.seperateInternals[y] == prop) {
                        const amountCheck = prop.indexOf('amount') !== -1;

                        if (amountCheck == true) {
                          if (DTname[prop] == 0) {
                            this.subColumnsData.push('--');
                          } else {
                            this.subColumnsData.push(DTname[prop]);
                          }
                        } else {
                          this.subColumnsData.push(DTname[prop]);
                        }
                        if (prop == 'temptagexpiration') {
                          if (DTname[prop] == '0001-01-01T00:00:00') {
                            this.oldDate = '';
                          } else {
                            this.oldDate = DTname[prop];
                          }
                        }
                      }
                    });
                  } else {
                    if (this.seperateInternals[y] == 'temptagdaysremaining') {
                      if (this.oldDate != null && this.oldDate != '') {
                        const expirationdate = new Date(this.oldDate);
                        const currentdata = new Date();
                        let days = Math.floor(
                          (currentdata.getTime() - expirationdate.getTime()) /
                          1000 /
                          60 /
                          60 /
                          24
                        );
                        if (days >= 0) {
                          const hmd = 30 - days;
                          if (hmd == 1 || hmd == -1) {
                            this.subColumnsData.push(hmd + ' Day');
                          } else {
                            if (hmd == 0) {
                              this.subColumnsData.push('Last Day');
                            } else {
                              this.subColumnsData.push(hmd + ' Days');
                            }
                          }
                        } else {
                          this.subColumnsData.push('Not Yet');
                        }
                      } else {
                        this.subColumnsData.push('');
                      }
                    } else {
                      this.subColumnsData.push('');
                    }
                  }
                }
              }

              this.checkSubData = [];
              this.checkSubData = this.subColumnsData;
              this.subColumnsData = [];
              for (let a = 0; a < this.checkSubData.length; a++) {
                if (this.checkSubData[a] == '0001-01-01T00:00:00') {
                  this.subColumnsData.push('');
                } else {
                  this.subColumnsData.push(this.checkSubData[a]);
                }
              }

              for (let m = 0; m < this.subColumnsData.length; m++) {
                this.splitlength = this.seperateInternals.length;

                for (let i = 0; i < this.DealData.length; i++) {
                  this.removearray = this.subColumnsData.splice(
                    0,
                    this.splitlength
                  );
                  this.mergeArray.push({
                    details: this.DealData[i],
                    cdata: this.removearray,
                    sline: this.colorArray,
                  });
                }
              }
              this.result = [...this.result, ...this.mergeArray];
              // console.log('scroll If: ', this.result);
            } else {
              for (let i = 0; i < this.DealData.length; i++) {
                this.mergeArray.push({ details: this.DealData[i] });
              }
              this.result = [...this.result, ...this.mergeArray];
            }

            this.DealData2 = this.result;
            var sortColName = localStorage.getItem('value');
            if (sortColName != null) {
              this.isDesc = !this.isDesc;
              this.Sortfun(sortColName);
              // // alert('ok');
              // var AscendingArray = this.getSort(this.orderState, sortColName);
              // this.DealData2 = this.DealData2.sort(AscendingArray);
              this.dealogDiv.nativeElement.scrollTop = 0;

            }
            this.dataPno = this.dataPno + 1;
            this.dataLength = this.DealData2.length;
            this.DealData3 = this.result;
            this.spinner.hide();
          }
        });
        if (this.noOfItemsToShowInitially <= this.DealData.length) {
          this.noOfItemsToShowInitially += this.itemsToLoad;
          this.itemsToShow = this.DealData.slice(
            0,
            this.noOfItemsToShowInitially
          );
        } else {
          this.isFullListDisplayed = true;
        }
      }
    }
  }

  // SORTING FUNCTION....
  isDesc: boolean = false;
  Sortfun(property: any) {
    this.isDesc = !this.isDesc; //change the direction
    let direction = this.isDesc ? 1 : -1;
    localStorage.setItem('value', property);
    this.DealData2.sort(function (a: any, b: any) {
      if (a.details[property] < b.details[property]) {
        return -1 * direction;
      }
      else if (a.details[property] > b.details[property]) {
        return 1 * direction;
      }
      else {
        // debugger;
        return 0;
      }
    });
  }

  // Sortfun(value: any) {
  //   this.dealSort = !this.dealSort;
  //   var AscendingArray = this.getSort(this.dealSort, value);
  //   console.log(this.DealData2)
  //   this.DealData2 = this.DealData2.sort(AscendingArray);
  //   localStorage.setItem('dealOrder', JSON.stringify(this.dealSort));
  //   localStorage.setItem('value', value);
  // }

  // // SORT ASCENDING OR DECENDING FUNCTION...
  // getSort(dealSort: boolean, value: any) {
  //   debugger;
  //   var nullPosition = dealSort ? 1 : -1;
  //   return function (a: any, b: any) {
  //     if (a.details[value] == null) return nullPosition;
  //     if (b.details[value] == null) return -nullPosition;
  //     if (a.details[value] < b.details[value]) return -nullPosition;
  //     if (a.details[value] > b.details[value]) return nullPosition;
  //     return 0;
  //   };
  // }

  // SEARCH DEALNUMBER FUNCTION...
  DealForm = this.fb.group({ dealnumber: [''] });
  SearchByDealNo() {
    let DealNo: any = this.DealForm.value.dealnumber;
    let coraid = 0;
    if (DealNo == '' || DealNo == null || DealNo == undefined) {
      alertify.error('Enter Deal Number').dismissOthers();;
    } else {
      this.progresservice.PostDealData(DealNo, coraid).subscribe((res: any) => {
        this.sdn = res;
        if (this.sdn.length == 0) {
          alertify.error('Deal Number Not Found').dismissOthers();;
          this.searchvalue = false;
        } else {
          this.SortAgeArray = this.sdn;
          this.searchvalue = true;
          this.griddata();
        }
      });
    }
  }

  // CLEAR SEARCH FUNCTION (TOTAL DATA REFRESH)...
  clearsearch() {
    this.searchvalue = false;
    this.gridFunction();
  }

  // GET STORE NAMES FUNCTION....
  getUserDetails() {
    const userName = localStorage.getItem('uname');
    this.headservice.getUserInfo(userName).subscribe((data) => {
      this.userDetails = data;
      this.storeNames = this.userDetails[0].usname.split(',');
      console.log(this.storeNames);

    });
  }

  // TOTAL USERS FUNCTION....
  viewuser() {
    this.headservice.getUserInfo('1').subscribe((data) => {
      this.allusers = data;
    });

    for (var i = 0; i < this.allusers.length; i++) {
      this.names.push(this.allusers[i].ufname);
    }
  }

  // NAVIGATE TO DEALPROGRESS WITH IDS (DEALID , CORAID)....
  PushDealId(dealid: any, Coraid: any) {
    localStorage.setItem('ProgressCoraId', Coraid);
    localStorage.setItem('DealId', dealid);
    localStorage.setItem('DealData2', JSON.stringify(this.DealData2));
    this.rtr.navigate(['/dealprogress']);
  }

  // CLEAR ALL FILTERS (REFRESH DATA)...
  clearFilters() {
    this.selectValue = false;
    this.DealData2 = this.DealData3;
    this.clearfiltersButtonRef = false;
    for (let i = 0; i < this.DealData2.length; i++) {
      this.DealData2[i].details.isSelected = false;
    }
    this.dataLength = this.DealData2.length;
  }

  // NAVIGATE MESSAGE PAGE...
  messagePage() {
    this.rtr.navigate(['/chatapp'])
  }

  // NUMBER OR STRING VALUES FOR TRACKING STEP VALUES.....
  typeOf(value: any) {
    if (typeof value == 'string') {
      const checkWord = value.indexOf(this.removeTime) !== -1;
      if (checkWord == true) {
        const dateIs = value.replace(this.removeTime, '');
        const year = dateIs.slice(2, 4);
        const month = dateIs.slice(5, 7);
        const day = dateIs.slice(8, 10);

        this.xData = month + '.' + day + '.' + year;
      } else {
        this.xData = value;
      }
    } else if (typeof value == 'number') {
      if (value < 0) {
        const checkNum = Math.abs(value);
        this.xData = value;
      } else {
        this.xData = value;
      }
    }
    return typeof value;
  }

  //-----------------------Action Functionality---------------------------//
  // NAVIGATE ACTION COMPONENT FOR (ADDACTION FUNCTION).....
  addAction(id: any, taskStatus: any, storeId: any, storename: any) {
    const Deals = this.modalService.open(ActionComponent, {
      // size:'xl',
      backdrop: 'static',
    });
    Deals.componentInstance.Dealsdetails = [
      {
        id: id,
        store: storename,
        storeId: storeId,
        taskStatus: taskStatus,
      },
    ];
    Deals.result.then(
      (data) => {
        if (data == 1 || data == 'U') {
          this.gridFunction();
        }
      },
      (reason) => { }
    );
  }

  // Destroy used with HostListner and will excute before window unload
  @HostListener('window:beforeunload')
  ngOnDestroy() {
  }

}
