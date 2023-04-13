import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from '../core/_services/header/header.service';
import { StoreService } from '../core/_services/store/store.service';
import { SettingsService } from '../core/_services/settings.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DeallogService } from '../core/_services/deallog/deallog.service';
declare var alertify: any;

@Component({
  selector: 'app-storesetup',
  templateUrl: './storesetup.component.html',
  styleUrls: ['./storesetup.component.scss']
})
export class StoresetupComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;

  settingsData: any = [];
  selectedStores: any[] = [];
  getStores: any;
  CoraAccId: any;
  Uid: any;
  token: any;
  sqImage1!: boolean;
  sqImage2!: boolean;
  dpImage1!: boolean;
  dpImage2!: boolean;
  nfImage1!: boolean;
  nfImage2!: boolean;
  dropdownSettings: IDropdownSettings = {};
  nf!: boolean
  NotifyImage1!: boolean;
  NotifyImage2!: boolean;
  toggleButton!: boolean;
  withinButton!: boolean;
  sequenceValues: any = [];
  gridnotifications: any = [];
  roles: any = [];
  selectedNotifications: any = [];
  notifications: any = [];
  ids: any = [];
  selectedItems: any = [];
  rowData: any;
  notifySave: any = [];
  notifyHide!: boolean;
  notifyRowData: any;
  popupData: any;
  id: any;
  patchdata: any;
  floringdata: any;
  floringdata2: any;
  patchdata2: any;
  citcreatedata: any;
  patchdata3: any;
  weOwedata: any;
  patchdata4: any;
  floringoff: any;
  storessid: any;
  sample: any;
  storeid: any;
  onlyid: any;
  storename: any;
  constructor(private storeService: StoreService, private fb: FormBuilder,
    private service: SettingsService,
    private router: Router,
    private headerService: HeaderService, private spinner: NgxSpinnerService,
    private deallogservice: DeallogService) { }

  popupForm = this.fb.group({
    InputNew: [''],
    InputUsed: [''],
    InputAccountnumber: [''],
  });

  ngOnInit(): void {
    alertify.set('notifier', 'position', 'bottom-right');
    this.nf = false;
    this.sqImage1 = true;
    this.dpImage1 = true;
    this.nfImage1 = true;
    this.NotifyImage1 = true;
    this.token = localStorage.getItem("UserToken");
    this.Uid = localStorage.getItem("UserId");
    this.storessid = localStorage.getItem('dropstoreid');
    this.toggleButton = true;
    this.withinButton = true;
    let dummy = localStorage.getItem('storeSetupid');
    console.log(dummy);
    if (dummy == null || dummy == 'stores') {
      this.CoraAccId = '0';
    }
    else {
      this.CoraAccId = dummy;
    }
    this.getGridData();
    console.log(this.CoraAccId);
  }
  ngAfterViewInit() {
    this.headerService.setHideFilter('Y');
    this.headerService.setactiveFilter('N');
    this.deallogservice.getStore().subscribe((res: any) => {
      console.log(res);
      this.onlyid = res;
      if (res.val == 1) {
        if (res.store == 'stores') {
          this.CoraAccId = '0';
          this.getGridData();
        } else {
          this.CoraAccId = this.onlyid.store.toString();
          this.getGridData();
        }
      }
      this.storename = localStorage.getItem('selectstorename');
      if (this.storename == null) {
        this.storename = 'All Stores'
      }
    });
  }

  /*-------------------- Get Store Settings------------*/
  getGridData() {
    console.log(this.CoraAccId);
    this.getStores = [];
    this.spinner.show();
    this.roles = [];
    console.log(this.CoraAccId);
    if (this.CoraAccId == 'All Stores') {
      this.CoraAccId = 0;
    }
    this.storeService.getStoreSettings(this.CoraAccId).subscribe(data => {
      this.getStores = data;
      console.log(data);
      if (this.getStores[0].sId == 0) {
        for (let i = 0; i < this.getStores.length; i++) {
          this.getStores[i].sSequence = i + 1;
          if (this.getStores[i].sWithin == null) {
            this.getStores[i].sWithin = 0;
          }
        }
      }
      this.service.getAllRolls(this.token).subscribe((data: any) => {
        this.roles = data;
        this.dropdownSettings = {            //Multi Selector Settings
          singleSelection: false,
          idField: 'rId',
          textField: 'rName',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          allowSearchFilter: true,
          showSelectedItemsAtTop: true,
        };
        this.getStores.forEach((element1: any) => {
          if (element1.sWithin == null) {
            element1.sWithin = 0;
          }
          let a = element1.sNotifications;
          let splitted = a.split(",");
          this.gridnotifications = [];
          this.roles.forEach((e2: any) => {
            for (let i = 0; i < splitted.length; i++) {
              if (splitted[i] == e2.rId) {
                this.gridnotifications.push(e2.rName);
                element1.name = this.gridnotifications.toString();
              }
            }
            this.spinner.hide();
          })
        });
      })
      this.getStores.sort((a: any, b: any) => (a.sSequence > b.sSequence) ? 1 : -1);
      let cora = 0;
      this.storeService.getStoreSettings(cora).subscribe(data => {
        // // // // console.log("Data", data);
        this.settingsData = data;
        if (this.getStores.length != this.settingsData.length) {
          // // // // console.log("true");
          this.settingsData.map((ob: any) => {
            const index = this.getStores.findIndex((a: any) => a.sTrackingsteps === ob.sTrackingsteps);
            if (index === -1) {
              // // // // console.log(ob);
              this.getStores.push(ob);
            }
            else {
            }
          });
        }
        else {
        }
      })
    });
  }

  /* ---------------INCLUDE CHANGE----------*/

  includeChnage(event: any, data: any) {
    let obj: any;
    const isAllZero = this.getStores.filter((zero: any) => zero.sId == 0);
    let checkboxValue;
    if (event.target.checked == false) {
      checkboxValue = "N";
    }
    else if (event.target.checked == true) {
      checkboxValue = "Y";
    }
    data.sInclude = checkboxValue;
    // // // // console.log(this.getStores);
    if (isAllZero.length > 0) {
      let id = 0;
      for (let i = 0; i < this.getStores.length; i++) {
        id++
        if (this.getStores[i].sDependencies == null) {
          this.getStores[i].sDependencies = "";
        }
        if (this.getStores[i].sNotifications == null) {
          this.getStores[i].sNotifications = "";
        }
        if (this.getStores[i].sWithin == null) {
          this.getStores[i].sWithin = 0;
        }
        if (this.getStores[i].sInputAccountnumber == null) {
          this.getStores[i].sInputAccountnumber = "";
        }
        if (this.getStores[i].sInputNew == null) {
          this.getStores[i].sInputNew = "";
        }
        if (this.getStores[i].sInputUsed == null) {
          this.getStores[i].sInputUsed = "";
        }
        if (this.getStores[i].sId == 0) {
          obj = {
            "action": "A",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": i + 1,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }
        else {
          obj = {
            "action": "U",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": i + 1,
            "sCreatedBy": 0,
            "sUpdatedBy": JSON.parse(this.Uid),
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }

        this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
          // // // // console.log(data);
          if (id == this.getStores.length) {
            alertify.success("Include Updated successfully").dismissOthers();
            this.getGridData();
          }
        })
      }
    }
    else {
      obj = {
        "action": "U",
        "ssId": data.sId,
        "ssCoraAcctId": data.sCoraAcctId,
        "ssTrackingstepId": data.sTrackingsetpId,
        "ssInclude": checkboxValue,
        "ssSequence": data.sSequence,
        "sCreatedBy": 0,
        "sUpdatedBy": JSON.parse(this.Uid),
        "ssType": data.sType,
        "sDependencies": data.sDependencies,
        "sNotifications": data.sNotifications,
        "sWithIn": data.sWithin,
        "sInputNew": data.sInputNew,
        "sInputUsed": data.sInputUsed,
        "sInputAccountnumber": data.sInputAccountnumber
      }
      this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
        // // // // console.log(data);
        alertify.success("Include Updated successfully").dismissOthers()
        this.getGridData();
      })
    }
  }

  /*--------------TYPE CHANGE------------*/
  typeChange(event: any, data: any) {
    const isAllZero = this.getStores.filter((zero: any) => zero.sId == 0);
    data.sType = event.target.value;
    if (isAllZero.length > 0) {
      let id = 0;
      let obj;
      for (let i = 0; i < this.getStores.length; i++) {
        id++
        if (this.getStores[i].sDependencies == null) {
          this.getStores[i].sDependencies = "";
        }
        if (this.getStores[i].sNotifications == null) {
          this.getStores[i].sNotifications = "";
        }
        if (this.getStores[i].sWithin == null) {
          this.getStores[i].sWithin = 0;
        }
        if (this.getStores[i].sInputAccountnumber == null) {
          this.getStores[i].sInputAccountnumber = "";
        }
        if (this.getStores[i].sInputNew == null) {
          this.getStores[i].sInputNew = "";
        }
        if (this.getStores[i].sInputUsed == null) {
          this.getStores[i].sInputUsed = "";
        }
        if (this.getStores[i].sId == 0) {
          obj = {
            "action": "A",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": i + 1,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }
        else {
          obj = {
            "action": "U",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": i + 1,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }
        this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
          if (id == this.getStores.length) {
            alertify.success("Type Updated successfully").dismissOthers()
            this.getGridData();
          }
        })
      }
    }
    else {
      let obj = {
        "action": "U",
        "ssId": data.sId,
        "ssCoraAcctId": data.sCoraAcctId,
        "ssTrackingstepId": data.sTrackingsetpId,
        "ssInclude": data.sInclude,
        "ssSequence": data.sSequence,
        "sCreatedBy": 0,
        "sUpdatedBy": this.Uid,
        "ssType": event.target.value,
        "sDependencies": data.sDependencies,
        "sNotifications": data.sNotifications,
        "sWithIn": data.sWithin,
        "sInputNew": data.sInputNew,
        "sInputUsed": data.sInputUsed,
        "sInputAccountnumber": data.sInputAccountnumber
      }
      this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
        alertify.success("Type Updated successfully").dismissOthers()
        this.getGridData();
      })
    }
  }

  /*----------SEQUENCE CHANGE-----------*/

  editSequence() {
    this.toggleButton = false;
    this.sqImage1 = false;
    this.sqImage2 = true;
  }

  changeSequence(data: any, id: any) {
    // // // // console.log(data);
    // // // // console.log(id.target.value);
    if (id.target.value <= 0 || id.target.value > this.getStores.length) {
      alertify.alert("Please Provide valid sequence Number")
    }
    else {
      const index = this.sequenceValues.findIndex((a: any) => a.sSequence === JSON.parse(id.target.value));
      // // // // console.log(index);
      if (index == -1) {
        data.sSequence = JSON.parse(id.target.value);
        if (this.sequenceValues.length == 0) {
          this.sequenceValues.push(data);
        }
        else {
          const index = this.sequenceValues.findIndex((a: any) => a.sTrackingsteps === data.sTrackingsteps);
          // // // // console.log(index);
          if (index == -1) {
            this.sequenceValues.push(data);
          }
        }
      }
      else {
        alertify.alert("Duplicates are not allowed");
      }
    }
  }

  saveSequence() {
    let Obj: any;
    // // // // console.log(this.sequenceValues);
    // // // // console.log(this.getStores);
    const isAllZero = this.getStores.filter((zero: any) => zero.sId == 0);
    const uniqueValues = new Set(this.getStores.map((a: any) => a.sSequence));
    if (uniqueValues.size < this.getStores.length) {
      alertify.alert('duplicates found').dismissOthers()
      this.sqImage1 = false;
      this.sqImage2 = true;
      this.toggleButton = false;
    }
    else
      if (isAllZero.length > 0) {
        let id = 0;
        for (let i = 0; i < this.getStores.length; i++) {
          if (this.getStores[i].sDependencies == null) {
            this.getStores[i].sDependencies = "";
          }
          if (this.getStores[i].sNotifications == null) {
            this.getStores[i].sNotifications = "";
          }
          if (this.getStores[i].sWithin == null) {
            this.getStores[i].sWithin = 0;
          }
          if (this.getStores[i].sInputAccountnumber == null) {
            this.getStores[i].sInputAccountnumber = "";
          }
          if (this.getStores[i].sInputNew == null) {
            this.getStores[i].sInputNew = "";
          }
          if (this.getStores[i].sInputUsed == null) {
            this.getStores[i].sInputUsed = "";
          }
          id++
          if (this.getStores[i].sId == 0) {
            Obj = {
              "action": "A",
              "ssId": this.getStores[i].sId,
              "ssCoraAcctId": this.CoraAccId,
              "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
              "ssInclude": this.getStores[i].sInclude,
              "ssSequence": this.getStores[i].sSequence,
              "sCreatedBy": this.Uid,
              "sUpdatedBy": this.Uid,
              "ssType": this.getStores[i].sType,
              "sDependencies": this.getStores[i].sDependencies,
              "sNotifications": this.getStores[i].sNotifications,
              "sWithIn": this.getStores[i].sWithin,
              "sInputNew": this.getStores[i].sInputNew,
              "sInputUsed": this.getStores[i].sInputUsed,
              "sInputAccountnumber": this.getStores[i].sInputAccountnumber
            }
          }
          else {
            Obj = {
              "action": "U",
              "ssId": this.getStores[i].sId,
              "ssCoraAcctId": this.CoraAccId,
              "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
              "ssInclude": this.getStores[i].sInclude,
              "ssSequence": this.getStores[i].sSequence,
              "sCreatedBy": this.Uid,
              "sUpdatedBy": this.Uid,
              "ssType": this.getStores[i].sType,
              "sDependencies": this.getStores[i].sDependencies,
              "sNotifications": this.getStores[i].sNotifications,
              "sWithIn": this.getStores[i].sWithin,
              "sInputNew": this.getStores[i].sInputNew,
              "sInputUsed": this.getStores[i].sInputUsed,
              "sInputAccountnumber": this.getStores[i].sInputAccountnumber
            }
          }

          this.storeService.saveStoreSetup(Obj, this.token).subscribe(data => {
            // // // // console.log("Done ", data);
            if (id == this.getStores.length) {
              alertify.success("Sequence updated Successfully").dismissOthers()
              this.getGridData();
              // this.getPopupData();
              this.sqImage1 = true;
              this.sqImage2 = false;
              this.toggleButton = true;
              this.sequenceValues = [];
            }
          })
        }

      }
      else {
        // alert("else")
        let id = 0;
        // // // // console.log(this.getStores);
        for (let i = 0; i < this.getStores.length; i++) {
          if (this.getStores[i].sDependencies == null) {
            this.getStores[i].sDependencies = "";
          }
          if (this.getStores[i].sNotifications == null) {
            this.getStores[i].sNotifications = "";
          }
          if (this.getStores[i].sWithin == null) {
            this.getStores[i].sWithin = 0;
          }
          if (this.getStores[i].sInputAccountnumber == null) {
            this.getStores[i].sInputAccountnumber = "";
          }
          if (this.getStores[i].sInputNew == null) {
            this.getStores[i].sInputNew = "";
          }
          if (this.getStores[i].sInputUsed == null) {
            this.getStores[i].sInputUsed = "";
          }
          id++
          let Obj = {
            "action": "U",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.getStores[i].sCoraAcctId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": this.getStores[i].sSequence,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
          this.storeService.saveStoreSetup(Obj, this.token).subscribe(data => {
            if (id == this.getStores.length) {
              alertify.success("Sequence Saved Successfully")
              this.getGridData();
              // this.getPopupData();
              this.sqImage1 = true;
              this.sqImage2 = false;
              this.toggleButton = true;
              this.sequenceValues = [];
            }
          })
        }

      }
  }

  cancelSequence() {
    this.toggleButton = true;
    this.sqImage1 = true;
    this.sqImage2 = false;
  }




  /* ----------UPDATE dEPENDECIES-----------*/

  dependenciesChange(event: any, data: any) {
    const isAllZero = this.getStores.filter((zero: any) => zero.sId == 0);
    let obj;
    data.sDependencies = event.target.value;
    if (isAllZero.length > 0) {
      let id = 0;
      for (let i = 0; i < this.getStores.length; i++) {
        id++
        if (this.getStores[i].sDependencies == null) {
          this.getStores[i].sDependencies = "";
        }
        if (this.getStores[i].sNotifications == null) {
          this.getStores[i].sNotifications = "";
        }
        if (this.getStores[i].sWithin == null) {
          this.getStores[i].sWithin = 0;
        }
        if (this.getStores[i].sInputAccountnumber == null) {
          this.getStores[i].sInputAccountnumber = "";
        }
        if (this.getStores[i].sInputNew == null) {
          this.getStores[i].sInputNew = "";
        }
        if (this.getStores[i].sInputUsed == null) {
          this.getStores[i].sInputUsed = "";
        }
        if (this.getStores[i].sId == 0) {
          obj = {
            "action": "A",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": i + 1,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }
        else {
          obj = {
            "action": "U",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": i + 1,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }

        this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
          if (id == this.getStores.length) {
            alertify.success("Dependencies Updated successfully")
            this.getGridData();
          }
        })
      }

    }
    else {
      let obj = {
        "action": "U",
        "ssId": data.sId,
        "ssCoraAcctId": data.sCoraAcctId,
        "ssTrackingstepId": data.sTrackingsetpId,
        "ssInclude": data.sInclude,
        "ssSequence": data.sSequence,
        "sCreatedBy": 0,
        "sUpdatedBy": this.Uid,
        "ssType": data.sType,
        "sDependencies": event.target.value,
        "sNotifications": data.sNotifications,
        "sWithIn": data.sWithin,
        "sInputNew": data.sInputNew,
        "sInputUsed": data.sInputUsed,
        "sInputAccountnumber": data.sInputAccountnumber
      }
      this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
        alertify.success("Dependencies Updated successfully")
        this.getGridData();
      })
    }
  }

  /* -------------UPDATE NOTIFICATIONS-------------*/
  editnotifications(i: any) {
    this.notifications = []
    this.rowData = i;
    // // // // console.log(this.rowData);
    this.nf = true;
    this.nfImage1 = false;
    this.nfImage2 = true;
    let a = this.rowData.sNotifications;
    let splitted = a.split(",");
    // // // // console.log(splitted);
    this.selectedNotifications = [];
    this.roles.forEach((e2: any) => {
      for (let i = 0; i < splitted.length; i++) {
        if (splitted[i] == e2.rId) {
          this.selectedNotifications.push(e2);
          // // // // console.log(this.selectedNotifications);
        }
      }
      this.notifications = this.selectedNotifications;
    });
  }

  onItemSelect(item: any, data: any) {
    this.notifications.push(item);
    this.rowData = data;
  }
  onDeSelect(item: any, data: any) {
    // // // // console.log(item);
    this.rowData = data;
    for (let i = 0; i < this.notifications.length; i++) {
      if (item.rId == this.notifications[i].rId) {
        this.notifications.splice(i, 1)
      }
    }

  }
  onDeSelectAll(items: any, data: any) {
    this.notifications = items;
    this.rowData = data;
    // // // // console.log(this.notifications);
    // // // // console.log(this.rowData);
  }
  onSelectAll(items: any, data: any) {
    this.notifications = items;
    this.rowData = data;
    // // // // console.log(this.notifications);
    // // // // console.log(this.rowData);
  }
  savenotifications() {
    let obj;
    for (let i = 0; i < this.notifications.length; i++) {
      this.selectedItems.push(this.notifications[i].rId);
      this.ids = this.selectedItems.join(',');
    }
    const isAllZero = this.getStores.filter((zero: any) => zero.sId == 0);
    if (isAllZero.length > 0) {
      let id = 0;
      this.rowData.sNotifications = this.ids;
      // // // // console.log(this.getStores);
      for (let i = 0; i < this.getStores.length; i++) {
        id++
        if (this.getStores[i].sDependencies == null) {
          this.getStores[i].sDependencies = "";
        }
        if (this.getStores[i].sNotifications == null) {
          this.getStores[i].sNotifications = "";
        }
        if (this.getStores[i].sWithin == null) {
          this.getStores[i].sWithin = 0;
        }
        if (this.getStores[i].sInputAccountnumber == null) {
          this.getStores[i].sInputAccountnumber = "";
        }
        if (this.getStores[i].sInputNew == null) {
          this.getStores[i].sInputNew = "";
        }
        if (this.getStores[i].sInputUsed == null) {
          this.getStores[i].sInputUsed = "";
        }
        if (this.getStores[i].sId == 0) {
          obj = {
            "action": "A",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": this.getStores[i].sSequence,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }
        else {
          obj = {
            "action": "U",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": this.getStores[i].sSequence,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }
        this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
          if (id == this.getStores.length) {
            alertify.success("Notifications Updated successfully")
            this.getGridData();
            this.selectedItems = []
            this.nf = false;
            this.nfImage1 = true;
            this.nfImage2 = false;
          }
        })
      }
    }
    else {
      let obj = {
        "action": "U",
        "ssId": this.rowData.sId,
        "ssCoraAcctId": this.rowData.sCoraAcctId,
        "ssTrackingstepId": this.rowData.sTrackingsetpId,
        "ssInclude": this.rowData.sInclude,
        "ssSequence": this.rowData.sSequence,
        "sCreatedBy": 0,
        "sUpdatedBy": this.Uid,
        "ssType": this.rowData.sType,
        "sDependencies": this.rowData.sDependencies,
        "sNotifications": this.ids,
        "sWithIn": this.rowData.sWithin,
        "sInputNew": this.rowData.sInputNew,
        "sInputUsed": this.rowData.sInputUsed,
        "sInputAccountnumber": this.rowData.sInputAccountnumber
      }
      this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
        alertify.success("Notifications Updated successfully")
        this.getGridData();
        this.selectedItems = []
        this.nf = false;
        this.nfImage1 = true;
        this.nfImage2 = false;
      })
    }
  }

  cancelnotifications() {
    this.nf = false;
    this.nfImage1 = true;
    this.nfImage2 = false;
  }

  /*-----------UPDATE Notify------------- */
  editNotify(data: any) {
    this.notifyRowData = data;
    this.withinButton = false;
    this.NotifyImage1 = false;
    this.NotifyImage2 = true;
  }
  changeNotify(event: any) {
    this.notifyRowData.sWithin = event.target.value;
  }

  saveNotify() {
    let obj;
    const isAllZero = this.getStores.filter((zero: any) => zero.sId == 0);
    if (isAllZero.length > 0) {
      let id = 0;
      for (let i = 0; i < this.getStores.length; i++) {
        id++
        if (this.getStores[i].sDependencies == null) {
          this.getStores[i].sDependencies = "";
        }
        if (this.getStores[i].sNotifications == null) {
          this.getStores[i].sNotifications = "";
        }
        if (this.getStores[i].sWithin == null) {
          this.getStores[i].sWithin = 0;
        }
        if (this.getStores[i].sInputAccountnumber == null) {
          this.getStores[i].sInputAccountnumber = "";
        }
        if (this.getStores[i].sInputNew == null) {
          this.getStores[i].sInputNew = "";
        }
        if (this.getStores[i].sInputUsed == null) {
          this.getStores[i].sInputUsed = "";
        }
        if (this.getStores[i].sId == 0) {
          obj = {
            "action": "A",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": this.getStores[i].sSequence,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }
        else {
          obj = {
            "action": "U",
            "ssId": this.getStores[i].sId,
            "ssCoraAcctId": this.CoraAccId,
            "ssTrackingstepId": this.getStores[i].sTrackingsetpId,
            "ssInclude": this.getStores[i].sInclude,
            "ssSequence": this.getStores[i].sSequence,
            "sCreatedBy": this.Uid,
            "sUpdatedBy": this.Uid,
            "ssType": this.getStores[i].sType,
            "sDependencies": this.getStores[i].sDependencies,
            "sNotifications": this.getStores[i].sNotifications,
            "sWithIn": this.getStores[i].sWithin,
            "sInputNew": this.getStores[i].sInputNew,
            "sInputUsed": this.getStores[i].sInputUsed,
            "sInputAccountnumber": this.getStores[i].sInputAccountnumber
          }
        }

        this.storeService.saveStoreSetup(obj, this.token).subscribe((data: any) => {
          if (id == this.getStores.length) {
            alertify.success("Notify Updated successfully")
            this.getGridData();
            // this.getPopupData();
            this.NotifyImage1 = true;
            this.NotifyImage2 = false;
            this.withinButton = true;
            this.sequenceValues = [];
          }
        })
      }
    }
    else {
      if (this.notifyRowData.sDependencies == null) {
        this.notifyRowData.sDependencies = "";
      }
      if (this.notifyRowData.sNotifications == null) {
        this.notifyRowData.sNotifications = "";
      }
      if (this.notifyRowData.sWithin == null) {
        this.notifyRowData.sWithin = 0;
      }
      if (this.notifyRowData.sInputAccountnumber == null) {
        this.notifyRowData.sInputAccountnumber = "";
      }
      if (this.notifyRowData.sInputNew == null) {
        this.notifyRowData.sInputNew = "";
      }
      if (this.notifyRowData.sInputUsed == null) {
        this.notifyRowData.sInputUsed = "";
      }
      let Obj = {
        "action": "U",
        "ssId": this.notifyRowData.sId,
        "ssCoraAcctId": this.notifyRowData.sCoraAcctId,
        "ssTrackingstepId": this.notifyRowData.sTrackingsetpId,
        "ssInclude": this.notifyRowData.sInclude,
        "ssSequence": this.notifyRowData.sSequence,
        "ssType": this.notifyRowData.sType,
        "sCreatedBy": 0,
        "sUpdatedBy": this.Uid,
        "sDependencies": this.notifyRowData.sDependencies,
        "sNotifications": this.notifyRowData.sNotifications,
        "sWithIn": JSON.parse(this.notifyRowData.sWithin),
        "sInputNew": this.notifyRowData.sInputNew,
        "sInputUsed": this.notifyRowData.sInputUsed,
        "sInputAccountnumber": this.notifyRowData.sInputAccountnumber

      }
      this.storeService.saveStoreSetup(Obj, this.token).subscribe(data => {
        this.getGridData();
        this.NotifyImage1 = true;
        this.NotifyImage2 = false;
        this.withinButton = true;
        this.sequenceValues = [];
        alertify.success("Notify Updated successfully")
      })
    }

  }

  cancelNotify() {
    this.withinButton = true;
    this.NotifyImage1 = true;
    this.NotifyImage2 = false;
  }
  /*-----------------Navigate to Deallog----------*/
  deallogpage() {
    this.router.navigate(['/deallog']);
  }

}
