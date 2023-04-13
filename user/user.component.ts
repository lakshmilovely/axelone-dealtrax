import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../core/_services/user/user.service';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmedValidator } from '../core/_providers/confirmed.validator';
declare var alert: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  FormSubmitted = false;
  submitForm = false;
  view: any = [];
  save!: boolean;
  add12!: boolean
  id: any;
  datausers: any;
  role: any;
  status: any;
  data: any = [];
  drowpdown: any;
  allroles: any;
  onselectIds: any = [];
  ids: any;
  clickstorecoraId: any;
  storenamedata: any = [];
  public passHide = true;
  storeIddata: any = [];
  splitted: any;
  storenameid: any;
  CoraAcctName: any = [];
  sortingdata: any = [];
  CoraAcctId: any = [];
  inputboxes: any = [];
  resetpass!: boolean
  Username = localStorage.getItem('UserDisplay');
  Usertitle = localStorage.getItem('UserTitle');
  EventPush: any = [];
  joinevent: any;
  searchText: string = '';
  joindata: any;
  storename: any;
  joindata2: any;
  joindata3: any;
  splitteddata: any;
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  storearr:any=[];
  constructor(
    private userservice: UserService,
    private active: ActivatedRoute,
    private builder: FormBuilder
  ) { }

  userForm = this.builder.group(
    {
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      DName: ['', Validators.required],
      confirmpass: ['', Validators.required],
      RoleId: ['', Validators.required],
      Status: ['', Validators.required],
      Email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      stores: this.builder.array([], Validators.required),
    },
    {
      validator: ConfirmedValidator('Password', 'confirmpass'),
    }
  );

  ngOnInit(): void {
    this.UsersView();
    // this.StoreView();
    this.RolesView();
  }

  get stores() {
    return this.userForm.get('stores') as FormArray;
  }

  Inputadd() {
    this.stores.push(this.builder.control(''));
  }

  Inputremove(value: any) {
    this.stores.removeAt(value);
  }

  UsersView() {
    this.userservice.getAllUser().subscribe((res: any) => {
      ////console.log('USerData', res);
      this.view = res;
      let SortData = this.view.sort((a: any, b: any) => b.uId - a.uId);
      this.sortingdata = SortData;
      this.userservice.stores().subscribe((res: any) => {
        this.drowpdown = res;
        this.sortingdata.forEach((data: any) => {
          let a = data.cora_Id;
          let splitted = a.split(',');
          this.CoraAcctName = [];
          this.drowpdown.forEach((data2: any) => {
            for (let i = 0; i < splitted.length; i++) {
              if (splitted[i] == data2.asCoraAcctId) {
                this.CoraAcctName.push(data2.asLegalentityName);
                data.name = this.CoraAcctName;
                this.CoraAcctId.push(data2.asCoraAcctId);
              }
            }
          });
        });
      });
    });

  }
  resetButton() {

    this.userForm.controls['UserName'].disable();

  }
  // StoreView() {

  // }

  RolesView() {
    this.userservice.ViewAllRoles().subscribe((res: any) => {
      this.allroles = res;
    });
  }

  adduser() {
    this.userForm.reset();
    this.stores.clear();
    this.add12 = true;
    this.save = false;
    this.resetpass = false;

    // this.passHide = true;
  }

  AddUser() {
    this.joindata = this.userForm.value.stores.join(',');
    ////console.log(';joindata', this.joindata);

    if (this.userForm.invalid) {
      this.FormSubmitted = true;
    } else {
      const obj = {
        uId: 0,
        uName: this.userForm.value.UserName,
        uDisplayname: this.userForm.value.DName,
        uPassword: this.userForm.value.Password,
        uTitle: 'string',
        urId: this.userForm.value.RoleId,
        uAsCoraAcctId: this.joindata,
        uEmailId: this.userForm.value.Email,
        uActive: this.userForm.value.Status,
      };
      ////console.log(obj);
      this.userservice.addUser(obj).subscribe((res: any) => {
        ////console.log('Add User Data=', res);
        this.FormSubmitted = false;
        // alert('notifier', 'position', 'top-center');
        alert('User Added successfully');
        this.ngOnInit();
      });
    }
  }

  EditClick(res: any) {
    this.userForm.reset();

    this.passHide = false;
    this.add12 = false;
    this.save = true;
    this.resetpass = true;

    ////console.log('User Edit Click=', res);
    this.clickstorecoraId = res.cora_Id;
    let splitted = this.clickstorecoraId.split(',');
    this.splitteddata = splitted;
    ////console.log('splited', splitted);

    for (let k = 0; k < this.drowpdown.length; k++) {
      for (let i = 0; i < this.splitteddata.length; i++) {
        if (this.splitteddata[i] == this.drowpdown[k].asCoraAcctId) {
          this.stores.push(this.builder.control(this.splitteddata[i]));
        }
      }
    }

    this.userForm.patchValue({
      UserName: res.username,
      DName: res.displayname,
      // stores: this.stores,
      RoleId: res.urId,
      Status: res.uActive,
      Email: res.uEmail,
    });
    this.datausers = res;
  }

  UpdateUser(id: any) {
    alert(id);
    // this.FormSubmitted=false;
    this.joindata2 = this.userForm.value.stores.join(',');
    ////console.log('joindatda2', this.joindata2);
    const obj = {
      uId: id,
      uName: this.userForm.value.UserName,
      uDisplayname: this.userForm.value.DName,
      uTitle: 'string',
      uPassword: '',
      urId: this.userForm.value.RoleId,
      uAsCoraAcctId: this.joindata2,
      uEmailId: this.userForm.value.Email,
      uActive: this.userForm.value.Status,
    };

    ////console.log('objectdata', obj);
    this.userservice.addUser(obj).subscribe((res: any) => {
      ////console.log(res);

      // alert('notifier', 'position', 'top-center');
      alert('User Updated Successfully');
      // this.ngOnInit();
      this.UsersView();
      this.userForm.reset();
      this.stores.clear();
    });
  }

  DeleteUser(uId: any) {
    this.ids = uId.uId;
    const obj = {
      uId: this.ids,
      uName: 'string',
      uDisplayname: 'string',
      uPassword: 'string',
      uTitle: 'string',
      urId: 0,
      uAsCoraAcctId: 'string',
      uEmailId: 'string',
      uActive: 'D',
    };
    ////console.log(obj);
    this.userservice.addUser(obj).subscribe((res) => {
      ////console.log(res);
      // alert('notifier', 'position', 'top-center');
      alert('User Deleted Successfully');
      this.ngOnInit();
    });
  }

  change(data: any) {
    ////console.log(data.target.value);
    this.role = data.target.value;
    ////console.log('Change Role=', this.role);
  }

  change2(data: any) {
    ////console.log(data.target.value);
    this.status = data.target.value;
    ////console.log('Change Status=', this.status);
  }

  onItemSelect(item: any) {
    ////console.log('data 1=', item.asCoraAcctId);
    this.onselectIds.push(item.asCoraAcctId);
    this.ids = this.onselectIds.join(',');
  }

  onSelectAll(item: any) {
    ////console.log('data 2=', item);
  }

  alrt() {
    alert('notifier', 'position', 'top-center');
    alert('You are Not Authorized');
  }

  updatepassword(id: any) {
    this.joindata3 = this.userForm.value.stores.join(',');
    if (this.userForm.invalid) {
      this.submitForm = true;
    } else {
      const obj = {
        uId: id,
        uName: this.userForm.value.UserName,
        uDisplayname: this.userForm.value.DName,
        uTitle: 'string',
        uPassword: this.userForm.value.Password,
        urId: this.userForm.value.RoleId,
        uAsCoraAcctId: this.joindata3,
        uEmailId: this.userForm.value.Email,
        uActive: this.userForm.value.Status,
      };
      ////console.log('updatePassword', obj);
      this.userservice.addUser(obj).subscribe((res: any) => {
        ////console.log('resetpAssword', res);
        this.submitForm = false;
        alert('notifier', 'position', 'top-center');
        alert('Password Changed SucccessfullY');
        this.ngOnInit();
        this.stores.clear();
        this.userForm.reset();
      });
    }
  }

  changeEvent(id: any) {
    ////console.log('COraID', id.target.value);
  }

  cancelbtn() {
    this.stores.clear();
    this.FormSubmitted = false;
    // this.submitForm = false;
    this.userForm.reset();
  }
}
