import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DeallogService } from '../core/_services/deallog/deallog.service';
import { HeaderService } from '../core/_services/header/header.service';
//import { AxelOneService } from '../providers/axelone.api';
declare var alertify: any;

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit {
  userObj: any;
  user: any;
  url: any;
  isLoading: boolean = false;
  shw: boolean = false;
  phonenumber: any = '';
  messagebody: any = '';
  sendMsgDiv: boolean = false;
  num!: boolean;
  msg!: boolean;


  //hhh

  @ViewChild('scrollMe')
  private myScrollContainer!: ElementRef;
  messages: any;
  messagesBindingArray: any = [];
  conversations: any = [];
  leftQueue: any = [];
  lastMessage: any;
  message: any;
  sendMsg: any;
  client: any;
  previous: any = [];
  next: any = [];
  count!: number;
  allConversations: any = [];
  allData: any = [];
  selectedConversation: any;
  value!: number;
  msgsid!: number;
  first: any;
  empty: any = [];
  finalArray: any = [];
  sortedArray1: any = [];
  archiveData: any = [];
  conversations1: any = [];
  author: any;
  audio!: HTMLAudioElement;
  audioHint: number | undefined;
  audioQueue!: HTMLAudioElement;
  audioQueueHint: number | undefined;
  smsnotif!: boolean;
  indentity: string = '';
  conObj: any;
  textBox: boolean = true;
  newMessages: any = [];

  constructor(public sanitizer: DomSanitizer, private router: Router, private deallog: DeallogService,private headerService:HeaderService) {
    this.isLoading = true;
    //  this.aoser.changehead(true);
    //  this.aoser.showfilter(false);
    this.user = localStorage.getItem("uname");
    //hhhhhhhhhh
    this.audio = new Audio();
    this.audio.src = '../../assets/notify.wav';
    this.audio.load();
    this.audioQueue = new Audio();
    this.audioQueue.src = '../../assets/quenotif.mp3';
    this.audioQueue.load();
    this.smsnotif = false;
    this.audioHint = 0;
    this.audioQueueHint = 0;
    this.value = 0;

    //this.setmessenger();
    setTimeout(() => {
      this.isLoading = false;
      this.shw = true;
    }, 2000);
  }

  ngOnInit(): void {

    //  let token={"userid":this.user,"productid":7}
    //  var tkn=btoa(JSON.stringify(token));
    //  this.url='https://axelonechat.axelautomotive.com/'+tkn;

    // this.url=this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.headerService.setHideFilter('N');
    this.headerService.setactiveFilter('N');
  }
  showDiv = {
    attc: false,
    editgroup: false,
    addgroup: false,
  };
  navtosmsdb() {
    // this.router.navigate(['path/dashboard']);
  }

  //   setmessenger(){


  //  let token={"userid":this.user,"productid":7}
  // var tkn=btoa(JSON.stringify(token));
  // this.url='https://axelonechat.axelautomotive.com/'+tkn;

  // return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  //  // this.sanitizer.bypassSecurityTrustResourceUrl('https://axelonechat.axelautomotive.com/'+tkn);
  // return false;
  //   }
  newMsg() {
    this.sendMsgDiv = true;
  }
  close() {
    this.sendMsgDiv = false;

  }

  keyPressAlpha(event: any) {
    console.log(event);
    var inp = String.fromCharCode(event.keyCode);
    if (/[-(),0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  msgSent() {
    // console.log(this.phonenumber);
    // console.log(this.messagebody);
    if (this.phonenumber == '' || this.messagebody == '') {
      if (this.phonenumber == '') {
        this.num = true;
      }
      if (this.messagebody == '') {
        this.msg = true;
      }

    }
    else {
      let numbarray = this.phonenumber.split(',');
      let abc = numbarray.map((word: any) =>
        word.replace(/[^0-9 ]/g, "").split(' ').join('')

      );
      console.log(abc);
      const index = abc.findIndex((a: any) => a.length != 10);
      if (index === -1) {
        let obj = {
          To_Numbers: this.phonenumber,
          Message: this.messagebody,
          // From:"+14154506712"
        }
        console.log(obj);
        this.deallog.MessageSend(obj).subscribe(data => {
          console.log(data);
          if (data == 'Done') {
            alertify.success("Message Sent Successfully.");
            this.phonenumber = '';
            this.messagebody = '';
            this.num = false;
            this.msg = false;
          }
        })
      }
      else {
        alert("please check your numbers")
      }


    }



    // console.log(numbarray);





  }
  getAllConversations() {
    // this.leftQueue = [];
    // this.conversations = [];
    // this.archiveData = [];
    // this.conObj = {
    //   "Action": "A",
    //   "Con_Id": "00000000-0000-0000-0000-000000000000",
    //   "Phonenumber": ""
    // }
    // this.service.getAllConversations(this.conObj).subscribe((data: any) => {
    //   console.log(data);
    //   this.allConversations = data.response;
    //   for (let i = 0; i < this.allConversations.length; i++) {
    //     if (this.allConversations[i].Read_Index == "Q") {
    //       this.leftQueue.push(this.allConversations[i]);
    //       this.leftQueue.sort(
    //         (a: any, b: any) =>
    //           new Date(b.CreatedDate).getTime() -
    //           new Date(a.CreatedDate).getTime()
    //       );
    //     }
    //     else if ((this.allConversations[i].Read_Index == "R" || this.allConversations[i].Read_Index == "U") && this.allConversations[i].Status == "Y") {
    //       this.conversations.push(this.allConversations[i]);
    //       this.conversations.sort(
    //         (a: any, b: any) =>
    //           new Date(b.CreatedDate).getTime() -
    //           new Date(a.CreatedDate).getTime()
    //       );
    //       this.selectedConversation = this.conversations[0];
    //       this.getAllMessages(this.selectedConversation);
    //     }
    //     else if (this.allConversations[i].Status == "N") {
    //       this.archiveData.push(this.allConversations[i]);
    //       this.archiveData.sort(
    //         (a: any, b: any) =>
    //           new Date(b.CreatedDate).getTime() -
    //           new Date(a.CreatedDate).getTime()
    //       );
    //     }
    //   }
    // });
  }
  chatSelect(a: any) {


    console.log(a);
    // this.conObj = '';
    // this.conObj = {
    //   "Con_Id": a.Con_Id,
    //   "To_Number":a.To_Number,
    //   "From_Number": a.From_Number,
    //   "User_FrendName": a.User_FrendName,
    //   "Twilio_Identity": a.Twilio_Identity,
    //   "Mesg_Body": a.Mesg_Body,
    //   "Read_Index": "R",
    //   "Status": a.Status,
    //   "SmsWay": a.SmsWay
    // }
    // this.conObj = {
    //   "Con_Id": a.Con_Id,
    //   "To_Number": "",
    //   "From_Number": "",
    //   "User_FrendName": "",
    //   "Twilio_Identity": "",
    //   "Mesg_Body": "",
    //   "Read_Index": "R",
    //   "Status": "",
    //   "SmsWay": ""
    // }
    // console.log(this.conObj);
    // this.selectedConversation = a;
    // for (let i = 0; i < this.leftQueue.length; i++) {
    //   if (this.leftQueue[i].Con_Id === a.Con_Id) {
    //     // alert("true")
    //     this.textBox = true;
    //     this.first = this.leftQueue[i];
    //     this.leftQueue.splice(i, 1);
    //     this.conversations.unshift(this.first);
    //     if (a.Read_Index == "Q") {
    //       this.service.changeMessage(this.conObj).subscribe((data: any) => {
    //         console.log(data);
    //       });
    //     }
    //   }
    // }
    // for (let i = 0; i < this.archiveData.length; i++) {
    //   if (this.archiveData[i].Con_Id === a.Con_Id) {
    //     this.textBox = false;
    //   }
    // }

    // for (let i = 0; i < this.conversations.length; i++) {
    //   if (this.conversations[i].Con_Id === a.Con_Id) {
    //     this.textBox = true;
    //     document
    //       .getElementById(
    //         'LeftCount_' + a.Con_Id
    //       )
    //       ?.setAttribute('style', 'display:none');
    //     if (a.Read_Index == "U") {
    //       this.service.changeMessage(this.conObj).subscribe((data: any) => {
    //         console.log(data);
    //       });
    //     }
    //   }
    // }
    // if (a.Read_Index == "U" || a.Read_Index == "Q") {
    //   this.service.changeMessage(this.conObj).subscribe((data) => {
    //     console.log(data);
    //   });
    // }

    // this.getAllMessages(a);
  }

  getAllMessages(sid: any) {
    // this.conObj = {
    //   "Action": "B",
    //   "Con_Id": sid.Con_Id,
    //   "Phonenumber": ""
    // }
    // this.service.getAllConversations(this.conObj).subscribe((data: any) => {
    //   console.log(data);
    //   this.messagesBindingArray = data.response;
    //   console.log(this.messagesBindingArray);
    //   this.messagesBindingArray.sort(
    //     (a: any, b: any) =>
    //       new Date(a.CreatedDate).getTime() -
    //       new Date(b.CreatedDate).getTime()
    //   );
    //   console.log(this.messagesBindingArray);
    // });
  }

  onEnter(x: any) {
    // if (x == 'A') {
    //   var gh = this.message.replace(/\n/g, '');
    //   this.sendMsg = gh;
    // } else {
    //   this.sendMsg = this.message;
    // }
    // console.log(this.sendMsg.length);
    // this.message = '';
    // if (this.sendMsg.length > 0) {
    //   console.log(this.selectedConversation);
    //   this.conObj = {
    //     "Con_Id": this.selectedConversation.Con_Id,
    //     "To_Number": this.selectedConversation.To_Number,
    //     "From_Number": this.selectedConversation.From_Number,
    //     "User_FrendName": this.selectedConversation.User_FrendName,
    //     "Twilio_Identity": this.selectedConversation.Twilio_Identity,
    //     "Mesg_Body": this.sendMsg,
    //     "CreatedDate": new Date(),
    //     "Read_Index": "R",
    //     "Status": "Y",
    //     "SmsWay": "S"
    //   }

    //   this.service.sendMessage(this.conObj).subscribe((data: string) => {
    //     console.log(data);
    //     if (data == "Done") {
    //       this.selectedConversation.Mesg_Body=this.conObj.Mesg_Body;
    //       this.selectedConversation.CreatedDate=this.conObj.CreatedDate;
    //       this.messagesBindingArray.push(this.conObj);
    //     }
    //     this.wbSocket.sendData(this.conObj);
    //   });
    //   console.log(this.conObj);
    // }
  }
  endConv(conv: any) {
    // console.log(conv);
    // this.conObj = {
    //   "Con_Id": conv.Con_Id,
    //   "To_Number": "",
    //   "From_Number": "",
    //   "User_FrendName": "",
    //   "Twilio_Identity": "",
    //   "Mesg_Body": "",
    //   "CreatedDate": "",
    //   "Read_Index": "",
    //   "Status": "N",
    //   "SmsWay": ""
    // }

    // for (let i = 0; i < this.conversations.length; i++) {
    //   if (conv.Con_Id == this.conversations[i].Con_Id) {
    //     this.first = this.conversations[i];
    //     this.conversations.splice(i, 1);
    //     this.archiveData.unshift(this.first);
    //     // this.selectedConversation=this.conversations[0];
    //     // this.getAllMessages(this.selectedConversation);
    //     this.service.changeMessage(this.conObj).subscribe((data: any) => {
    //       console.log(data);
    //     });
    //   }
    //   console.log(this.archiveData);
    // }
    // if (this.conversations.length == 0) {
    //   this.messagesBindingArray = [];
    //   this.selectedConversation = null;
    // }

  }
}
