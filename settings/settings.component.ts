import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { SettingsService } from '../core/_services/settings.service';
import { HeaderService } from '../core/_services/header/header.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { trigger } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
declare let alertify: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  settingCoraId!: number;
  settingData: any = [];
  authToken: any;
  roles: any = [];
  save!: boolean;
  submit!: boolean;
  editdata: any;
  formSubmitted = false;
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {};
  ids!: string;
  gridnotifications: any = [];
  editNotification: any = [];
  setSetting: any = [];
  inBox = 0;
  inputboxes: any = [];
  inputValues: any = [];
  addinputs!: string;
  inputs!: FormArray;
  stepsData: any;
  dpValue: any;
  addSplit: any;
  token: any;
  userId: any;
  TotalData: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private service: SettingsService,
    private headservice: HeaderService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }
  settingForm = this.formBuilder.group({
    trackingSteps: ['', Validators.required],
    internalSteps: this.formBuilder.array([]),
    dependencies: ['', Validators.required],
    notifications: [''],
    within: [''],
    type: ['', Validators.required],
    sequence: [''],
    status: ['']
  })

  ngOnInit(): void {
    alertify.set('notifier', 'position', 'top-right');
    this.getSettings();
    this.userId = localStorage.getItem('UserId');
  }

  /* --------Get Settings---------*/
  getSettings() {
    this.headservice.setHideFilter('N');
    this.headservice.setactiveFilter('N');
    this.spinner.show();
    let token = localStorage.getItem('UserToken');
    this.service.getSettings(token).subscribe((data: any) => {
      // //console.log(data);
      this.settingData = data;
      this.settingData.sort(
        (a: any, b: any) => a.sSequence - b.sSequence
      );
      console.log("settingdata", this.settingData);
      this.service.getAllRolls(token).subscribe((data: any) => {
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

        this.settingData.forEach((element1: any) => {
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
          })
        });
      })
      this.spinner.hide();
    });
  }

  /* --------Add Settings---------*/
  get internalSteps() {
    return this.settingForm.get('internalSteps') as FormArray;
  }

  Inputadd() {
    this.internalSteps.push(this.formBuilder.control(''));
  }

  Inputremove(i: any) {
    this.internalSteps.removeAt(i);
  }

  removeNull = (arrayToClean: any) => {
    const cleanedArray: any[] = [];
    arrayToClean.forEach((val: any) => {
      if (val !== null && typeof val !== "undefined" && ("" + val).trim() !== "") {
        cleanedArray.push(val);
      }
    });
    return cleanedArray;
  }

  add() {
    this.save = false;
    this.submit = true;
    this.settingForm.reset();
    this.internalSteps.reset();
    this.settingForm.get('status')?.patchValue('Y');
    this.ids = '';
  }

  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }

  addSetting() {
    let obj: any;
    console.log(this.settingForm);
    if (this.submit == true) {
      if (this.settingForm.invalid) {
        this.formSubmitted = true;
      }
      else {
        this.selectedItems = [];
        try {
          for (let i = 0; i < this.settingForm.value.notifications.length; i++) {
            this.selectedItems.push(this.settingForm.value.notifications[i].rId);
            // //console.log("Selected Items",this.selectedItems);
            this.ids = this.selectedItems.join(',')
            // //console.log("IDs",this.ids);
          }
        }
        catch (error) {
          //console.log("CatchError",null);
        }
        this.formSubmitted = false;
        // //console.log("What", this.internalSteps.length)
        if (this.internalSteps.length == 0) {
          this.stepsData = this.internalSteps.value;

        } else {
          this.addSplit = this.settingForm.value.internalSteps.toString();
          // //console.log(this.addSplit);
          this.stepsData = this.addSplit.split(",");
          // //console.log(this.stepsData);
          this.stepsData = this.removeNull(this.stepsData)
          // //console.log("Hello", this.stepsData.length);
          if (this.stepsData.length == 0) {
            this.stepsData = this.stepsData;
          } else {
            this.stepsData = this.stepsData;
          }
          // //console.log(this.stepsData)
        }
        if (this.settingForm.value.dependencies == null) {
          this.settingForm.value.dependencies = ""
        }
        if (this.settingForm.value.dependencies == "N") {
          this.settingForm.value.dependencies = ""
        }
        if (this.settingForm.value.within == null) {
          this.settingForm.value.within = 0
        }

        if (this.settingForm.value.notifications == null) {
          this.settingForm.value.notifications = ""
        }
        if (this.ids == null) {
          this.ids = "";
        } else {
          this.ids = this.ids
        }
        console.log(this.settingForm.value.sequence);

        if (this.settingForm.value.sequence == null) {
          this.settingForm.value.sequence = this.settingData.length + 1
        }
        obj = {
          "action": "A",
          "sId": 0,
          "sTrackingsteps": this.settingForm.value.trackingSteps,
          "sInternalsteps": this.stepsData.join(','),
          "sDependencies": this.settingForm.value.dependencies,
          "sNotifications": this.ids,
          "sWithin": this.settingForm.value.within,
          "sType": this.settingForm.value.type,
          "sStatus": this.settingForm.value.status,
          "sCreatedBy": JSON.parse(this.userId),
          "sUpdatedBy": JSON.parse(this.userId),
          "sSequence": this.settingForm.value.sequence
        }
      }
    }
    console.log(obj);
    //console.log(this.settingForm.value.notifications);
    if (this.save == true) {
      this.selectedItems = [];
      for (let i = 0; i < this.settingForm.value.notifications.length; i++) {
        this.selectedItems.push(this.settingForm.value.notifications[i].rId);

        this.ids = this.selectedItems.join(',')
      }
      if (this.internalSteps.length == 0) {
        this.stepsData = ''
      } else {
        this.addSplit = this.settingForm.value.internalSteps.toString();
        this.stepsData = this.addSplit.split(",");
        this.stepsData = this.removeNull(this.stepsData)
        // //console.log("Hello", this.stepsData.length);
        if (this.stepsData.length == 0) {
          this.stepsData = ''
        } else {
          this.stepsData = this.stepsData.join(",");
          // //console.log("Join", this.stepsData)
        }
        if (this.ids == undefined) {
          this.ids = ""
        } else {
          this.ids = this.ids
        }
      }
      if (this.settingForm.value.dependencies == "N") {
        this.settingForm.value.dependencies = ""
      }
      obj = {
        "action": "U",
        "sId": this.editdata.sId,
        "sTrackingsteps": this.settingForm.value.trackingSteps,
        "sDependencies": this.settingForm.value.dependencies,
        "sNotifications": this.ids,
        "sWithin": this.settingForm.value.within,
        "sType": this.settingForm.value.type,
        "sStatus": this.settingForm.value.status,
        "sInternalsteps": this.stepsData,
        "sCreatedBy": this.editdata.sCreatedBy,
        "sUpdatedBy": JSON.parse(this.userId),
        "sSequence": this.settingForm.value.sequence
      }
    }
    console.log(obj);
    let token = localStorage.getItem('UserToken');
    this.service.addSetting(obj).subscribe((data: any) => {
      //console.log("Data", data);
      if (data == 3) {
        alertify.warning("record already exist").dismissOthers()
      }
      else if (data == 2) {
        alertify.error("insert or update record failed").dismissOthers()
      }
      else {
        this.getSettings();
        this.settingForm.reset();
        this.formSubmitted = false;
        if (this.submit == true) {
          alertify.success("Record Added Successfully").dismissOthers();
        } else {
          alertify.success("Record Updated Successfully").dismissOthers();
        }
        this.closebutton.nativeElement.click();
        this.stepsData = "";
      }
    })
  }

  /* --------Edit Settings---------*/
  edit(data: any) {
    const Myarray = [];
    let a = data.sNotifications;
    let splitted = a.split(",");
    this.editNotification = [];
    this.roles.forEach((e2: any) => {
      for (let i = 0; i < splitted.length; i++) {
        if (splitted[i] == e2.rId) {
          this.editNotification.push(e2);
        }
      }
    })
    this.dpValue = data.sInternalsteps.split(",")
    this.dpValue = this.removeNull(this.dpValue)
    // //console.log("My", this.dpValue)
    for (let j = 0; j < this.dpValue.length; j++) {
      this.internalSteps.push(this.formBuilder.control(this.dpValue[j]));
    }
    this.editdata = data;
    console.log(this.editdata);
    this.save = true;
    this.submit = false;
    this.settingForm.patchValue({
      trackingSteps: data.sTrackingsteps,
      dependencies: data.sDependencies,
      notifications: this.editNotification,
      within: data.sWithin,
      type: data.sType,
      sequence: data.sSequence,
      status: data.sStatus
    });
  }

  /* ----------------Delete-----------*/
  DeleteRow(data: any) {
    const obj = {
      "action": "D",
      "sId": data.sId,
      "sTrackingsteps": data.sTrackingsteps,
      "sInternalsteps": data.sInternalsteps,
      "sDependencies": data.sDependencies,
      "sNotifications": data.sNotifications,
      "sWithin": data.sWithin,
      "sType": data.sType,
      "sSequence": data.sSequence,
      "sStatus": data.sStatus,
      "sCreatedBy": data.sCreatedBy,
      "sUpdatedBy": data.sUpdatedBy
    }
    if (confirm('Are you want to delete this record?')) {
      this.service.addSetting(obj).subscribe((data: any) => {
        if (data == 2) {
          alertify.confirm('Plase Try again');
        }
        else {
          this.getSettings();
          alertify.error('Record Deleted Successfully').dismissOthers();
        }
      })
    }
  }

  /* --------Close Popup-----------*/
  closeform() {
    this.settingForm.reset();
    this.internalSteps.clear();
    this.formSubmitted = false;
  }

  /* --------Navigation to Deallog-----------*/
  deallogpage() {
    this.router.navigate(['/deallog']);
  }
}

