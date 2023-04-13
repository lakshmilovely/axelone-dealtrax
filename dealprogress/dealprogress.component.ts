import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeallogService } from '../core/_services/deallog/deallog.service';
import { DealprogressService } from '../core/_services/deallog/dealprogress.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IfStmt, ThrowStmt } from '@angular/compiler';
import { HeaderService } from '../core/_services/header/header.service';
import { StoreService } from '../core/_services/store/store.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormArray, FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

declare var alertify: any;
@Component({
  selector: 'app-dealprogress',
  templateUrl: './dealprogress.component.html',
  styleUrls: ['./dealprogress.component.scss'],
})
export class DealprogressComponent implements OnInit {
  @ViewChild('closemd') closemd: any;
  @ViewChild('actionClose') actionClose: any;
  dealId: any;
  getCoraId: any;
  Ids: any;
  Trade: any;
  TradeVisible = true;
  CoraAcctId: any;
  TrackSteps: any;
  split: any;
  InternalSteps: any;
  trackingSteps: any;
  seperateInternals: any = [];
  subColumnsData: any[] = [];
  result: any = [];
  allData: any[] = [];
  finalArray: any = [];
  LastArray: any = [];
  Remaining: any;
  removeTime: string = 'T00:00:00';
  item: any;
  startDate: any;
  conditionArray: any[] = [];
  FinalDates: any[] = [];
  smartData: any;
  MainStatus: any;
  popArray: any = [];
  blueDot = '../../assets/images/Marker.png';
  redDot = '../../assets/images/MarkerRed.png';
  blueNotes = '../../assets/images/Notesblue.png';
  redNotes = '../../assets/images/Notesred.png';
  withindays: any = [];
  tagexpiredays: any;
  singleTrackStep: any[] = [];
  selectedTrackingStep: any;
  splitColumnName: any = [];
  splitColData: any;
  mStatus: any = '';
  stepStatus: any = '';
  markCheck!: boolean;
  stepType: any;
  ViaStatus: any;
  citstatus: any;
  vahicleARstatus: any;
  totalcitstatus: any;
  DateDifference: any;

  //////notes///////
  @ViewChild('editor') editor: any;
  textarea: any;
  title = '';
  NotesData: any = [];
  date = new Date();
  add: boolean = true;
  edit: boolean = true;
  notedesc: any = '';
  userid = localStorage.getItem('UserId');
  visible: boolean = true;
  checkNotes: boolean = false;
  statusCheck: any = '';
  dealSearchdata: any;
  dummydeal: any;
  dummycoraid: any;
  dealequal: any;
  dealdata: any;
  DealIdValue: boolean = false;
  statusOfStep: boolean = false;
  cartClick: boolean = false;

  constructor(
    private actrouter: ActivatedRoute,
    private router: Router,
    private progresservice: DealprogressService,
    private DealService: DeallogService,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    private headerservice: HeaderService,
    private storeservice: StoreService,
    private fb: FormBuilder,
    private currPipe: CurrencyPipe,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    alertify.set('notifier', 'position', 'top-right');
    this.headerService.setHideFilter('N');
    this.headerservice.setactiveFilter('N');
    this.DealIdValue = false;
    localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
    const Subject = localStorage.getItem('DealData2');
    // console.log(Subject);

    this.dealdata = new BehaviorSubject(Subject ? JSON.parse(Subject) : null);
    // console.log(this.dealdata.value);
    this.dealSearchdata = this.dealdata.value;
    // console.log(this.dealSearchdata);

    this.dealId = localStorage.getItem('DealId');
    this.getCoraId = localStorage.getItem('ProgressCoraId');
    if (
      (this.dealId != '' && this.getCoraId != '') ||
      (this.dealId != null && this.getCoraId != null)
    ) {
      this.firstCheck();
    }
    this.ViewNotes();
  }

  // LAST STEP STATUS 'Y' 'N' FUNCTION...
  firstCheck() {
    // // // // // // // alert('ok')
    this.progresservice
      .PostDealData(this.dealId, this.getCoraId)
      .subscribe((res: any) => {
        // console.log(res);
        const mysmartdata = res;
        const mainStatus = mysmartdata[0].status;
        console.log(mysmartdata);
        console.log(mainStatus);

        this.DealService.getSettingsById(this.getCoraId).subscribe(
          (res: any) => {
            console.log('What we Get : ', res);
            const TrackStepsData = res.sort(
              (a: any, b: any) => a.ssSequence - b.ssSequence
            );
            const data = TrackStepsData[TrackStepsData.length - 1];
            const stepName = data.sTrackingsteps + 'status';
            const step1 = stepName.replace(/[^\w\s]/gi, '');
            const stepFinal = step1.replace(/\s/g, '').toLowerCase();
            console.log(stepFinal);
            // let checkresult = mysmartdata.hasOwnProperty(stepFinal);
            // console.log(checkresult);

            Object.keys(mysmartdata[0]).forEach((prop) => {
              if (stepFinal == prop) {
                const stepValue = mysmartdata[0][prop];
                console.log(stepValue);
                if (stepValue == 'Y' && mainStatus != 'Y') {
                  this.AllStatusComplete('Y');
                } else {
                  // // // // // // // alert('ok')
                  this.DealNoWithCoraId();
                }
              }
            });
          }
        );
      });
  }

  // TOTAL GRID FUNCTION.....
  DealNoWithCoraId() {
    this.result = [];
    this.LastArray = [];
    this.smartData = '';
    // // // // // // // // // alert(this.dealId);
    // // // // // // // // // alert(this.getCoraId);
    this.spinner.show();
    this.progresservice
      .PostDealData(this.dealId, this.getCoraId)
      .subscribe((res: any) => {
        // console.log(res);
        this.smartData = res;
        this.DealService.getSettingsById(this.getCoraId).subscribe(
          (res: any) => {
            console.log('What we Get : ', res);
            const TrackStepsData = res.sort(
              (a: any, b: any) => a.ssSequence - b.ssSequence
            );
            console.log(TrackStepsData);
          }
        );
        console.log('smart Data : ', this.smartData);
        this.startDate = this.smartData[0].contractdate;
        this.DateDifference = Math.floor(
          (new Date().getTime() - new Date(this.startDate).getTime()) /
          1000 /
          60 /
          60 /
          24
        );
        // // console.log("Date Diff : ", this.DateDifference);
        if (
          this.smartData[0].temptagexpiration == null ||
          this.smartData[0].temptagexpiration == '0001-01-01T00:00:00'
        ) {
          this.tagexpiredays = '';
        } else {
          const sd = new Date(this.smartData[0].temptagexpiration);
          ////// // // console.log(sd);
          const msInDay = 24 * 60 * 60 * 1000;
          const ed = new Date();
          this.tagexpiredays = -Math.floor(
            (ed.getTime() - sd.getTime()) / 1000 / 60 / 60 / 24
          );
          // // console.log(this.tagexpiredays);
        }

        this.Ids = this.smartData;
        console.log('total data = ', this.Ids);

        this.Trade = this.smartData[0].trade;
        this.CoraAcctId = this.smartData[0].asId;
        this.MainStatus = this.smartData[0].status;
        // // console.log(this.CoraAcctId);
        // console.log(this.getCoraId);

        this.storeservice
          .getStoreSettings(this.getCoraId)
          .subscribe((res: any) => {
            console.log('AAAAAAa', res);
            this.withindays = res;
            // // console.log(this.CoraAcctId);
            // console.log(this.getCoraId);

            this.DealService.getSettingsById(this.getCoraId).subscribe(
              (res: any) => {
                console.log('What we Get : ', res);

                this.allData = [];
                this.TrackSteps = res.sort(
                  (a: any, b: any) => a.ssSequence - b.ssSequence
                );

                console.log('tracksteps : ', this.TrackSteps);
                for (let i = 0; i < this.TrackSteps.length; i++) {
                  this.InternalSteps =
                    this.TrackSteps[i].sInternalsteps.split(',');
                  this.allData.push({
                    Data: this.TrackSteps[i],
                    inter: this.InternalSteps,
                  });
                }
                console.log('allData', this.allData);

                this.seperateInternals = [];
                for (let a = 0; a < this.allData.length; a++) {
                  const InSteps = this.allData[a].inter;
                  ////// // console.log(InSteps);

                  for (let b = 0; b < InSteps.length; b++) {
                    const Iname = InSteps[b];
                    ////// // console.log(Iname);

                    const Tname = this.allData[a].Data.sTrackingsteps + Iname;
                    // ////// // console.log("Tname==", Tname);
                    const columnTI = Tname.replace(/[^\w\s]/gi, '');
                    const TIcolumn = columnTI.replace(/\s/g, '').toLowerCase();
                    this.seperateInternals.push(TIcolumn);
                  }
                }

                this.subColumnsData = [];
                // // // console.log("combined TH : ", this.seperateInternals);
                for (let x = 0; x < this.Ids.length; x++) {
                  for (let y = 0; y < this.seperateInternals.length; y++) {
                    const DTname = this.Ids[x];
                    ////// // console.log(this.seperateInternals[y]);
                    let result = DTname.hasOwnProperty(
                      this.seperateInternals[y]
                    );
                    //////// // console.log(result);
                    if (result == true) {
                      Object.keys(DTname).forEach((prop) => {
                        if (this.seperateInternals[y] == prop) {
                          //   this.subColumnsData.push(DTname[prop]);
                          // if (prop == 'temptagexpiration') {
                          //   this.Remaining = DTname[prop];
                          //   // ////// // console.log(this.Remaining);
                          // }
                          const amountCheck = prop.indexOf('amount') !== -1;
                          // // // console.log(amountCheck);
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
                              this.Remaining = '';
                            } else {
                              this.Remaining = DTname[prop];
                            }
                          }
                        }
                      });
                    } else {
                      if (this.seperateInternals[y] == 'temptagdaysremaining') {
                        if (this.Remaining != null && this.Remaining != '') {
                          if (
                            this.tagexpiredays == 1 ||
                            this.tagexpiredays == -1
                          ) {
                            this.subColumnsData.push(
                              this.tagexpiredays + ' Day'
                            );
                          } else {
                            this.subColumnsData.push(
                              this.tagexpiredays + ' Days'
                            );
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

                this.finalArray = [];
                // // console.log("sub columns Data : ", this.subColumnsData);
                for (let b = 0; b < this.subColumnsData.length; b++) {
                  for (let a = 0; a < this.allData.length; a++) {
                    const mysub = this.allData[a].inter;
                    // ////// // console.log(mysub);

                    const mylength = this.allData[a].inter.length;
                    // ////// // console.log(mylength)
                    const datecheck = this.subColumnsData.splice(0, mylength);
                    const myarray = [];
                    for (let a = 0; a < datecheck.length; a++) {
                      if (datecheck[a] == '0001-01-01T00:00:00') {
                        myarray.push('');
                      } else {
                        myarray.push(datecheck[a]);
                      }
                    }
                    // ////// // console.log(myarray);

                    this.finalArray.push({
                      MHead: this.allData[a].Data.sTrackingsteps,
                      SHead: mysub,
                      data: myarray,
                    });
                    // // // console.log(this.finalArray);
                  }
                }

                // // console.log("final Array : ", this.finalArray);
                this.LastArray = [];
                for (let x = 0; x < this.finalArray.length; x++) {
                  for (let m = 0; m < this.withindays.length; m++) {
                    if (
                      this.finalArray[x].MHead ==
                      this.withindays[m].sTrackingsteps
                    ) {
                      const Within = this.withindays[m].sWithin;
                      const stepColorname = this.finalArray[x].MHead.replace(
                        /[^\w\s]/gi,
                        ''
                      );
                      const Colorcheck =
                        stepColorname.replace(/\s/g, '').toLowerCase() +
                        'status';
                      // // // console.log(Colorcheck);
                      if (this.MainStatus == 'Y') {
                        this.ViaStatus = 'Y';
                      } else {
                        Object.keys(this.smartData[0]).forEach((prop) => {
                          if (prop == Colorcheck) {
                            this.ViaStatus = this.smartData[0][prop];
                            // // // console.log(this.ViaStatus);
                          }
                        });
                      }
                      // // // // // // // // // alert();
                      if (this.finalArray[x].MHead == 'Temp Tag') {
                        const shead = this.finalArray[x].SHead;
                        const sdata = this.finalArray[x].data;
                        for (let y = 0; y < shead.length; y++) {
                          if (shead[y] == 'Days Remaining ') {
                            const days = sdata[y].slice(0, 1);
                            // // console.log(days);
                            if (this.ViaStatus == 'Y') {
                              // // // // // // // // // alert("y");
                              this.LastArray.push({
                                MHead: this.finalArray[x].MHead,
                                SHead: shead,
                                data: sdata,
                                clr: '#d4f3d4',
                              });
                            } else {
                              if (this.DateDifference > Within || Within == 0) {
                                if (days == '-') {
                                  this.LastArray.push({
                                    MHead: this.finalArray[x].MHead,
                                    SHead: shead,
                                    data: sdata,
                                    clr: '#f3dbd7',
                                  });
                                } else {
                                  if (days == '' || days == null) {
                                    this.LastArray.push({
                                      MHead: this.finalArray[x].MHead,
                                      SHead: shead,
                                      data: sdata,
                                      clr: '',
                                    });
                                  } else {
                                    this.LastArray.push({
                                      MHead: this.finalArray[x].MHead,
                                      SHead: shead,
                                      data: sdata,
                                      clr: '', //Green
                                    });
                                  }
                                }
                              } else {
                                if (days != '-') {
                                  this.LastArray.push({
                                    MHead: this.finalArray[x].MHead,
                                    SHead: shead,
                                    data: sdata,
                                    clr: '', //Green
                                  });
                                } else {
                                  this.LastArray.push({
                                    MHead: this.finalArray[x].MHead,
                                    SHead: shead,
                                    data: sdata,
                                    clr: '',
                                  });
                                }
                              }
                            }
                          }
                        }
                      } else {
                        if (this.finalArray[x].MHead == 'Flooring Payoff') {
                          const shead = this.finalArray[x].SHead;
                          const sdata = this.finalArray[x].data;
                          for (let y = 0; y < shead.length; y++) {
                            if (shead[y] == 'Amount') {
                              var AmountValue = sdata[y];
                            }
                            if (shead[y] == 'Balance') {
                              //// // console.log(sdata[y]);
                              let obj = {
                                flooringpayoffstatus: 'Y',
                                dealno: this.dealId,
                                coraAcctId: this.CoraAcctId,
                              };
                              const bal = sdata[y];
                              if (this.ViaStatus == 'Y') {
                                // // // // // // // // // alert("y");
                                this.LastArray.push({
                                  MHead: this.finalArray[x].MHead,
                                  SHead: shead,
                                  data: sdata,
                                  clr: '#d4f3d4',
                                });
                                // this.DealService.updatefpayOff(obj).subscribe(data => {
                                //   // // console.log("Flooring PayOff Updated.");
                                // })
                              } else {
                                if (
                                  this.DateDifference > Within ||
                                  Within == 0
                                ) {
                                  if (bal < 0) {
                                    this.LastArray.push({
                                      MHead: this.finalArray[x].MHead,
                                      SHead: shead,
                                      data: sdata,
                                      clr: '#f3dbd7',
                                    });
                                  } else {
                                    if (bal == '' || bal == null) {
                                      this.LastArray.push({
                                        MHead: this.finalArray[x].MHead,
                                        SHead: shead,
                                        data: sdata,
                                        clr: '',
                                      });
                                    } else {
                                      this.LastArray.push({
                                        MHead: this.finalArray[x].MHead,
                                        SHead: shead,
                                        data: sdata,
                                        clr: '#d4f3d4',
                                      });
                                      this.DealService.updatefpayOff(
                                        obj
                                      ).subscribe((data) => {
                                        // // console.log("Flooring PayOff Updated.");
                                      });
                                    }
                                  }
                                } else {
                                  if (bal >= 0) {
                                    this.LastArray.push({
                                      MHead: this.finalArray[x].MHead,
                                      SHead: shead,
                                      data: sdata,
                                      clr: '#d4f3d4',
                                    });
                                    this.DealService.updatefpayOff(
                                      obj
                                    ).subscribe((data) => {
                                      // // console.log("Flooring PayOff Updated.");
                                    });
                                  } else {
                                    this.LastArray.push({
                                      MHead: this.finalArray[x].MHead,
                                      SHead: shead,
                                      data: sdata,
                                      clr: '',
                                    });
                                  }
                                }
                              }
                            }
                          }
                        } else {
                          if (this.finalArray[x].MHead == 'CIT') {
                            const shead = this.finalArray[x].SHead;
                            const sdata = this.finalArray[x].data;
                            this.citstatus = this.ViaStatus;
                            for (let y = 0; y < shead.length; y++) {
                              if (shead[y] == 'Amount') {
                                var citAmount = sdata[y];
                              }
                              let obj = {
                                citstatus: 'Y',
                                dealno: this.dealId,
                                coraAcctId: this.CoraAcctId,
                              };
                              if (shead[y] == 'Current') {
                                const current = sdata[y];
                                if (this.ViaStatus == 'Y') {
                                  // // // // // // // // // alert("y");
                                  this.LastArray.push({
                                    MHead: this.finalArray[x].MHead,
                                    SHead: shead,
                                    data: sdata,
                                    clr: '#d4f3d4',
                                  });
                                  // this.DealService.updatecit(obj).subscribe(data =>{
                                  //   // // console.log('CIT Updated.');
                                  // });
                                } else {
                                  if (
                                    this.DateDifference > Within ||
                                    Within == 0
                                  ) {
                                    if (current == 'Not Funded') {
                                      this.LastArray.push({
                                        MHead: this.finalArray[x].MHead,
                                        SHead: shead,
                                        data: sdata,
                                        clr: '#f3dbd7',
                                      });
                                    } else {
                                      if (current == '' || current == null) {
                                        this.LastArray.push({
                                          MHead: this.finalArray[x].MHead,
                                          SHead: shead,
                                          data: sdata,
                                          clr: '',
                                        });
                                      } else {
                                        this.LastArray.push({
                                          MHead: this.finalArray[x].MHead,
                                          SHead: shead,
                                          data: sdata,
                                          clr: '#d4f3d4',
                                        });
                                        this.DealService.updatecit(
                                          obj
                                        ).subscribe((data) => {
                                          // // console.log('CIT Updated.');
                                        });
                                      }
                                    }
                                  } else {
                                    if (current == 'Funded') {
                                      this.LastArray.push({
                                        MHead: this.finalArray[x].MHead,
                                        SHead: shead,
                                        data: sdata,
                                        clr: '#d4f3d4',
                                      });
                                      this.DealService.updatecit(obj).subscribe(
                                        (data) => {
                                          // // console.log('CIT Updated.');
                                        }
                                      );
                                    } else {
                                      this.LastArray.push({
                                        MHead: this.finalArray[x].MHead,
                                        SHead: shead,
                                        data: sdata,
                                        clr: '',
                                      });
                                    }
                                  }
                                }
                              }
                            }
                          } else {
                            if (this.finalArray[x].MHead == 'Funded') {
                              const shead = this.finalArray[x].SHead;
                              const sdata = this.finalArray[x].data;
                              for (let y = 0; y < shead.length; y++) {
                                if (shead[y] == 'Difference') {
                                  let obj = {
                                    fundedstatus: 'Y',
                                    dealno: this.dealId,
                                    coraAcctId: this.CoraAcctId,
                                  };
                                  const diff = sdata[y];
                                  if (this.ViaStatus == 'Y') {
                                    // // // // // // // // // alert("y");
                                    this.LastArray.push({
                                      MHead: this.finalArray[x].MHead,
                                      SHead: shead,
                                      data: sdata,
                                      clr: '#d4f3d4',
                                    });
                                  } else {
                                    if (
                                      this.DateDifference > Within ||
                                      Within == 0
                                    ) {
                                      if (diff < 0) {
                                        this.LastArray.push({
                                          MHead: this.finalArray[x].MHead,
                                          SHead: shead,
                                          data: sdata,
                                          clr: '#f3dbd7',
                                        });
                                      } else {
                                        if (diff == '' || diff == null) {
                                          this.LastArray.push({
                                            MHead: this.finalArray[x].MHead,
                                            SHead: shead,
                                            data: sdata,
                                            clr: '',
                                          });
                                        } else {
                                          this.LastArray.push({
                                            MHead: this.finalArray[x].MHead,
                                            SHead: shead,
                                            data: sdata,
                                            clr: '#d4f3d4', //Green
                                          });
                                          this.DealService.updatefunded(
                                            obj
                                          ).subscribe((data) => {
                                            // // console.log('Funded Status Updated');
                                          });
                                        }
                                      }
                                    } else {
                                      if (diff >= 0) {
                                        this.LastArray.push({
                                          MHead: this.finalArray[x].MHead,
                                          SHead: shead,
                                          data: sdata,
                                          clr: '#d4f3d4', //Green
                                        });
                                        this.DealService.updatefunded(
                                          obj
                                        ).subscribe((data) => {
                                          // // console.log('Funded Status Updated');
                                        });
                                      } else {
                                        this.LastArray.push({
                                          MHead: this.finalArray[x].MHead,
                                          SHead: shead,
                                          data: sdata,
                                          clr: '',
                                        });
                                      }
                                    }
                                  }
                                }
                              }
                            } else {
                              if (
                                this.finalArray[x].MHead == 'We Owes Cleared'
                              ) {
                                const shead = this.finalArray[x].SHead;
                                const sdata = this.finalArray[x].data;
                                for (let y = 0; y < shead.length; y++) {
                                  if (shead[y] == 'Date') {
                                    var weDate = sdata[y];
                                  }
                                  if (shead[y] == 'Amount') {
                                    var weAmount = sdata[y];
                                  }
                                  let obj = {
                                    weowesclearedstatus: 'Y',
                                    dealno: this.dealId,
                                    coraAcctId: this.CoraAcctId,
                                  };
                                  if (shead[y] == 'Balance') {
                                    ////// // console.log(sdata[y]);
                                    const balance = sdata[y];
                                    if (this.ViaStatus == 'Y') {
                                      // // // // // // // // // alert("y");
                                      this.LastArray.push({
                                        MHead: this.finalArray[x].MHead,
                                        SHead: shead,
                                        data: sdata,
                                        clr: '#d4f3d4',
                                      });
                                      // this.DealService.updateeweowes(obj).subscribe(data =>{
                                      //   // // console.log("We Owes Cleared Status Updated.");
                                      // });
                                    } else {
                                      if (
                                        this.DateDifference > Within ||
                                        Within == 0
                                      ) {
                                        if (balance < 0) {
                                          this.LastArray.push({
                                            MHead: this.finalArray[x].MHead,
                                            SHead: shead,
                                            data: sdata,
                                            clr: '#f3dbd7',
                                          });
                                        } else {
                                          if (
                                            weAmount == '' ||
                                            weAmount == null ||
                                            weAmount == '--'
                                          ) {
                                            this.LastArray.push({
                                              MHead: this.finalArray[x].MHead,
                                              SHead: shead,
                                              data: sdata,
                                              clr: '',
                                            });
                                          } else {
                                            this.LastArray.push({
                                              MHead: this.finalArray[x].MHead,
                                              SHead: shead,
                                              data: sdata,
                                              clr: '#d4f3d4',
                                            });
                                            this.DealService.updateeweowes(
                                              obj
                                            ).subscribe((data) => {
                                              // // console.log("We Owes Cleared Status Updated.");
                                            });
                                          }
                                        }
                                      } else {
                                        if (balance >= 0) {
                                          this.LastArray.push({
                                            MHead: this.finalArray[x].MHead,
                                            SHead: shead,
                                            data: sdata,
                                            clr: '#d4f3d4',
                                          });
                                          this.DealService.updateeweowes(
                                            obj
                                          ).subscribe((data) => {
                                            // // console.log("We Owes Cleared Status Updated.");
                                          });
                                        } else {
                                          this.LastArray.push({
                                            MHead: this.finalArray[x].MHead,
                                            SHead: shead,
                                            data: sdata,
                                            clr: '',
                                          });
                                        }
                                      }
                                    }
                                  }
                                }
                              } else {
                                if (this.finalArray[x].MHead == 'Finalized') {
                                  const shead = this.finalArray[x].SHead;
                                  const sdata = this.finalArray[x].data;
                                  for (let y = 0; y < shead.length; y++) {
                                    // // // // // // // // // alert(shead[y]);
                                    if (shead[y] == 'CIT Balance') {
                                      let obj = {
                                        finalizedstatus: 'Y',
                                        dealno: this.dealId,
                                        coraAcctId: this.CoraAcctId,
                                      };
                                      ////// // console.log(sdata[y]);
                                      const citbal = sdata[y];
                                      if (this.ViaStatus == 'Y') {
                                        // // // // // // // // // alert("y");
                                        this.LastArray.push({
                                          MHead: this.finalArray[x].MHead,
                                          SHead: shead,
                                          data: sdata,
                                          clr: '#d4f3d4',
                                        });
                                      } else {
                                        if (
                                          this.DateDifference > Within ||
                                          Within == 0
                                        ) {
                                          if (citbal < 0) {
                                            this.LastArray.push({
                                              MHead: this.finalArray[x].MHead,
                                              SHead: shead,
                                              data: sdata,
                                              clr: '#f3dbd7',
                                            });
                                          } else {
                                            if (
                                              citbal == '' ||
                                              citbal == null
                                            ) {
                                              this.LastArray.push({
                                                MHead: this.finalArray[x].MHead,
                                                SHead: shead,
                                                data: sdata,
                                                clr: '',
                                              });
                                            } else {
                                              this.LastArray.push({
                                                MHead: this.finalArray[x].MHead,
                                                SHead: shead,
                                                data: sdata,
                                                clr: '#d4f3d4', //Green
                                              });
                                              this.DealService.updatefinalized(
                                                obj
                                              ).subscribe((data) => {
                                                // // console.log('Finalized Status Updated.')
                                              });
                                            }
                                          }
                                        } else {
                                          if (citbal >= 0) {
                                            this.LastArray.push({
                                              MHead: this.finalArray[x].MHead,
                                              SHead: shead,
                                              data: sdata,
                                              clr: '#d4f3d4', //Green
                                            });
                                            this.DealService.updatefinalized(
                                              obj
                                            ).subscribe((data) => {
                                              // // console.log('Finalized Status Updated.')
                                            });
                                          } else {
                                            this.LastArray.push({
                                              MHead: this.finalArray[x].MHead,
                                              SHead: shead,
                                              data: sdata,
                                              clr: '',
                                            });
                                          }
                                        }
                                      }
                                    }
                                  }
                                } else {
                                  if (this.finalArray[x].MHead == 'PDI') {
                                    const shead = this.finalArray[x].SHead;
                                    const sdata = this.finalArray[x].data;
                                    for (let y = 0; y < shead.length; y++) {
                                      // // // // // // // // // alert(shead[y]);
                                      if (shead[y] == 'Date') {
                                        const pdiDate = sdata[y];
                                        if (this.ViaStatus == 'Y') {
                                          // // // // // // // // // alert("y");
                                          this.LastArray.push({
                                            MHead: this.finalArray[x].MHead,
                                            SHead: shead,
                                            data: sdata,
                                            clr: '#d4f3d4',
                                          });
                                        } else {
                                          if (
                                            this.DateDifference > Within ||
                                            Within == 0
                                          ) {
                                            if (
                                              pdiDate == '' ||
                                              pdiDate == null
                                            ) {
                                              this.LastArray.push({
                                                MHead: this.finalArray[x].MHead,
                                                SHead: shead,
                                                data: sdata,
                                                clr: '',
                                              });
                                            } else {
                                              this.LastArray.push({
                                                MHead: this.finalArray[x].MHead,
                                                SHead: shead,
                                                data: sdata,
                                                clr: '#f3dbd7',
                                              });
                                            }
                                          } else {
                                            this.LastArray.push({
                                              MHead: this.finalArray[x].MHead,
                                              SHead: shead,
                                              data: sdata,
                                              clr: '',
                                            });
                                          }
                                        }
                                      }
                                    }
                                  } else {
                                    if (
                                      this.finalArray[x].MHead == 'Deal Booked'
                                    ) {
                                      const shead = this.finalArray[x].SHead;
                                      const sdata = this.finalArray[x].data;
                                      for (let y = 0; y < shead.length; y++) {
                                        // // // // // // // // // alert(shead[y]);
                                        let obj = {
                                          dealbookedbystatus: 'Y',
                                          dealno: this.dealId,
                                          coraAcctId: this.CoraAcctId,
                                        };
                                        if (shead[y] == 'Date') {
                                          const BookedDate = sdata[y];
                                          if (this.ViaStatus == 'Y') {
                                            // // // // // // // // // alert("y");
                                            this.LastArray.push({
                                              MHead: this.finalArray[x].MHead,
                                              SHead: shead,
                                              data: sdata,
                                              clr: '#d4f3d4',
                                            });
                                            // this.DealService.updatedealbooked(obj).subscribe(data => {
                                            //   // // console.log('Deal Booked Status Updated.');
                                            // });
                                          } else {
                                            if (
                                              this.DateDifference > Within ||
                                              Within == 0
                                            ) {
                                              if (
                                                BookedDate == '' ||
                                                BookedDate == null
                                              ) {
                                                this.LastArray.push({
                                                  MHead:
                                                    this.finalArray[x].MHead,
                                                  SHead: shead,
                                                  data: sdata,
                                                  clr: '',
                                                });
                                              } else {
                                                this.LastArray.push({
                                                  MHead:
                                                    this.finalArray[x].MHead,
                                                  SHead: shead,
                                                  data: sdata,
                                                  clr: '#f3dbd7',
                                                });
                                              }
                                            } else {
                                              this.LastArray.push({
                                                MHead: this.finalArray[x].MHead,
                                                SHead: shead,
                                                data: sdata,
                                                clr: '',
                                              });
                                            }
                                          }
                                        }
                                      }
                                    } else {
                                      if (
                                        this.finalArray[x].MHead ==
                                        'Contract Sent'
                                      ) {
                                        const shead = this.finalArray[x].SHead;
                                        const sdata = this.finalArray[x].data;
                                        // // // // // // // // // alert(this.finalArray[x].MHead);
                                        // // // // ////// // console.log("shead", shead);
                                        for (let y = 0; y < shead.length; y++) {
                                          // // // // // // // // // alert(shead[y]);
                                          if (shead[y] == 'Balance') {
                                            const balance = sdata[y];
                                            if (this.ViaStatus == 'Y') {
                                              // // // // // // // // // alert("y");
                                              this.LastArray.push({
                                                MHead: this.finalArray[x].MHead,
                                                SHead: shead,
                                                data: sdata,
                                                clr: '#d4f3d4',
                                              });
                                            } else {
                                              if (
                                                this.DateDifference > Within ||
                                                Within == 0
                                              ) {
                                                if (balance < 0) {
                                                  this.LastArray.push({
                                                    MHead:
                                                      this.finalArray[x].MHead,
                                                    SHead: shead,
                                                    data: sdata,
                                                    clr: '#f3dbd7',
                                                  });
                                                } else {
                                                  if (
                                                    balance == '' ||
                                                    balance == null
                                                  ) {
                                                    this.LastArray.push({
                                                      MHead:
                                                        this.finalArray[x]
                                                          .MHead,
                                                      SHead: shead,
                                                      data: sdata,
                                                      clr: '',
                                                    });
                                                  } else {
                                                    this.LastArray.push({
                                                      MHead:
                                                        this.finalArray[x]
                                                          .MHead,
                                                      SHead: shead,
                                                      data: sdata,
                                                      clr: '', //Green
                                                    });
                                                  }
                                                }
                                              } else {
                                                if (balance >= 0) {
                                                  this.LastArray.push({
                                                    MHead:
                                                      this.finalArray[x].MHead,
                                                    SHead: shead,
                                                    data: sdata,
                                                    clr: '', //Green
                                                  });
                                                } else {
                                                  this.LastArray.push({
                                                    MHead:
                                                      this.finalArray[x].MHead,
                                                    SHead: shead,
                                                    data: sdata,
                                                    clr: '',
                                                  });
                                                }
                                              }
                                            }
                                          }
                                        }
                                      } else {
                                        if (
                                          this.finalArray[x].MHead ==
                                          'Stipulations Resolved'
                                        ) {
                                          const shead =
                                            this.finalArray[x].SHead;
                                          const sdata = this.finalArray[x].data;
                                          // // // // // // // // // alert(this.finalArray[x].MHead);
                                          // // // // ////// // console.log("shead", shead);
                                          for (
                                            let y = 0;
                                            y < shead.length;
                                            y++
                                          ) {
                                            // // // // // // // // // alert(shead[y]);
                                            if (shead[y] == 'Date') {
                                              // // // // // // // // // alert('work')
                                              // // // ////// // console.log(sdata[y]);
                                              const ResolvedDate = sdata[y];
                                              ////// // console.log(ResolvedDate);
                                              const ResolvedDiff =
                                                (new Date(
                                                  ResolvedDate
                                                ).getTime() -
                                                  new Date(
                                                    this.startDate
                                                  ).getTime()) /
                                                1000 /
                                                60 /
                                                60 /
                                                24;
                                              ////// // console.log("Booked", ResolvedDiff);
                                              if (this.ViaStatus == 'Y') {
                                                // // // // // // // // // alert("y");
                                                this.LastArray.push({
                                                  MHead:
                                                    this.finalArray[x].MHead,
                                                  SHead: shead,
                                                  data: sdata,
                                                  clr: '#d4f3d4',
                                                });
                                              } else {
                                                if (
                                                  ResolvedDiff > Within &&
                                                  Within != 0
                                                ) {
                                                  // // // // // // // // // alert('if : '+bal);
                                                  this.LastArray.push({
                                                    MHead:
                                                      this.finalArray[x].MHead,
                                                    SHead: shead,
                                                    data: sdata,
                                                    clr: '#f3dbd7',
                                                  });
                                                } else {
                                                  // // // // // // // // // alert('else : '+bal);
                                                  this.LastArray.push({
                                                    MHead:
                                                      this.finalArray[x].MHead,
                                                    SHead: shead,
                                                    data: sdata,
                                                    clr: '',
                                                  });
                                                }
                                              }
                                            }
                                          }
                                        } else {
                                          if (
                                            this.finalArray[x].MHead ==
                                            'Trade Paid Off'
                                          ) {
                                            const shead =
                                              this.finalArray[x].SHead;
                                            const sdata =
                                              this.finalArray[x].data;
                                            for (
                                              let y = 0;
                                              y < shead.length;
                                              y++
                                            ) {
                                              if (shead[y] == 'Amount') {
                                                var tradeAmount = sdata[y];
                                              }
                                              let obj = {
                                                tradepaidoffstatus: 'Y',
                                                dealno: this.dealId,
                                                coraAcctId: this.CoraAcctId,
                                              };
                                              if (
                                                shead[y] == 'Negative Equity'
                                              ) {
                                                const equity = sdata[y];
                                                if (this.ViaStatus == 'Y') {
                                                  // // // // // // // // // alert("y");
                                                  this.LastArray.push({
                                                    MHead:
                                                      this.finalArray[x].MHead,
                                                    SHead: shead,
                                                    data: sdata,
                                                    clr: '#d4f3d4',
                                                  });
                                                  // this.DealService.updatepaidOff(obj).subscribe(data => {
                                                  //   // // console.log("Trade PaidOff Status Updated");
                                                  // });
                                                } else {
                                                  if (
                                                    this.DateDifference >
                                                    Within ||
                                                    Within == 0
                                                  ) {
                                                    if (equity < 0) {
                                                      this.LastArray.push({
                                                        MHead:
                                                          this.finalArray[x]
                                                            .MHead,
                                                        SHead: shead,
                                                        data: sdata,
                                                        clr: '#f3dbd7',
                                                      });
                                                    } else {
                                                      if (
                                                        equity == '' ||
                                                        equity == null
                                                      ) {
                                                        this.LastArray.push({
                                                          MHead:
                                                            this.finalArray[x]
                                                              .MHead,
                                                          SHead: shead,
                                                          data: sdata,
                                                          clr: '',
                                                        });
                                                      } else {
                                                        this.LastArray.push({
                                                          MHead:
                                                            this.finalArray[x]
                                                              .MHead,
                                                          SHead: shead,
                                                          data: sdata,
                                                          clr: '#d4f3d4',
                                                        });
                                                        this.DealService.updatepaidOff(
                                                          obj
                                                        ).subscribe((data) => {
                                                          // // console.log("Trade PaidOff Status Updated");
                                                        });
                                                      }
                                                    }
                                                  } else {
                                                    if (equity >= 0) {
                                                      this.LastArray.push({
                                                        MHead:
                                                          this.finalArray[x]
                                                            .MHead,
                                                        SHead: shead,
                                                        data: sdata,
                                                        clr: '#d4f3d4',
                                                      });
                                                      this.DealService.updatepaidOff(
                                                        obj
                                                      ).subscribe((data) => {
                                                        // // console.log("Trade PaidOff Status Updated");
                                                      });
                                                    } else {
                                                      this.LastArray.push({
                                                        MHead:
                                                          this.finalArray[x]
                                                            .MHead,
                                                        SHead: shead,
                                                        data: sdata,
                                                        clr: '',
                                                      });
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          } else {
                                            if (
                                              this.finalArray[x].MHead ==
                                              'DMV Packet Sent'
                                            ) {
                                              const shead =
                                                this.finalArray[x].SHead;
                                              const sdata =
                                                this.finalArray[x].data;
                                              for (
                                                let y = 0;
                                                y < shead.length;
                                                y++
                                              ) {
                                                if (shead[y] == 'Date') {
                                                  const DMVDate = sdata[y];
                                                  if (this.ViaStatus == 'Y') {
                                                    // // // // // // // // // alert("y");
                                                    this.LastArray.push({
                                                      MHead:
                                                        this.finalArray[x]
                                                          .MHead,
                                                      SHead: shead,
                                                      data: sdata,
                                                      clr: '#d4f3d4',
                                                    });
                                                  } else {
                                                    if (
                                                      this.DateDifference >
                                                      Within ||
                                                      Within == 0
                                                    ) {
                                                      if (
                                                        DMVDate == '' ||
                                                        DMVDate == null
                                                      ) {
                                                        this.LastArray.push({
                                                          MHead:
                                                            this.finalArray[x]
                                                              .MHead,
                                                          SHead: shead,
                                                          data: sdata,
                                                          clr: '',
                                                        });
                                                      } else {
                                                        this.LastArray.push({
                                                          MHead:
                                                            this.finalArray[x]
                                                              .MHead,
                                                          SHead: shead,
                                                          data: sdata,
                                                          clr: '#f3dbd7',
                                                        });
                                                      }
                                                    } else {
                                                      this.LastArray.push({
                                                        MHead:
                                                          this.finalArray[x]
                                                            .MHead,
                                                        SHead: shead,
                                                        data: sdata,
                                                        clr: '',
                                                      });
                                                    }
                                                  }
                                                }
                                              }
                                            } else {
                                              if (
                                                this.finalArray[x].MHead ==
                                                'Plates Received'
                                              ) {
                                                const shead =
                                                  this.finalArray[x].SHead;
                                                const sdata =
                                                  this.finalArray[x].data;
                                                for (
                                                  let y = 0;
                                                  y < shead.length;
                                                  y++
                                                ) {
                                                  if (shead[y] == 'Date') {
                                                    const PlatesDate = sdata[y];
                                                    if (this.ViaStatus == 'Y') {
                                                      // // // // // // // // // alert("y");
                                                      this.LastArray.push({
                                                        MHead:
                                                          this.finalArray[x]
                                                            .MHead,
                                                        SHead: shead,
                                                        data: sdata,
                                                        clr: '#d4f3d4',
                                                      });
                                                    } else {
                                                      if (
                                                        this.DateDifference >
                                                        Within ||
                                                        Within == 0
                                                      ) {
                                                        if (
                                                          PlatesDate == '' ||
                                                          PlatesDate == null
                                                        ) {
                                                          this.LastArray.push({
                                                            MHead:
                                                              this.finalArray[x]
                                                                .MHead,
                                                            SHead: shead,
                                                            data: sdata,
                                                            clr: '',
                                                          });
                                                        } else {
                                                          this.LastArray.push({
                                                            MHead:
                                                              this.finalArray[x]
                                                                .MHead,
                                                            SHead: shead,
                                                            data: sdata,
                                                            clr: '#f3dbd7',
                                                          });
                                                        }
                                                      } else {
                                                        this.LastArray.push({
                                                          MHead:
                                                            this.finalArray[x]
                                                              .MHead,
                                                          SHead: shead,
                                                          data: sdata,
                                                          clr: '',
                                                        });
                                                      }
                                                    }
                                                  }
                                                }
                                              } else {
                                                if (
                                                  this.finalArray[x].MHead ==
                                                  'Digital Scan Complete'
                                                ) {
                                                  const shead =
                                                    this.finalArray[x].SHead;
                                                  const sdata =
                                                    this.finalArray[x].data;
                                                  for (
                                                    let y = 0;
                                                    y < shead.length;
                                                    y++
                                                  ) {
                                                    // // // // // // // // // alert(shead[y]);
                                                    if (shead[y] == 'Date') {
                                                      const DigitalDate =
                                                        sdata[y];
                                                      if (
                                                        this.ViaStatus == 'Y'
                                                      ) {
                                                        // // // // // // // // // alert("y");
                                                        this.LastArray.push({
                                                          MHead:
                                                            this.finalArray[x]
                                                              .MHead,
                                                          SHead: shead,
                                                          data: sdata,
                                                          clr: '#d4f3d4',
                                                        });
                                                      } else {
                                                        if (
                                                          this.DateDifference >
                                                          Within ||
                                                          Within == 0
                                                        ) {
                                                          if (
                                                            DigitalDate == '' ||
                                                            DigitalDate == null
                                                          ) {
                                                            this.LastArray.push(
                                                              {
                                                                MHead:
                                                                  this
                                                                    .finalArray[
                                                                    x
                                                                  ].MHead,
                                                                SHead: shead,
                                                                data: sdata,
                                                                clr: '',
                                                              }
                                                            );
                                                          } else {
                                                            this.LastArray.push(
                                                              {
                                                                MHead:
                                                                  this
                                                                    .finalArray[
                                                                    x
                                                                  ].MHead,
                                                                SHead: shead,
                                                                data: sdata,
                                                                clr: '#f3dbd7',
                                                              }
                                                            );
                                                          }
                                                        } else {
                                                          this.LastArray.push({
                                                            MHead:
                                                              this.finalArray[x]
                                                                .MHead,
                                                            SHead: shead,
                                                            data: sdata,
                                                            clr: '',
                                                          });
                                                        }
                                                      }
                                                    }
                                                  }
                                                } else {
                                                  if (
                                                    this.finalArray[x].MHead ==
                                                    'Mailed to Customer'
                                                  ) {
                                                    const shead =
                                                      this.finalArray[x].SHead;
                                                    const sdata =
                                                      this.finalArray[x].data;
                                                    for (
                                                      let y = 0;
                                                      y < shead.length;
                                                      y++
                                                    ) {
                                                      if (shead[y] == 'Date') {
                                                        const MailedDate =
                                                          sdata[y];
                                                        if (
                                                          this.ViaStatus == 'Y'
                                                        ) {
                                                          // // // // // // // // // alert("y");
                                                          this.LastArray.push({
                                                            MHead:
                                                              this.finalArray[x]
                                                                .MHead,
                                                            SHead: shead,
                                                            data: sdata,
                                                            clr: '#d4f3d4',
                                                          });
                                                        } else {
                                                          if (
                                                            this
                                                              .DateDifference >
                                                            Within ||
                                                            Within == 0
                                                          ) {
                                                            if (
                                                              MailedDate ==
                                                              '' ||
                                                              MailedDate == null
                                                            ) {
                                                              this.LastArray.push(
                                                                {
                                                                  MHead:
                                                                    this
                                                                      .finalArray[
                                                                      x
                                                                    ].MHead,
                                                                  SHead: shead,
                                                                  data: sdata,
                                                                  clr: '',
                                                                }
                                                              );
                                                            } else {
                                                              this.LastArray.push(
                                                                {
                                                                  MHead:
                                                                    this
                                                                      .finalArray[
                                                                      x
                                                                    ].MHead,
                                                                  SHead: shead,
                                                                  data: sdata,
                                                                  clr: '#f3dbd7',
                                                                }
                                                              );
                                                            }
                                                          } else {
                                                            this.LastArray.push(
                                                              {
                                                                MHead:
                                                                  this
                                                                    .finalArray[
                                                                    x
                                                                  ].MHead,
                                                                SHead: shead,
                                                                data: sdata,
                                                                clr: '',
                                                              }
                                                            );
                                                          }
                                                        }
                                                      }
                                                    }
                                                  } else {
                                                    if (
                                                      this.finalArray[x]
                                                        .MHead ==
                                                      'Trade Title Received'
                                                    ) {
                                                      const shead =
                                                        this.finalArray[x]
                                                          .SHead;
                                                      const sdata =
                                                        this.finalArray[x].data;
                                                      for (
                                                        let y = 0;
                                                        y < shead.length;
                                                        y++
                                                      ) {
                                                        if (
                                                          shead[y] == 'Date'
                                                        ) {
                                                          const TitleDate =
                                                            sdata[y];
                                                          if (
                                                            this.ViaStatus ==
                                                            'Y'
                                                          ) {
                                                            // // // // // // // // // alert("y");
                                                            this.LastArray.push(
                                                              {
                                                                MHead:
                                                                  this
                                                                    .finalArray[
                                                                    x
                                                                  ].MHead,
                                                                SHead: shead,
                                                                data: sdata,
                                                                clr: '#d4f3d4',
                                                              }
                                                            );
                                                          } else {
                                                            if (
                                                              this
                                                                .DateDifference >
                                                              Within ||
                                                              Within == 0
                                                            ) {
                                                              if (
                                                                TitleDate ==
                                                                '' ||
                                                                TitleDate ==
                                                                null
                                                              ) {
                                                                this.LastArray.push(
                                                                  {
                                                                    MHead:
                                                                      this
                                                                        .finalArray[
                                                                        x
                                                                      ].MHead,
                                                                    SHead:
                                                                      shead,
                                                                    data: sdata,
                                                                    clr: '',
                                                                  }
                                                                );
                                                              } else {
                                                                this.LastArray.push(
                                                                  {
                                                                    MHead:
                                                                      this
                                                                        .finalArray[
                                                                        x
                                                                      ].MHead,
                                                                    SHead:
                                                                      shead,
                                                                    data: sdata,
                                                                    clr: '#f3dbd7',
                                                                  }
                                                                );
                                                              }
                                                            } else {
                                                              this.LastArray.push(
                                                                {
                                                                  MHead:
                                                                    this
                                                                      .finalArray[
                                                                      x
                                                                    ].MHead,
                                                                  SHead: shead,
                                                                  data: sdata,
                                                                  clr: '',
                                                                }
                                                              );
                                                            }
                                                          }
                                                        }
                                                      }
                                                    } else {
                                                      if (
                                                        this.finalArray[x]
                                                          .MHead ==
                                                        'Vehicle A/R'
                                                      ) {
                                                        const shead =
                                                          this.finalArray[x]
                                                            .SHead;
                                                        const sdata =
                                                          this.finalArray[x]
                                                            .data;
                                                        this.vahicleARstatus =
                                                          this.ViaStatus;
                                                        for (
                                                          let y = 0;
                                                          y < shead.length;
                                                          y++
                                                        ) {
                                                          if (
                                                            shead[y] == 'Date'
                                                          ) {
                                                            var vehicleDate =
                                                              sdata[y];
                                                          }
                                                          if (
                                                            shead[y] == 'Amount'
                                                          ) {
                                                            var vehicleAmount =
                                                              sdata[y];
                                                          }
                                                          let obj = {
                                                            vehiclearstatus:
                                                              'Y',
                                                            dealno: this.dealId,
                                                            coraAcctId:
                                                              this.CoraAcctId,
                                                          };
                                                          if (
                                                            shead[y] ==
                                                            'Current'
                                                          ) {
                                                            const current =
                                                              sdata[y];
                                                            // // // console.log("current", current);
                                                            if (
                                                              this.ViaStatus ==
                                                              'Y'
                                                            ) {
                                                              // // // // // // // // // alert("y");
                                                              this.LastArray.push(
                                                                {
                                                                  MHead:
                                                                    this
                                                                      .finalArray[
                                                                      x
                                                                    ].MHead,
                                                                  SHead: shead,
                                                                  data: sdata,
                                                                  clr: '#d4f3d4',
                                                                }
                                                              );
                                                              // this.DealService.updatevehiclear(obj).subscribe(data => {
                                                              //   // // console.log("VehicleA/R Status Updated.");
                                                              // });
                                                            } else {
                                                              if (
                                                                this
                                                                  .DateDifference >
                                                                Within ||
                                                                Within == 0
                                                              ) {
                                                                if (
                                                                  current ==
                                                                  'Not Funded'
                                                                ) {
                                                                  this.LastArray.push(
                                                                    {
                                                                      MHead:
                                                                        this
                                                                          .finalArray[
                                                                          x
                                                                        ].MHead,
                                                                      SHead:
                                                                        shead,
                                                                      data: sdata,
                                                                      clr: '#f3dbd7', //red
                                                                    }
                                                                  );
                                                                } else {
                                                                  if (
                                                                    vehicleAmount ==
                                                                    '' ||
                                                                    vehicleAmount ==
                                                                    null
                                                                  ) {
                                                                    this.LastArray.push(
                                                                      {
                                                                        MHead:
                                                                          this
                                                                            .finalArray[
                                                                            x
                                                                          ]
                                                                            .MHead,
                                                                        SHead:
                                                                          shead,
                                                                        data: sdata,
                                                                        clr: '',
                                                                      }
                                                                    );
                                                                  } else {
                                                                    this.LastArray.push(
                                                                      {
                                                                        MHead:
                                                                          this
                                                                            .finalArray[
                                                                            x
                                                                          ]
                                                                            .MHead,
                                                                        SHead:
                                                                          shead,
                                                                        data: sdata,
                                                                        clr: '#d4f3d4', //green
                                                                      }
                                                                    );
                                                                    this.DealService.updatevehiclear(
                                                                      obj
                                                                    ).subscribe(
                                                                      (
                                                                        data
                                                                      ) => {
                                                                        // // console.log("VehicleA/R Status Updated.");
                                                                      }
                                                                    );
                                                                  }
                                                                }
                                                              } else {
                                                                if (
                                                                  current ==
                                                                  'Funded'
                                                                ) {
                                                                  this.LastArray.push(
                                                                    {
                                                                      MHead:
                                                                        this
                                                                          .finalArray[
                                                                          x
                                                                        ].MHead,
                                                                      SHead:
                                                                        shead,
                                                                      data: sdata,
                                                                      clr: '#d4f3d4', //green
                                                                    }
                                                                  );
                                                                  this.DealService.updatevehiclear(
                                                                    obj
                                                                  ).subscribe(
                                                                    (data) => {
                                                                      // // console.log("VehicleA/R Status Updated.");
                                                                    }
                                                                  );
                                                                } else {
                                                                  this.LastArray.push(
                                                                    {
                                                                      MHead:
                                                                        this
                                                                          .finalArray[
                                                                          x
                                                                        ].MHead,
                                                                      SHead:
                                                                        shead,
                                                                      data: sdata,
                                                                      clr: '',
                                                                    }
                                                                  );
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      } else {
                                                        if (
                                                          this.finalArray[x]
                                                            .MHead ==
                                                          'Total CIT'
                                                        ) {
                                                          const shead =
                                                            this.finalArray[x]
                                                              .SHead;
                                                          const sdata =
                                                            this.finalArray[x]
                                                              .data;
                                                          for (
                                                            let y = 0;
                                                            y < shead.length;
                                                            y++
                                                          ) {
                                                            if (
                                                              shead[y] == 'Date'
                                                            ) {
                                                              var Tdate =
                                                                sdata[y];
                                                            }
                                                            if (
                                                              shead[y] ==
                                                              'Amount'
                                                            ) {
                                                              var Tcit =
                                                                sdata[y];
                                                            }
                                                            let obj = {
                                                              totalcitstatus:
                                                                'Y',
                                                              dealno:
                                                                this.dealId,
                                                              coraAcctId:
                                                                this.CoraAcctId,
                                                            };
                                                            if (
                                                              shead[y] ==
                                                              'Current'
                                                            ) {
                                                              const current =
                                                                sdata[y];
                                                              // // console.log("current", current);
                                                              if (
                                                                this
                                                                  .ViaStatus ==
                                                                'Y' ||
                                                                (this
                                                                  .citstatus ==
                                                                  'Y' &&
                                                                  this
                                                                    .vahicleARstatus ==
                                                                  'Y')
                                                              ) {
                                                                // // // // // // // // // alert("y");
                                                                this.LastArray.push(
                                                                  {
                                                                    MHead:
                                                                      this
                                                                        .finalArray[
                                                                        x
                                                                      ].MHead,
                                                                    SHead:
                                                                      shead,
                                                                    data: sdata,
                                                                    clr: '#d4f3d4',
                                                                  }
                                                                );
                                                                // this.DealService.updatetotalcit(obj).subscribe(data =>{
                                                                //   // // console.log("Total Cit Status Updated.");
                                                                // });
                                                              } else {
                                                                if (
                                                                  this
                                                                    .DateDifference >
                                                                  Within ||
                                                                  Within == 0
                                                                ) {
                                                                  if (
                                                                    current ==
                                                                    'Not Funded'
                                                                  ) {
                                                                    this.LastArray.push(
                                                                      {
                                                                        MHead:
                                                                          this
                                                                            .finalArray[
                                                                            x
                                                                          ]
                                                                            .MHead,
                                                                        SHead:
                                                                          shead,
                                                                        data: sdata,
                                                                        clr: '#f3dbd7', //red
                                                                      }
                                                                    );
                                                                  } else {
                                                                    if (
                                                                      Tcit ==
                                                                      '' ||
                                                                      Tcit ==
                                                                      null
                                                                    ) {
                                                                      this.LastArray.push(
                                                                        {
                                                                          MHead:
                                                                            this
                                                                              .finalArray[
                                                                              x
                                                                            ]
                                                                              .MHead,
                                                                          SHead:
                                                                            shead,
                                                                          data: sdata,
                                                                          clr: '',
                                                                        }
                                                                      );
                                                                    } else {
                                                                      this.LastArray.push(
                                                                        {
                                                                          MHead:
                                                                            this
                                                                              .finalArray[
                                                                              x
                                                                            ]
                                                                              .MHead,
                                                                          SHead:
                                                                            shead,
                                                                          data: sdata,
                                                                          clr: '#d4f3d4', //green
                                                                        }
                                                                      );
                                                                      this.DealService.updatetotalcit(
                                                                        obj
                                                                      ).subscribe(
                                                                        (
                                                                          data
                                                                        ) => {
                                                                          // // console.log("Total Cit Status Updated.");
                                                                        }
                                                                      );
                                                                    }
                                                                  }
                                                                } else {
                                                                  if (
                                                                    current ==
                                                                    'Funded'
                                                                  ) {
                                                                    this.LastArray.push(
                                                                      {
                                                                        MHead:
                                                                          this
                                                                            .finalArray[
                                                                            x
                                                                          ]
                                                                            .MHead,
                                                                        SHead:
                                                                          shead,
                                                                        data: sdata,
                                                                        clr: '#d4f3d4', //green
                                                                      }
                                                                    );
                                                                    this.DealService.updatetotalcit(
                                                                      obj
                                                                    ).subscribe(
                                                                      (
                                                                        data
                                                                      ) => {
                                                                        // // console.log("Total Cit Status Updated.");
                                                                      }
                                                                    );
                                                                  } else {
                                                                    this.LastArray.push(
                                                                      {
                                                                        MHead:
                                                                          this
                                                                            .finalArray[
                                                                            x
                                                                          ]
                                                                            .MHead,
                                                                        SHead:
                                                                          shead,
                                                                        data: sdata,
                                                                        clr: '',
                                                                      }
                                                                    );
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        } else {
                                                          this.LastArray.push({
                                                            MHead:
                                                              this.finalArray[x]
                                                                .MHead,
                                                            SHead:
                                                              this.finalArray[x]
                                                                .SHead,
                                                            data: this
                                                              .finalArray[x]
                                                              .data,
                                                            clr: '',
                                                          });
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  this.spinner.hide();
                }

                /////////////////////Dates Condition//////////////////////
                // // console.log("Last Array : ", this.LastArray)
                this.conditionArray = [];
                for (let z = 0; z < this.LastArray.length; z++) {
                  this.checkNotes = false;
                  if (this.LastArray[z].clr == '#f3dbd7') {
                    const mainHead = this.LastArray[z].MHead;
                    const headings = this.LastArray[z].SHead;
                    ////// // // console.log(headings);
                    const headingdatas = this.LastArray[z].data;
                    for (let a = 0; a < this.NotesData.length; a++) {
                      if (mainHead == this.NotesData[a].nTitle) {
                        this.checkNotes = true;
                        break;
                      }
                    }
                    if (this.checkNotes == true) {
                      for (let y = 0; y < headings.length; y++) {
                        if (
                          headings[y] == 'Expiration' ||
                          headings[y] == 'Date' ||
                          headings[y] == 'Date1'
                        ) {
                          const datestart = new Date(headingdatas[y]);
                          const nextdate = datestart.setDate(
                            datestart.getDate()
                          );
                          const fulldate = new Date(nextdate);
                          const thedateis = this.datepipe.transform(
                            fulldate,
                            'MM.dd.yy'
                          );
                          this.conditionArray.push({
                            name: this.LastArray[z].MHead,
                            date: thedateis,
                            imgUrl: this.redDot,
                            status: 'expire',
                            noteImg: this.redNotes,
                          });
                        }
                      }
                    }
                    ////// // // console.log(headingdatas);
                  } else {
                    const mainHead = this.LastArray[z].MHead;
                    const headings = this.LastArray[z].SHead;
                    const headingdatas = this.LastArray[z].data;
                    // // // console.log(headings);
                    // // // console.log(headingdatas);
                    for (let a = 0; a < this.NotesData.length; a++) {
                      if (mainHead == this.NotesData[a].nTitle) {
                        this.checkNotes = true;
                        break;
                      }
                    }
                    if (this.checkNotes == true) {
                      // // // console.log(this.checkNotes);
                      for (let y = 0; y < headings.length; y++) {
                        if (
                          headings[y] == 'Expiration' ||
                          headings[y] == 'Date' ||
                          headings[y] == ''
                        ) {
                          if (
                            headingdatas[y] != null &&
                            headingdatas[y] != '' &&
                            headingdatas[y] != undefined
                          ) {
                            const datestart = new Date(headingdatas[y]);
                            const nextdate = datestart.setDate(
                              datestart.getDate()
                            );
                            const fulldate = new Date(nextdate);
                            const thedateis = this.datepipe.transform(
                              fulldate,
                              'MM.dd.yy'
                            );
                            this.conditionArray.push({
                              name: this.LastArray[z].MHead,
                              date: thedateis,
                              imgUrl: this.blueDot,
                              status: 'viaNote',
                              noteImg: this.blueNotes,
                            });
                          } else {
                            this.conditionArray.push({
                              name: this.LastArray[z].MHead,
                              date: '',
                              imgUrl: this.blueDot,
                              status: 'viaNote',
                              noteImg: this.blueNotes,
                            });
                          }
                        }
                      }
                    } else {
                      // // // console.log(this.checkNotes);
                      for (let y = 0; y < headings.length; y++) {
                        if (
                          headings[y] == 'Expiration' ||
                          headings[y] == 'Date' ||
                          headings[y] == ''
                        ) {
                          if (
                            headingdatas[y] != null &&
                            headingdatas[y] != '' &&
                            headingdatas[y] != undefined
                          ) {
                            const datestart = new Date(headingdatas[y]);
                            const nextdate = datestart.setDate(
                              datestart.getDate()
                            );
                            const fulldate = new Date(nextdate);
                            const thedateis = this.datepipe.transform(
                              fulldate,
                              'MM.dd.yy'
                            );
                            this.conditionArray.push({
                              name: this.LastArray[z].MHead,
                              date: thedateis,
                              imgUrl: this.blueDot,
                              status: 'active',
                              noteImg: '',
                            });
                          } else {
                            this.conditionArray.push({
                              name: this.LastArray[z].MHead,
                              date: '',
                              imgUrl: this.blueDot,
                              status: 'active',
                              noteImg: '',
                            });
                          }
                        }
                      }
                    }
                  }
                  // this.ViewNotes();
                }

                ////// // console.log(this.conditionArray);
                this.FinalDates = [];
                for (let i = 0; i < this.conditionArray.length; i++) {
                  for (let n = 0; n < this.NotesData.length; n++) {
                    if (
                      this.conditionArray[i].name == this.NotesData[n].nTitle
                    ) {
                      this.FinalDates.push(this.conditionArray[i]);
                    }
                  }
                }

                console.log('Last Array', this.LastArray);
              }
            );
          });
        ////// // console.log(this.withindays);
        // console.log(this.LastArray);

        if (this.Trade == 'Y') {
          this.TradeVisible = true;
        } else {
          this.TradeVisible = false;
        }
      });
    this.ViewNotes();
  }

  // SEARCH BY DEALNUMBER FUNCTION...
  DealForm = this.fb.group({ dealnumber: [''] });
  SearchByDealNo() {
    const DealNo = this.DealForm.value.dealnumber;
    // // // // // // // // alert(DealNo);
    for (let i = 0; i < this.dealSearchdata.length; i++) {
      // console.log(this.dealSearchdata[i]);

      if (DealNo == this.dealSearchdata[i].details.dealno) {
        // // // // // // // // alert(DealNo);
        this.dummydeal = this.dealSearchdata[i].details.dealno;
        this.dummycoraid = this.dealSearchdata[i].details.asId;
      }
    }
    if (DealNo == '' || DealNo == null) {
      alertify.error('Enter Deal Number').dismissOthers();
    } else {
      if (DealNo == this.dummydeal) {
        // // // // // // // // // alert('dealno recond equal');
        this.dealId = this.dummydeal;
        this.getCoraId = this.dummycoraid;
        this.DealNoWithCoraId();
      } else {
        // // // // // // // // // alert('outof Records')
        this.progresservice
          .PostDealData(DealNo, this.getCoraId)
          .subscribe((res: any) => {
            // // console.log(res);
            this.dealequal = res;
            // // console.log("DealEqual", this.dealequal);
            if (this.dealequal.length == 0) {
              alertify.error('Deal Number Not Found').dismissOthers();
            } else {
              this.finalArray = [];
              this.LastArray = [];
              this.conditionArray = [];
              this.FinalDates = [];
              this.allData = [];
              this.NotesData = [];
              this.dealId = DealNo;
              this.DealNoWithCoraId();
            }
          });
      }
    }
    this.DealForm.reset();
  }

  // DIVS ADD ONE BY ONE ATOMATICALLY ON USING FORM ARRAY..
  stepsForm = this.fb.group({
    inputsdata: this.fb.array([]),
    textarea: [''],
  });
  get inputsdata() {
    return this.stepsForm.get('inputsdata') as FormArray;
  }

  // MARK AS COMPLETED (TRUE OR FASLE) FUNCTION...
  checkSelect(event: any) {
    if (event.target.checked == true) {
      this.stepStatus = 'Y';
    } else {
      this.stepStatus = 'N';
    }
  }

  // TOTAL NOTESDATA FUNCTION....
  ViewNotes() {
    this.progresservice.getnote(this.dealId).subscribe((data) => {
      this.NotesData = data;
      // // console.log("NOtes Data : ", this.NotesData);
    });
  }

  // NUMBER OR STRING FUNCTION FOR TRACKING STEPS..
  typeOf(value: any) {
    if (typeof value == 'string') {
      const checkWord = value.indexOf(this.removeTime) !== -1;
      if (checkWord == true) {
        const dateIs = value.replace(this.removeTime, '');
        const year = dateIs.slice(2, 4);
        const month = dateIs.slice(5, 7);
        const day = dateIs.slice(8, 10);
        this.item = month + '.' + day + '.' + year;
      } else {
        this.item = value;
      }
    } else if (typeof value == 'number') {
      if (value < 0) {
        const checkNum = Math.abs(value);
        this.item = value;
        // ////// // console.log("number", checkNum);
      } else {
        this.item = value;
      }
    }
    return typeof value;
  }

  // CLEAR ALL DATA FUNCTION...
  clearAll() {
    this.allData = [];
    this.LastArray = [];
    this.finalArray = [];
    this.FinalDates = [];
    this.stepStatus = '';
  }

  // SINGLE CLICK OPEN POPUP FUNCTION....
  singleCartClick(data: any) {
    console.log(data);
    this.cartClick = true;
    this.singleStepDetails(data);
  }

  // DEAL OPEN STATUS 'N' FUNCTION....
  singleStepDetails(data: any) {
    console.log(data);
    // // // // alert('Status Of ' +this.statusOfStep);
    this.singleTrackStep = data;
    // // console.log(this.singleTrackStep);
    this.selectedTrackingStep = data.MHead;
    this.splitColumnName = data.SHead;
    this.splitColData = data.data;
    this.inputsdata.clear();
    this.stepStatus = '';
    this.stepsForm.reset();

    this.progresservice
      .PostDealData(this.dealId, this.CoraAcctId)
      .subscribe((res: any) => {
        // // console.log(res);
        const checkStatus = this.selectedTrackingStep + 'status';
        const columnTI = checkStatus.replace(/[^\w\s]/gi, '');
        // // console.log(columnTI);
        const TIcolumn = columnTI.replace(/\s/g, '').toLowerCase();
        // // console.log(TIcolumn);
        Object.keys(res[0]).forEach((prop) => {
          if (prop == TIcolumn) {
            this.stepStatus = res[0][prop];

            this.statusCheck = res[0][prop];
            // // // // alert('firstStatus'+this.statusCheck);
            // // console.log(TIcolumn + " : " + this.stepStatus);
          }
        });

        // // // // alert(this.statusCheck)
        if (this.statusOfStep == true && this.statusCheck == 'Y') {
          this.stepStatus = 'N';
          // // // // alert('step ' +this.stepStatus);
          this.saveData();
          this.statusOfStep = false;
        } else {
          if (this.cartClick == false) {
            this.DealNoWithCoraId();
          }
        }
      });

    for (let a = 0; a < this.splitColumnName.length; a++) {
      if (this.splitColumnName[a] != 'Days Remaining ') {
        if (typeof this.splitColData[a] == 'string') {
          const dateIs = this.splitColData[a].indexOf(this.removeTime) !== -1;
          if (dateIs == true) {
            const datevalue = this.splitColData[a].replace(this.removeTime, '');
            this.inputsdata.push(this.fb.control(datevalue));
          } else {
            this.inputsdata.push(this.fb.control(this.splitColData[a]));
          }
        } else {
          if (typeof this.splitColData[a] == 'number') {
            this.inputsdata.push(
              this.fb.control(
                this.currPipe.transform(
                  this.splitColData[a],
                  'USD',
                  'symbol',
                  '1.0-0'
                )
              )
            );
          } else {
            this.inputsdata.push(this.fb.control(''));
          }
        }
      }
    }

    for (let i = 0; i < this.allData.length; i++) {
      if (this.allData[i].Data.sTrackingsteps == this.selectedTrackingStep) {
        this.stepType = this.allData[i].Data.sType;
        // // console.log(this.stepType);
        // alert(this.stepType)
        if (this.stepType == 'A') {
          this.disableInputs();
        } else {
          this.enableInputs();
        }
      }
    }

    this.notedesc = '';
    for (let i = 0; i < this.NotesData.length; i++) {
      if (this.selectedTrackingStep == this.NotesData[i].nTitle) {
        this.notedesc = this.NotesData[i];

        this.stepsForm.patchValue({
          textarea: this.NotesData[i].nDescription,
        });
      }
    }
  }

  // TOTAL STATUS 'Y' DISABLE FUNCTION...
  disableInputs() {
    (<FormArray>this.stepsForm.get('inputsdata')).controls.forEach(
      (control) => {
        control.disable();
      }
    );
  }

  // TOTAL STATUS 'N' ENABLE FUNCTION...
  enableInputs() {
    (<FormArray>this.stepsForm.get('inputsdata')).controls.forEach(
      (control) => {
        control.enable();
      }
    );
  }

  // DIVS DIVIDE STYLE FUNCTION....
  getStyleS() {
    return {
      display: 'grid',
      'grid-template-columns': '48% 48%',
      'column-gap': '1rem',
    };
  }

  // SINGLE INTERNALS STEPS SAVE FUNCTIONS....
  savePDI(Obj: any) {
    // // console.log(Obj);
    this.DealService.updatepdi(Obj).subscribe((data) => {
      // // console.log(data);
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('PDI Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveTempTag(Obj: any) {
    // // console.log(Obj);
    this.DealService.updatetemptag(Obj).subscribe((data) => {
      // // console.log(data);
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Temp Tag Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveCIT(Obj: any) {
    this.DealService.updatecit(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('CIT Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveVehicle(Obj: any) {
    this.DealService.updatevehiclear(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('VehicleA/R Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveContract(Obj: any) {
    // // console.log(Obj);
    this.DealService.updatecontract(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('ContractSent Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveTTR(Obj: any) {
    this.DealService.updatetradetitle(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('TTR Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveWeOwes(Obj: any) {
    this.DealService.updateeweowes(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveDealBooked(Obj: any) {
    this.DealService.updatedealbooked(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Deal Booked Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveFlooring(Obj: any) {
    this.DealService.updatefpayOff(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveFunded(Obj: any) {
    this.DealService.updatefunded(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Funded Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveFinalized(Obj: any) {
    this.DealService.updatefinalized(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Finalized Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveDMV(Obj: any) {
    this.DealService.updatedmv(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  savePlatesRec(Obj: any) {
    this.DealService.updateplates(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Plates Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveDigital(Obj: any) {
    this.DealService.updatedigitalscan(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Digital Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveMailed(Obj: any) {
    this.DealService.updatemailed(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Mailed Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveTC(Obj: any) {
    this.DealService.updatetotalcit(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Total Cit Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  saveTradePO(Obj: any) {
    this.DealService.updatepaidOff(Obj).subscribe((data) => {
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      //// // console.log(data);
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      alertify.success('Updated Successfully.').dismissOthers();
      this.clearAll();
      this.firstCheck();
    });
  }

  // TOTAL INTERNALS STEPS SAVE FUNCTION....
  saveData() {
    // alert(null as any);
    this.textarea = this.stepsForm.value.textarea;
    const TrackData = this.stepsForm.value.inputsdata;
    // alert('Track Data ' +TrackData);
    if (this.stepStatus == 'N') {
      this.markCheck = false;
    }
    if (this.stepStatus == 'Y') {
      this.markCheck = true;
    }
    const DNo = this.dealId.toString();
    const CID = this.CoraAcctId;
    // // // console.log(this.markCheck);
    if (this.markCheck == true) {
      // // // // // // alert('m check true')
      this.mStatus = 'Y';
    } else {
      // // // // // // alert('m check false')
      this.mStatus = 'N';
    }
    //////////////// PDI ////////////////////
    if (this.selectedTrackingStep == 'PDI') {
      let pdiCheck: any = '';
      if (TrackData == undefined) {
        pdiCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          pdiCheck = true;
        } else {
          pdiCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (pdiCheck == true) {
        let obj = {
          pdidate: null as any,
          pdiby: TrackData[1],
          pdistatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.savePDI(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.savePDI(obj);
              }
            }
          }
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.savePDI(obj);
        }
      } else {
        let obj = {
          pdidate: TrackData[0],
          pdiby: TrackData[1],
          pdistatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.savePDI(obj);
        } else {
          this.savePDI(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    //////////////// Temp Tag ////////////////////
    if (this.selectedTrackingStep == 'Temp Tag') {
      let tempCheck: any = '';
      if (TrackData == undefined) {
        tempCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          tempCheck = true;
        } else {
          tempCheck = false;
        }
      }
      // // // // alert('tempcheck ' +tempCheck)
      // // // // alert (pdiCheck);
      if (tempCheck == true) {
        let obj = {
          temptagnumber: TrackData[1],
          temptagexpiration: null as any,
          temptagstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          console.log(obj);
          // // // // // alert('step' +this.stepStatus);
          if (this.statusCheck == 'Y') {
            this.saveTempTag(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveTempTag(obj);
              }
            }
          }
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveTempTag(obj);
        }
      } else {
        let obj = {
          temptagnumber: TrackData[1],
          temptagexpiration: TrackData[0],
          temptagstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveTempTag(obj);
        } else {
          this.saveTempTag(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    //////////////// CIT ////////////////////
    if (this.selectedTrackingStep == 'CIT') {
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let citCheck: any = '';
      if (TrackData == undefined) {
        citCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          citCheck = true;
        } else {
          citCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (citCheck == true) {
        let obj = {
          citstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveCIT(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveCIT(obj);
              }
            }
          }
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveCIT(obj);
        }
      } else {
        let obj = {
          citstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveCIT(obj);
        } else {
          this.saveCIT(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    //////////////// Vehicle A/R ////////////////////
    if (this.selectedTrackingStep == 'Vehicle A/R') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let vehicleCheck: any = '';
      if (TrackData == undefined) {
        vehicleCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          vehicleCheck = true;
        } else {
          vehicleCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (vehicleCheck == true) {
        let obj = {
          vehiclearstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveVehicle(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveVehicle(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveVehicle(obj);
        }
      } else {
        let obj = {
          vehiclearstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveVehicle(obj);
        } else {
          this.saveVehicle(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    //////////////// Total CIT ////////////////////
    if (this.selectedTrackingStep == 'Total CIT') {
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let tcCheck: any = '';
      if (TrackData == undefined) {
        tcCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          tcCheck = true;
        } else {
          tcCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (tcCheck == true) {
        let obj = {
          totalcitstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveTC(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveTC(obj);
              }
            }
          }
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveTC(obj);
        }
      } else {
        let obj = {
          totalcitstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveTC(obj);
        } else {
          this.saveTC(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }

      if (TrackData == undefined) {
        tcCheck = true;
      } else {
        tcCheck = TrackData.includes('');
      }
      if (tcCheck == true) {
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          // // // // // // // // alert("Fields Required.");
        } else {
          this.savenotes();
        }
      } else {
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          let obj = {
            totalcitstatus: this.mStatus,
            dealno: DNo,
            coraAcctId: CID,
          };
          // // console.log(obj);
          this.DealService.updatetotalcit(obj).subscribe((data) => {
            //// // console.log(data);
            this.closemd.nativeElement.click();
            this.stepsForm.reset();
            alertify.success('Updated Successfully.').dismissOthers();
            this.DealNoWithCoraId();
            this.clearAll();
          });
        } else {
          let obj = {
            totalcitstatus: this.mStatus,
            dealno: DNo,
            coraAcctId: CID,
          };
          // // console.log(obj);
          this.DealService.updatetotalcit(obj).subscribe((data) => {
            //// // console.log(data);
            this.closemd.nativeElement.click();
            this.stepsForm.reset();
            alertify.success('Updated Successfully.').dismissOthers();
            this.DealNoWithCoraId();
            this.clearAll();
          });
          this.savenotes();
        }
      }
    }

    //////////////// Contract Sent ////////////////////
    if (this.selectedTrackingStep == 'Contract Sent') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      console.log(TrackData);
      let csCheck: any = '';
      if (TrackData == undefined) {
        csCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          csCheck = true;
        } else {
          csCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (csCheck == true) {
        let obj = {
          contractsentdate: null as any,
          contractsentbalance: null as any,
          contractsentto: null as any,
          contractsentstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveContract(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveContract(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveContract(obj);
        }
      } else {
        let obj = {
          contractsentdate: TrackData[0],
          contractsentbalance: TrackData[1],
          contractsentto: TrackData[2],
          contractsentstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveContract(obj);
        } else {
          this.saveContract(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    //////////////// Trade Paid Off ////////////////////
    if (this.selectedTrackingStep == 'Trade Paid Off') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let tpoCheck: any = '';
      if (TrackData == undefined) {
        tpoCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          tpoCheck = true;
        } else {
          tpoCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (tpoCheck == true) {
        let obj = {
          tradepaidoffstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveTradePO(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveTradePO(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveTradePO(obj);
        }
      } else {
        let obj = {
          tradepaidoffstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveTradePO(obj);
        } else {
          this.saveTradePO(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Trade Title Received ////////////////////
    if (this.selectedTrackingStep == 'Trade Title Received') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let ttrCheck: any = '';
      if (TrackData == undefined) {
        ttrCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          ttrCheck = true;
        } else {
          ttrCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (ttrCheck == true) {
        let obj = {
          tradetitlereceiveddate: null as any,
          tradetitlereceivedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveTTR(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveTTR(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveTTR(obj);
        }
      } else {
        let obj = {
          tradetitlereceiveddate: TrackData[0],
          tradetitlereceivedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveTTR(obj);
        } else {
          this.saveTTR(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// We Owes Cleared ////////////////////
    if (this.selectedTrackingStep == 'We Owes Cleared') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let wocCheck: any = '';
      if (TrackData == undefined) {
        wocCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          wocCheck = true;
        } else {
          wocCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (wocCheck == true) {
        // alert('ok')
        let obj = {
          weowesclearedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveWeOwes(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveWeOwes(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveWeOwes(obj);
        }
      } else {
        let obj = {
          weowesclearedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveWeOwes(obj);
        } else {
          this.saveWeOwes(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Deal Booked ////////////////////
    if (this.selectedTrackingStep == 'Deal Booked') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let dbCheck: any = '';
      if (TrackData == undefined) {
        dbCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          dbCheck = true;
        } else {
          dbCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (dbCheck == true) {
        let obj = {
          dealbookedbystatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveDealBooked(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveDealBooked(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveDealBooked(obj);
        }
      } else {
        let obj = {
          dealbookedbystatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveDealBooked(obj);
        } else {
          this.saveDealBooked(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Flooring Payoff ////////////////////
    if (this.selectedTrackingStep == 'Flooring Payoff') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let fpCheck: any = '';
      if (TrackData == undefined) {
        fpCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          fpCheck = true;
        } else {
          fpCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (fpCheck == true) {
        let obj = {
          flooringpayoffstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveFlooring(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveFlooring(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveFlooring(obj);
        }
      } else {
        let obj = {
          flooringpayoffstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveFlooring(obj);
        } else {
          this.saveFlooring(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Funded ////////////////////
    if (this.selectedTrackingStep == 'Funded') {
      // // // // // // alert('Funded')
      let fuCheck: any = '';
      console.log(TrackData);

      if (TrackData == undefined) {
        fuCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          fuCheck = true;
        } else {
          fuCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (fuCheck == true) {
        // // // // // // alert('f CHeck true')
        let obj = {
          fundedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };

        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          console.log(obj);

          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveFunded(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveFunded(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveFunded(obj);
        }
      } else {
        // // // // // // alert('f CHeck false')
        let obj = {
          fundedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveFunded(obj);
        } else {
          this.saveFunded(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Finalized ////////////////////
    if (this.selectedTrackingStep == 'Finalized') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let fiCheck: any = '';
      if (TrackData == undefined) {
        fiCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          fiCheck = true;
        } else {
          fiCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (fiCheck == true) {
        let obj = {
          finalizedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveFinalized(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveFinalized(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveFinalized(obj);
        }
      } else {
        let obj = {
          finalizedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveFinalized(obj);
        } else {
          this.saveFinalized(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// DMV Packet Sent ////////////////////
    if (this.selectedTrackingStep == 'DMV Packet Sent') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let dmvCheck: any = '';
      if (TrackData == undefined) {
        dmvCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          dmvCheck = true;
        } else {
          dmvCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (dmvCheck == true) {
        let obj = {
          dmvpacketsentdate: null as any,
          dmvpacketsentstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveDMV(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveDMV(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveDMV(obj);
        }
      } else {
        let obj = {
          dmvpacketsentdate: TrackData[0],
          dmvpacketsentstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveDMV(obj);
        } else {
          this.saveDMV(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Plates Received ////////////////////
    if (this.selectedTrackingStep == 'Plates Received') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let prCheck: any = '';
      if (TrackData == undefined) {
        prCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          prCheck = true;
        } else {
          prCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (prCheck == true) {
        let obj = {
          platesreceiveddate: null as any,
          platesreceivednumber: null as any,
          platesreceivedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.savePlatesRec(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.savePlatesRec(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.savePlatesRec(obj);
        }
      } else {
        let obj = {
          platesreceiveddate: TrackData[0],
          platesreceivednumber: TrackData[1],
          platesreceivedstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.savePlatesRec(obj);
        } else {
          this.savePlatesRec(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Digital Scan Completed ////////////////////
    if (this.selectedTrackingStep == 'Digital Scan Complete') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let dscCheck: any = '';
      if (TrackData == undefined) {
        dscCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          dscCheck = true;
        } else {
          dscCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (dscCheck == true) {
        let obj = {
          digitalscancompletedate: null as any,
          digitalscancompletestatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveDigital(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveDigital(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveDigital(obj);
        }
      } else {
        let obj = {
          digitalscancompletedate: TrackData[0],
          digitalscancompletestatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveDigital(obj);
        } else {
          this.saveDigital(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    /////////////// Mailed to Customer ////////////////////
    if (this.selectedTrackingStep == 'Mailed to Customer') {
      // // // // // // // // // alert(this.selectedTrackingStep);
      // // console.log(this.textarea);
      // // console.log(TrackData);
      let mtcCheck: any = '';
      if (TrackData == undefined) {
        mtcCheck = true;
      } else {
        if (
          TrackData[0] == '' ||
          TrackData[0] == '0001-01-01' ||
          TrackData[0] == null
        ) {
          mtcCheck = true;
        } else {
          mtcCheck = false;
        }
      }
      // // // // // // // // // alert(pdiCheck);
      if (mtcCheck == true) {
        let obj = {
          mailedtocustomerdate: null as any,
          mailedtocustomerstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        console.log('true', obj);
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Mark As Completed
          if (this.statusCheck == 'Y') {
            this.saveMailed(obj);
          } else {
            if (this.mStatus == 'N') {
              alertify.error('All Fields Required.').dismissOthers();
            } else {
              if (this.mStatus == 'Y') {
                this.saveMailed(obj);
              }
            }
          }

          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          //Notes
        } else {
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
          this.saveMailed(obj);
        }
      } else {
        let obj = {
          mailedtocustomerdate: TrackData[0],
          mailedtocustomerstatus: this.mStatus,
          dealno: DNo,
          coraAcctId: CID,
        };
        console.log('else : ', obj);
        if (
          this.textarea == '' ||
          this.textarea == null ||
          this.textarea == undefined
        ) {
          //Notes
          if (this.notedesc != '') {
            this.closeNotes(this.notedesc);
          }
          this.saveMailed(obj);
        } else {
          this.saveMailed(obj);
          if (this.notedesc == '') {
            this.savenotes();
          } else {
            this.editnotes(this.notedesc);
          }
        }
      }
    }

    console.log('Array', this.LastArray);
  }

  //////////////////////////////////////////// nOTESModel //////////////////////////////////////////

  addpop(data: any) {
    // // // console.log(data.nTitle);
    // // // console.log(this.LastArray);
    for (let i = 0; i < this.LastArray.length; i++) {
      if (data == this.LastArray[i].MHead) {
        this.singleCartClick(this.LastArray[i]);
      }
    }
    // this.textarea = this.stepsForm.controls["textarea"].setValue(data.nDescription);
    // this.textarea=data.nDescription
  }

  // NOTES SAVE FUNCTION...
  savenotes() {
    // this.add=true;
    // this.edit=false;
    const obj = {
      nId: 0,
      nDealno: this.dealId.toString(),
      nTitle: this.selectedTrackingStep,
      nDescription: this.textarea,
      nStatus: 'Y',
      nCts: this.date,
      nCuid: this.userid,
      nUts: this.date,
      nUid: 0,
    };
    // // console.log(obj);
    this.progresservice.addnote(obj).subscribe((data: any) => {
      // // console.log("abc", data);
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      // this.DealNoWithCoraId();
      // this.ViewNotes();
      this.clearAll();
      this.NotesData = [];
      alertify.success('Notes Added.').dismissOthers();
    });
  }

  // NOTES CLOSE FUNCTION...
  closeNotes(note: any) {
    // // console.log(note);
    const obj = {
      nId: note.nId,
      nDealno: note.nDealno,
      nTitle: note.nTitle,
      nDescription: note.nDescription,
      nStatus: 'D',
      nCts: note.nCts,
      nCuid: 0,
      nUts: note.nUts,
      nUid: 0,
    };
    this.progresservice.addnote(obj).subscribe((data: any) => {
      // // console.log(data);
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      this.clearAll();
      this.NotesData = [];
      alertify.success('Notes Removed').dismissOthers();
      this.DealNoWithCoraId();
      this.notedesc = '';
    });
  }

  // EDIT NOTES FUNCTION...
  editnotes(notes: any) {
    const obj = {
      nId: notes.nId,
      nDealno: notes.nDealno,
      nTitle: notes.nTitle,
      nDescription: this.textarea,
      nStatus: 'Y',
      nCts: this.date,
      nCuid: this.notedesc.nCuid,
      nUts: this.date,
      nUid: this.userid,
    };
    // // console.log(obj);
    this.progresservice.addnote(obj).subscribe((data: any) => {
      // // console.log("abc", data);
      this.DealIdValue = true;
      localStorage.setItem('progresstodeal', JSON.stringify(this.DealIdValue));
      this.closemd.nativeElement.click();
      this.stepsForm.reset();
      this.clearAll();
      alertify.success('Notes Updated').dismissOthers();
      this.DealNoWithCoraId();
      this.notedesc = '';
    });
  }

  // CLICK STATUS 'N' OR 'Y' FUNCTION...
  AllStatusComplete(value: any) {
    if (value == 'Y') {
      alertify.confirm(
        'Confirmation...!',
        'Do you want to close this deal.',
        () => {
          const obj = {
            dealno: this.dealId.toString(),
            coraAcctId: this.CoraAcctId,
            status: 'Y',
          };
          // // // console .log(obj);
          this.progresservice.AllStatus(obj).subscribe((res: any) => {
            this.DealIdValue = true;
            localStorage.setItem(
              'progresstodeal',
              JSON.stringify(this.DealIdValue)
            );
            // // // console .log(res);
            this.DealNoWithCoraId();
            this.clearAll();
          });
        },
        this.DealNoWithCoraId()
      )
        .set({
          transition: 'zoom',
          movable: false,
          closable: false,
          labels: { ok: 'Yes', cancel: 'No' },
        });
    }

    if (value == 'N') {
      alertify.confirm(
        'Confirmation...!',
        'Do you want to open this deal.',
        () => {
          const obj = {
            dealno: this.dealId.toString(),
            coraAcctId: this.CoraAcctId,
            status: 'N',
          };
          // // // console .log(obj);
          this.progresservice.AllStatus(obj).subscribe((res: any) => {
            console.log('dealopenresponse = ', res);
            this.DealIdValue = true;
            localStorage.setItem(
              'progresstodeal',
              JSON.stringify(this.DealIdValue)
            );
            // this.DealNoWithCoraId();
            this.clearAll();
          });
          console.log(this.LastArray);
          this.statusOfStep = true;
          this.cartClick = false;
          const lastStep = this.LastArray[this.LastArray.length - 1];
          this.singleStepDetails(lastStep);
        },
        function () { }
      )
        .set({
          transition: 'zoom',
          movable: false,
          closable: false,
          labels: { ok: 'Yes', cancel: 'No' },
        });
    }
  }

  // NAVIGATE DEALLOG PAGE...
  deallogpage() {
    this.router.navigate(['/deallog']);
    this.DealIdValue = true;
  }
}
