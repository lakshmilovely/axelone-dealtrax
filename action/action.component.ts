import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionService } from '../core/_services/action/action.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
declare var alertify: any;
alertify.set('notifier', 'position', 'top-right');




@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit {
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closeFollowers') closeFollowers: any;
  @ViewChild('actionClose') actionClose: any;

  assigneeFilter: any = '';
  followersFilter: any = '';
  selectAlpha: any;
  projectId: any = 7;
  popData: any;
  @Input() Dealsdetails: any;
  allModules: any = [];
  selectedModule: any;
  actionName: any = '';
  description: any = '';
  allUsersByStore: any = [];
  totalUsers: any = [];
  imgURL: any;
  sender:any = localStorage.getItem('UserId');
  assignedUsers: any = [];
  assignString: any;
  mainAssignUsers: any = [];
  assignedFollowers: any = [];
  finalFollowersId: any = '';
  dateObj: any;

  mainAssignFollowers: any = [];
  hoverIdx: any = -1;
  task: any;
  priority: any;
  show: any = '';
  b: any;
  show1: any;
  url: any;
  select: any;
  filePath: any;
  lastpart: any;
  StatusHide: boolean = false;
  public hidecard = false;
  public priorityHide = false;
  selectedPriority: any = '';
  public dateTime1: any;
  ExtensionArray = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'pdf',
    'csv',
    'xlsx',
    'xls',
    'txt',
    'docx',
    'doc',
    'ods',
    'heic',
    'md',
  ];
  attachment: any = [];
  ext: any;
  viewpath: any = [];
  priorityRef!: boolean;

  /*-----tags----*/
  FormSubmitted = false;
  public date = new Date();
  tagsData: any = [];
  filtered: any = [];
  selectTagList: any = [];
  selectdata: any = [];
  tagIdsPush: any = [];
  finalTagIds: any = '';
  FilteredIds: any;
  TagSliceData: any;
  alreadySelectTag: any = '';
  editData: any;
  norepeate: any;
  SelectedTag: any = '';
  norepeateName: boolean = false;
  dealNumber: any;
  assignedRef!: boolean;
  moduleRef!: boolean;
  nameRef!: boolean;
  descRef!: boolean;
  statusRef!: boolean;

  public startAt = new Date();
  // Min moment: Today
  public min = new Date();
  // Max moment: April 25 2018, 20:30
  year: any = new Date().getFullYear();

  public max = new Date(this.year + 1, 12, 31, 20, 30);
  ext1: any;
  edit!: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    private actsrvc: ActionService,
    private fb: FormBuilder
  ) { }

  tagForm = this.fb.group({
    addtagname: ['', Validators.required],
  });

  ngOnInit(): void {
    this.sender=JSON.parse(this.sender)
    console.log(this.Dealsdetails);
    this.popData = this.Dealsdetails;
    this.imgURL = environment.thumbUrl;
    this.selectedModule = 7;
    this.getModules();
    this.AllTagsData();
    if (this.popData[0].taskStatus != 'N') {
      this.actsrvc
        .getTaskById(JSON.parse(this.popData[0].taskStatus))
        .subscribe((data: any) => {
          console.log(data);
          this.edit = true;
          this.editData = data[0];
          this.viewstatus();
          this.viewpriority();
          this.getUsersByStore(this.popData[0].store);
          this.actionName = this.editData.tTitle;
          this.description = this.editData.tDesc;
          this.dateTime1 = this.editData.tDueDate;
          this.attachment = [];
          this.attachment = this.editData.tFileUpload.split(',');
          console.log(this.attachment);
          this.viewpath = [];
          for (let i = 0; i < this.attachment.length; i++) {
            var pattern = /\\/;
            let pat = /~/;
            let ls = String(this.attachment).split(pattern).pop();
            this.lastpart = String(ls).split(pat).pop();
            this.ext1 = this.lastpart.split('.').pop();
            this.viewpath.push({
              name: this.lastpart,
              type: this.ext1,
              link: this.attachment,
            });
            console.log('edit', this.viewpath);
          }
          const tagIds = this.editData.tTagId.split(',');
          console.log(tagIds);
          tagIds.map((ob: any) => {
            this.tagsData.forEach((a: any) => {
              if (a.tagId == ob) {
                this.SelectTag(a);
              }
            });
            console.log(this.selectTagList);
          });
        });
    } else {
      this.edit = false;
      this.viewstatus();
      this.viewpriority();
      this.getUsersByStore(this.popData[0].store);
      this.selectAlpha = '';
      this.finalFollowersId = '';

    }
  }

  StatusClick() {
    this.StatusHide = !this.StatusHide;
    this.priorityHide = false;
    this.hidecard = false;
  }

  TagsClick() {
      this.removedata();
      // this.hidecard = !this.hidecard;
      this.priorityHide = false;
      this.StatusHide = false;
  }

  open(item: any) {
    ////// console.log(item);
    this.show = item;
    console.log(this.show);

    const box = document.querySelector('#status') as HTMLElement | null;
    console.log(box);
    if (box != null) {
      box.style.display = 'none';
    }
  }
  viewstatus() {
    this.actsrvc.statusview().subscribe((res: any) => {
      this.task = res;
      if (this.popData[0].taskStatus == 'N') {
        this.show = this.task[1];
        this.dateTime1 = '';
      } else {
        this.task.forEach((item: any) => {
          if (item.tsId == this.editData.tStatusId) {
            console.log(item);
            this.show = item;
          }
        });
      }

      // console.log(this.task);
    });
  }
  PriorityClick() {
    this.priorityHide = !this.priorityHide;
    this.hidecard = false;
    this.StatusHide = false;
  }
  open1(item: any) {
    ////console.log(item);
    this.selectedPriority = item;
    this.show1 = item.tpTitle;
    this.b = item.tpColorCode;
  }
  viewpriority() {
    this.actsrvc.priority().subscribe((res: any) => {
      this.priority = res;
      if (this.popData[0].taskStatus == 'N') {
        this.show1 = this.priority[1].tpTitle;
        this.b = this.priority[1].tpColorCode;
        this.selectedPriority = this.priority[1];
      } else {
        this.priority.forEach((item: any) => {
          if (item.tpId == this.editData.tPriorityId) {
            this.selectedPriority = item;
            this.show1 = item.tpTitle;
            this.b = item.tpColorCode;
          }
        });
      }

      ////console.log(this.priority);
    });
  }

  //File Upload

  selectFile1(event: any) {
    console.log(event.target.files);
    let filename: string = event.target.files[0].name;
    let fileExtension: string = event.target.files[0].name
      .split('?')[0]
      .split('.')
      .pop();
    console.log(filename);
    console.log(fileExtension);
    if (this.ExtensionArray.indexOf(fileExtension) != -1) {
      const formData = new FormData();
      let d = new Date();
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      let year = d.getFullYear();
      console.log(year);

      let min = d.getMinutes();
      let hrs = d.getHours();
      let sec = d.getSeconds();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      let da = [year, month, day, hrs, min, sec].join('_').toString();
      formData.append('file', event.target.files[0], da + '~' + filename);
      console.log(formData);
      if (this.attachment.length < 3) {
        this.actsrvc.upload(formData).subscribe((res: any) => {
          console.log(res);
          this.filePath = 'https://devtaskapi.axelautomotive.com/' + res.dbPath;
          this.attachment.push(this.filePath);
          console.log(this.attachment.length);
          let pattern = /\\/;
          let pat = /~/;
          let ls = String(this.attachment).split(pattern).pop();
          this.lastpart = String(ls).split(pat).pop();
          this.ext = this.lastpart.split('.').pop();
          this.viewpath.push({
            name: this.lastpart,
            type: this.ext,
            link: this.filePath,
          });
          console.log(this.viewpath);
        });
      } else {
        alertify.error('Maxmium number of files should be 3');
      }
    } else alertify.error('You have unsupported format documents/media.');
  }

  Removeimage(index: any, item: any) {
    if (confirm('Are you Want To Remove the file')) {
      console.log(index, item);
      // this.urls.splice(index, 1);
      for (let i = 0; i < this.viewpath.length; i++) {
        if (this.viewpath[i].name == item) {
          this.viewpath.splice(index, 1);
          this.attachment.splice(index, 1);
        }
      }
    }

    console.log(this.viewpath);

    console.log('after remove', this.attachment);
  }
  userSelect(event: any, data: any) {
    for (let i = 0; i < this.assignedUsers.length; i++) {
      delete this.assignedUsers[i].name;
      delete this.assignedUsers[i].checked;
    }
    this.assignedUsers = [];
    if (event.target.checked == true) {
      data.checked = true;
      data.name = 'A';
      this.assignedUsers.push(data);
    }
  }
  closeModal() {
    this.activeModal.close();
  }
  getModules() {
    this.actsrvc.modulesData().subscribe((data) => {
      console.log(data);
      this.allModules = data;
    });
  }
  alphaFilter(letter: any) {
    this.selectAlpha = letter;
    this.allUsersByStore = [];
    if (letter == '') {
      this.allUsersByStore = this.totalUsers;
    } else {
      this.totalUsers.forEach((element: any) => {
        let a: any = Array.from(element.ufname)[0];
        if (a.toUpperCase() == letter) {
          this.allUsersByStore.push(element);
        }
      });
    }
    this.ClickToHide();
  }
  getUsersByStore(value: any) {
    this.allUsersByStore = [];
    console.log(value);
    this.actsrvc.getUsersByStore(value).subscribe((data: any) => {
      console.log(data);
      this.allUsersByStore = data;
      this.totalUsers = data;
      if (this.popData[0].taskStatus != 'N') {
        this.totalUsers.forEach((user: any) => {
          if (user.uid == this.editData.tAssignedUid) {
            user.checked = true;
            user.name = 'A';
            console.log(user);
            this.mainAssignUsers.push(user);
            this.assignedUsers.push(user);
            this.assignUsers();
          }
        });
        const followerIds = this.editData.tFollowerUid.split(',');
        console.log(followerIds);
        followerIds.map((ob: any) => {
          this.totalUsers.forEach((a: any) => {
            if (a.uid == ob) {
              a.checked = true;
              a.name = 'F';
              this.assignedFollowers.push(a);
            }
          });
          console.log(this.assignedFollowers);
          this.mainAssignFollowers = this.assignedFollowers;
          this.finalFollowersId = followerIds;
        });
      }
    });
  }
  assignUsers() {
    if (this.assignedUsers.length != 0) {
      this.closebutton.nativeElement.click();
      this.mainAssignUsers = this.assignedUsers;
      this.assignString = this.mainAssignUsers[0].uid;
      // this.assignString.toString();
    }
  }
  followerSelect(e: any, data: any) {
    if (e.target.checked == true) {
      data.checked = true;
      data.name = 'F';
      this.assignedFollowers.push(data);
    } else {
      const index = this.assignedFollowers.findIndex(
        (a: any) => a.uid === data.uid
      );
      console.log(index);
      this.assignedFollowers[index].name = '';
      this.assignedFollowers[index].checked = false;
      if (
        this.assignedFollowers[index].name == '' &&
        this.assignedFollowers[index].checked == false
      ) {
        this.assignedFollowers.splice(index, 1);
      }
    }
    console.log(this.assignedFollowers);
  }
  assignFollowers() {
    this.finalFollowersId = [];
    if (this.assignedFollowers.length != 0) {
      this.closeFollowers.nativeElement.click();
      this.mainAssignFollowers = this.assignedFollowers;
      ////console.log(this.mainAssignFollowers);
      for (let i = 0; i < this.mainAssignFollowers.length; i++) {
        this.finalFollowersId.push(this.mainAssignFollowers[i].uid);
      }
    }
  }

  /*-----tags----*/
  AddTagData() {
    this.norepeateName = false;
    if (this.tagForm.invalid) {
      this.FormSubmitted = true;
      this.hidecard = false;
      alertify.set('notifier', 'position', 'top-right');
      alertify.error('Empty Tag Not Allowed');
    } else {
      this.FormSubmitted = false;
      for (let i = 0; i < this.tagsData.length; i++) {
        if (
          this.tagsData[i].tagTitle.toLowerCase() ==
          this.tagForm.value.addtagname.toLowerCase()
        ) {
          this.norepeateName = true;
          this.alreadySelectTag = this.tagsData[i];
        }
      }
      // console.log(this.norepeateName);
      // // console.log(newTag)
      if (this.norepeateName == true) {
        this.SelectTag(this.alreadySelectTag);
        this.hidecard = false;
      } else {
        const obj = {
          tagId: 0,
          tagTitle: this.tagForm.value.addtagname,
          tagStatus: 'Y',
          tagCts: this.date,
          tagUts: this.date,
          tagCuid: 0,
          tagUuid: 0,
        };
        console.log(obj);
        this.actsrvc.PostTagsData(obj).subscribe((res: any) => {
          // //// // console.log(res);
          // alertify.set('notifier', 'position', 'top-right');
          alertify.success('Tag added Successfully');
          this.hidecard = false;
          this.selectdata = res;
          this.SelectTag(res);
          this.AllTagsData();
        });
      }
    }
    this.tagForm.reset();
  }
  AllTagsData() {
    this.actsrvc.GetTagsData().subscribe((res: any) => {
      console.log(res);
      this.tagsData = res;
      if (this.popData[0].taskStatus == 'N') {
        console.log(typeof this.popData[0].id);
        console.log(typeof this.tagsData[0].tagTitle);
        const index = this.tagsData.findIndex(
          (a: any) => a.tagTitle === this.popData[0].id
        );
        console.log(index);
        if (index == -1) {

          this.TagDealNo();
        } else {
          this.SelectTag(this.tagsData[index]);
        }
      }
    });
  }
  TagDealNo() {
    const obj = {
      tagId: 0,
      tagTitle: this.popData[0].id,
      tagStatus: 'Y',
      tagCts: this.date,
      tagUts: this.date,
      tagCuid: 0,
      tagUuid: 0,
    };
    console.log(obj);
    this.actsrvc.PostTagsData(obj).subscribe((res: any) => {
      console.log(res);
      this.hidecard = false;
      this.selectdata = res;
      this.SelectTag(res);
      // this.AllTagsData();
    });
  }

  FilterTags(val: any) {
    return this.tagsData.filter(
      (option: { tagTitle: any }) =>
        option.tagTitle.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) ===
        0
    );
  }

  OnChange(e: any) {
    this.hidecard = true;
    this.filtered = this.FilterTags(e.target.value.toLocaleLowerCase());
    // // console.log(this.filtered);
  }

  SelectTag(item: any) {
    this.hidecard = false;
    this.tagIdsPush = [];
    // //// // console.log(this.tagIdsPush);
    this.filtered = this.filtered.filter(
      (x: { tagId: any }) => x.tagId == item.tagId
    );
    const index = this.selectTagList.findIndex(
      (object: any) => object.tagId === item.tagId
    );
    //alert(index);
    if (index === -1) {
      this.selectTagList.push(item);
    }
    else{
      if(index == 0){
        alertify.error('Tag Already Exists');
      }else{
      alertify.error('Tag Already Exists');
      }
    }

    for (let a = 0; a < this.selectTagList.length; a++) {
      this.tagIdsPush.push(this.selectTagList[a].tagId);
      // // console.log(this.tagIdsPush);
      this.FilteredIds = this.tagIdsPush.filter(
        (n: any, i: any) => this.tagIdsPush.indexOf(n) === i
      );
      // // console.log(this.FilteredIds);
      this.finalTagIds = this.FilteredIds.join(',');
      // // console.log(this.finalTagIds);
    }
    this.tagForm.reset();
  }
  // RemoveTags(index: any, id: any) {
  //   // if (this.editData.tStatus != "Y") {
  //   this.hidecard = false;
  //   this.selectTagList.splice(index, 1);
  //   const index1 = this.FilteredIds.findIndex((a: any) => a == id);
  //   this.FilteredIds.splice(index1, 1);
  //   this.finalTagIds = this.FilteredIds.join(',');
  //   // // console.log(this.FilteredIds);
  //   // // console.log(this.finalTagIds);
  //   // }
  // }
  removedata() {
    this.filtered = [];
    this.FormSubmitted = false;
    this.tagForm.reset();
    this.hidecard = false;
  }
  ClickToHide() {
    this.priorityHide = false;
    this.hidecard = false;
    this.StatusHide = false;
  }
  saveAction() {
    this.dateObj = '';
    this.dateObj = new Date();

    if (
      this.mainAssignUsers.length == 0 ||
      this.selectedModule == '' ||
      this.actionName == '' ||
      this.description == '' ||
      this.show == '' ||
      this.selectedPriority == ''
    ) {
      if (this.mainAssignUsers.length == 0) {
        this.assignedRef = true;
      }
      if (this.selectedModule == '') {
        this.moduleRef = true;
      }
      if (this.actionName == '') {
        this.nameRef = true;
      }
      if (this.description == '') {
        this.descRef = true;
      }
      if (this.show == '') {
        this.statusRef = true;
      }
      if (this.selectedPriority == '') {
        this.priorityRef = true;
      }
    } else {
      this.dateObj = '';
      this.dateObj = new Date();
      console.log('assign', this.assignString);
      console.log('store', this.popData[0].storeId);
      console.log('module', this.selectedModule);
      console.log('actionName', this.actionName);
      console.log('Description', this.description);
      console.log('statusId', this.show.tsId);
      console.log('selectedPriority', this.selectedPriority.tpId);
      console.log('aatch', this.attachment.toString());
      console.log('date', this.dateObj);
      console.log('finalTagIds', this.finalTagIds);
      console.log('finalFollowersId', this.finalFollowersId.toString());
      let obj;
      obj = {
        tId: 0,
        tPrjId: this.selectedModule,
        tTitle: this.actionName,
        tDesc: this.description,
        tDueDate: this.dateTime1,
        tStatusId: this.show.tsId,
        tPriorityId: this.selectedPriority.tpId,
        tTagId: this.finalTagIds,
        tFileUpload: this.attachment.toString(),
        tAssignedbyUid: this.sender,
        tAssignedbyTs: this.dateObj,
        tClosedby: 0,
        tClosedbyTs: this.dateObj,
        tStatus: 'N',
        tAssignedUid: this.assignString.toString(),
        tFollowerUid: this.finalFollowersId.toString(),
        tCts: this.dateObj,
        tCuid: this.sender,
        tUpdatedUid: this.sender,
        tUts: this.dateObj,
        tStoreId: JSON.parse(this.popData[0].storeId),
        tDealno:this.popData[0].id
      };
      console.log(obj);
      this.actsrvc.createAction(obj).subscribe((data: any) => {
        console.log(data);
        if (data.tId != 0) {
          // this.dsboard.setbuttonData('');
          alertify.set('notifier', 'position', 'top-right');
          alertify.success('Action Created ');
          let obj1 = {
            dealno: this.popData[0].id,
            coraAcctId: JSON.parse(this.popData[0].storeId),
            taskStatus: data.tId.toString(),
          };
          console.log(obj1);
          this.actsrvc.updateTaskStatus(obj1).subscribe((data: any) => {
            console.log(data);
            if (data == 1) {
              this.activeModal.close(data);
            }
          });
        }
      });
    }
  }
  updateAction() {
    if (
      this.mainAssignUsers.length == 0 ||
      this.selectedModule == '' ||
      this.actionName == '' ||
      this.description == '' ||
      this.show == '' ||
      this.selectedPriority == ''
    ) {
      if (this.mainAssignUsers.length == 0) {
        this.assignedRef = true;
      }
      if (this.selectedModule == '') {
        this.moduleRef = true;
      }
      if (this.actionName == '') {
        this.nameRef = true;
      }
      if (this.description == '') {
        this.descRef = true;
      }
      if (this.show == '') {
        this.statusRef = true;
      }
      if (this.selectedPriority == '') {
        this.priorityRef = true;
      }
    } else {
      this.dateObj = '';
      this.dateObj = new Date();
      let obj;
      obj = {
        tId: this.editData.tId,
        tPrjId: this.selectedModule,
        tTitle: this.actionName,
        tDesc: this.description,
        tDueDate: this.dateTime1,
        tStatusId: this.show.tsId,
        tPriorityId: this.selectedPriority.tpId,
        tTagId: this.finalTagIds,
        tFileUpload: this.attachment.toString(),
        tAssignedbyUid: this.editData.tAssignedbyUid,
        tAssignedbyTs: this.editData.tAssignedbyTs,
        tClosedby: 0,
        tClosedbyTs: this.dateObj,
        tStatus: this.editData.tStatus,
        tAssignedUid: this.editData.tAssignedUid.toString(),
        tFollowerUid: this.finalFollowersId.toString(),
        tCts: this.editData.tCts,
        tCuid: this.editData.tCuid,
        tUpdatedUid: this.sender,
        tUts: this.dateObj,
        tStoreId: this.editData.tStoreId,
        tDealno:this.editData.tDealno
      };
      console.log(obj);
      this.actsrvc
        .updateAction(obj, this.editData.tId)
        .subscribe((data: any) => {
          console.log(data);
          alertify.set('notifier', 'position', 'top-right');
          alertify.success('Action Updated ');
          this.activeModal.close('U');
        });
    }
  }
}
