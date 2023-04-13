import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeallogService } from 'src/app/core/_services/deallog/deallog.service';
import { HeaderService } from 'src/app/core/_services/header/header.service';

declare var alertify: any;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() stores: any;

  filterName: any;
  public closeleftdiv: boolean = true;
  public closeTotaldiv: boolean = true;
  storesdata: any;
  allStoresName: any = [];
  allStatuses: any = [];
  storData: any = [];
  selectedStoreData: any;
  statusData: any = [];
  dealStatus: any = [
    { id: "B", name: "Booked" },
    { id: "F", name: "Finalized" },
    { id: "D", name: "Delivered" }
  ];
  selecteddealStatus: any = '';
  selectedFilName = '';
  rangedate1: any = '';
  rangedate2: any = '';
  lastArray: any = [];
  endDate: any = '';
  startDate: any = '';
  current: any;
  duData: any = [];
  selectedDDateData: any;
  totalstatus: any = [
    { id: "Y", name: "Completed" },
    { id: "N", name: "Incomplete" }
  ];
  dealstatusdata: any = [];
  dealstatus: any = [];
  selectedStatus: any
  disableDates: any;
  storeData: any;
  hideFilters: any;
  refname: any;
  filter: any;
  open: boolean = true;
  storeset: any;
  storeid: any;
  dummy: any = [];
  dummy1: any = [];
  dummy2: any = [];
  firstname: any = '';
  fname: any = [];
  tradetypedata: any = [
    { id: "Y", name: "YES" },
    { id: "N", name: "NO" }
  ];
  tradedata: any = [];
  tradetypes: any = [];
  selectedtrade: any = '';
  dealtypedata: any = [
    { id: "NEW", name: "NEW" },
    { id: "USED", name: "USED" }
  ];
  dealdata: any = [];
  dealtypes: any = [];
  selecteddeal: any = '';
  isVisible: boolean = false;
  curentDateDisable: boolean = false;
  fandimanager: any = ''
  salesperson1: any = '';
  salesperson2: any = '';
  salesmanager: any = ''
  storename: any;
  dummy3: any = [];
  dummy4: any = [];
  datedummy: any;

  constructor(
    public activeModal: NgbActiveModal,
    public deallogserv: DeallogService,
    public headservice: HeaderService
  ) { }

  ngOnInit(): void {
    this.storeset = localStorage.getItem('storeset');
    const id = localStorage.getItem('A')
    if (this.storeset == null || this.storeset == undefined || this.storeset == '') {
      this.open = true;
    } else {
      this.open = false;
    }
    this.clickFilter('stores');
    this.headservice.getHideFilter()
      .subscribe((res: any) => {
        if (res.hide == '') {
          this.hideFilters = 'Y'
        } else {
          this.hideFilters = res;
        }
      });

    this.headservice.getHideFilter()
      .subscribe((res: any) => {
        if (res.hide == '') {
          this.hideFilters = 'N'
          this.clickFilter('stores');
          this.statusData = [];
          this.duData = [];
          this.dealstatusdata = [];
        } else {
          this.hideFilters = res;
          this.clickFilter('stores');
          this.statusData = [];
          this.duData = [];
          this.dealstatusdata = [];
        }
      });

    let data = this.stores[0];
    this.storesdata = data.stores;
    var today = new Date()
    const M = ["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
     const date = today.getDate();
     const dateLength = date.toString().length;
      if (dateLength == 1) {
        this.disableDates = today.getFullYear() + '-' + M[today.getMonth()] + '-' +'0'+ today.getDate();
      }else{
        this.disableDates = today.getFullYear() + '-' + M[today.getMonth()] + '-' + today.getDate();
      }
    console.log(this.disableDates);

    if (id == '') {
      this.clkFilter('stores');
      if (this.filter = 'stores') {
        let dummy = localStorage.getItem('storeSetupid');
        if (dummy == null || dummy == '') {
          this.storeid = 'stores';
        } else {
          this.storeid = dummy
        }
      }
      this.clickFilter('status');
      if (this.filterName == 'status') {
        this.selectedItems('A');
      }
      this.clickFilter('checked');
      if (this.filterName == 'checked') {
        this.selectedItems('N')
      }

      this.clickFilter('tradetype');
      if (this.filterName == 'tradetype') {
        this.selectedItems('A')
      }
      this.clickFilter('dealtype');
      if (this.filterName == 'dealtype') {
        this.selectedItems('A')
      }
      this.clickFilter('stores');
      if (this.filterName == 'stores') {
        this.selectedItems('allStores');
      }
    }
    else {
      this.clickFilter('status');
      if (this.filterName == 'status') {
        const dealst: any = localStorage.getItem('dealstatus');
        this.selecteddealStatus = dealst;
        let dummy = dealst.replace(/'/g, "");
        const splitData = dummy.split(',');
        this.statusData = splitData.filter((e:any)=>e !== '');
        if (this.dealStatus.length == this.statusData.length) {
          this.allStatuses = 'A';
        }
      }

      this.clickFilter('checked');
      if (this.filterName == 'checked') {
        const dealst: any = localStorage.getItem('complete');
        this.selectedStatus = dealst;
        let dummy = dealst.replace(/'/g, "");
        const splitData = dummy.split(',');
        this.dealstatusdata = splitData.filter((e:any)=>e !== '');
        if (this.dealstatusdata.length == this.totalstatus.length) {
          this.dealstatus = 'A';
        }
      }
      this.clickFilter('range');
      if (this.filterName == 'range') {
        const month1 = localStorage.getItem('month1');
        const month2 = localStorage.getItem('month2');
        const date1 = localStorage.getItem('date1');
        const date2 = localStorage.getItem('date2');
        if (month1 != '' || month1 != null) {
          this.isVisible = true;
          this.curentDateDisable = false;
          this.startDate = month1;
          this.selectedDDateData = this.startDate;
          this.endDate = month2;
        } if (month1 == null) {
          this.isVisible = false;
        }

        if (date1 == null) {
          this.curentDateDisable = false;
        } else if (date1 != '' || date1 != null) {
          this.isVisible = false;
          this.curentDateDisable = true;
          this.rangedate1 = date1;
          this.selectedDDateData = date1;
          this.rangedate2 = date2;
        }
      }

      this.clickFilter('tradetype');
      if (this.filterName == 'tradetype') {
        const dealst: any = localStorage.getItem('trade');
        this.selectedtrade = dealst;
        let dummy = dealst.replace(/'/g, "");
        const splitData = dummy.split(',');
        this.tradedata = splitData.filter((e:any)=>e !== '');
        if (this.tradedata.length == this.tradetypedata.length) {
          this.tradetypes = 'A';
        }
      }

      this.clickFilter('dealtype');
      if (this.filterName == 'dealtype') {
        const dealst: any = localStorage.getItem('dealtype');
        this.selecteddeal = dealst;
        let dummy = dealst.replace(/'/g, "");
        const splitData = dummy.split(',');
        this.dealdata = splitData.filter((e:any)=>e !== '');
        if (this.dealdata.length == this.dealtypedata.length) {
          this.dealtypes = 'A';
        }
      }
      this.clickFilter('firstname');
      if (this.filterName == 'firstname') {
        const dealst: any = localStorage.getItem('firstname');
        this.firstname = dealst;
      }

      this.clickFilter('salesperson1');
      if (this.filterName == 'salesperson1') {
        const dealst: any = localStorage.getItem('salesperson1');
        this.salesperson1 = dealst;
      }

      this.clickFilter('salesperson2');
      if (this.filterName == 'salesperson2') {
        const dealst: any = localStorage.getItem('salesperson2');
        this.salesperson2 = dealst;
      }

      this.clickFilter('f&imanager');
      if (this.filterName == 'f&imanager') {
        const dealst: any = localStorage.getItem('f&imanager');
        this.fandimanager = dealst;
      }

      this.clickFilter('salesmanager');
      if (this.filterName == 'salesmanager') {
        const dealst: any = localStorage.getItem('salesmanager');
        this.salesmanager = dealst;
      }
      this.clickFilter('stores');
      if (this.filterName == 'stores') {
        const dealst: any = localStorage.getItem('storesid');
        this.selectedStoreData = dealst;
        let dummy = dealst.replace(/'/g, "");
        const splitData = dummy.split(',');
        this.storData= splitData.filter((e:any)=>e !== '');
        console.log(this.storData);

        if (this.storData.length == this.storesdata.length) {
          this.allStoresName = 'allStores';
        }
      }
    }
  }

  // CLICKFILTER FOR LEFT SIDE FILTERS...
  clickFilter(value: any) {
    this.filterName = value;

    if (this.filterName == 'stores') {
      this.selectedFilName = 'Stores';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'status') {
      this.selectedFilName = 'Deal Status';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'range') {
      this.selectedFilName = 'Deal Date';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'checked') {
      this.selectedFilName = 'Complete / Incomplete';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'tradetype') {
      this.selectedFilName = 'Trade Type ';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'firstname') {
      this.selectedFilName = 'First Name';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'salesperson1') {
      this.selectedFilName = 'Sales Person 1';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'salesperson2') {
      this.selectedFilName = 'Sales Person 2';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'f&imanager') {
      this.selectedFilName = 'F&I Manager';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'salesmanager') {
      this.selectedFilName = 'Sales Manager';
      this.closeleftdiv = true;
    }
    if (this.filterName == 'dealtype') {
      this.selectedFilName = 'Deal Type';
      this.closeleftdiv = true;
    }
  }

  // CLEAR ALL DATA FOR FILTERS...
  clearAllData() {
    alertify.confirm('Confirmation...!', 'Do you want to store default filters.', () => {
      this.deallogserv.setFilterRef({ data: '' });
      this.activeModal.close();
    }, function () { })
      .set({ transition: 'zoom', 'movable': false, 'closable': false, 'labels': { ok: 'Yes', cancel: 'No' } });

  }

  // CURRRENT MONTH FUNCTION FOR DATE FILTER...
  currentMonth(value: any) {
    this.isVisible = !this.isVisible;
    if (this.isVisible == true) {
      this.current = value;
      const date = new Date();
      const M = ["01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"];
      this.endDate = date.getFullYear() + '-' + M[date.getMonth()] + '-' + date.getDate();
      this.startDate = date.getFullYear() + '-' + M[date.getMonth()] + '-' + '01';
      this.selectedDDateData = this.startDate;
      this.rangedate1 = '';
      this.rangedate2 = '';
    }
    else {
      this.selectedDDateData = '';
      this.rangedate1 = '';
      this.rangedate2 = '';
    }
  }

  // SELECTED FILTERS FUNCTION....
  selectedItems(value: any) {
    if (this.filterName == 'stores') {
      if (value == 'allStores') {
        this.refname = value;
        const check = this.allStoresName.includes(value);
        if (check == false) {
          this.storData = [];
          this.allStoresName.push(value);
          for (let a = 0; a < this.storesdata.length; a++) {
            this.storData.push(this.storesdata[a].id);
          }
        }
        else {
          this.allStoresName = [];
          this.storData = [];
        }
      }
      else {
        const check = this.storData.includes(value);
        // // alert(check);
        if (check == false) {
        // // alert(this.storeData)
          this.storData.push(value);
          console.log(this.storData);
        } else {
          this.allStoresName = [];
          this.storData.forEach((element: any, index: any) => {
            if (element == value) this.storData.splice(index, 1);
          });
        }
        if (this.storesdata.length == this.storData.length) {
          this.selectedItems('allStores');
        }
      }
      this.selectedStoreData = this.storData.toString();
    }

    if (this.filterName == 'status') {
      if (value == 'A') {
        const check = this.allStatuses.includes(value);
        if (check == false) {
          this.statusData = [];
          this.allStatuses.push(value);
          for (let a = 0; a < this.dealStatus.length; a++) {
            this.statusData.push(this.dealStatus[a].id);
          }
        }
        else {
          this.allStatuses = [];
          this.statusData = [];
        }
      }
      else {
        this.allStatuses = [];
        const check = this.statusData.includes(value);
        if (check == false) {
          this.statusData.push(value);
        } else {
          this.statusData.forEach((element: any, index: any) => {
            if (element == value) this.statusData.splice(index, 1);
          });
        }
        if (this.dealStatus.length == this.statusData.length) {
         this.selectedItems('A');
        }
      }
      const statusarray: any = [];
      for (let i = 0; i < this.statusData.length; i++) {
        statusarray.push("'" + this.statusData[i] + "'");
      }
      this.selecteddealStatus = statusarray.toString();
    }

    if (this.filterName == 'range') {
      this.curentDateDisable = !this.curentDateDisable;
      if (this.curentDateDisable == true) {
        // alert(value)
        if (this.rangedate1 != '' || this.rangedate2 != '') {
          if (this.rangedate1 == '') {
            alertify.error('Please Select From-Date').dismissOthers();
            this.curentDateDisable = false;
          } else {
            this.duData = [];
            this.duData.push(value);
          }
          if (this.rangedate2 == '' ) {
            alertify.error('Please Select To-Date').dismissOthers();
            this.curentDateDisable = false;
          } else {
            this.duData = [];
            this.duData.push(value);
          }
        } else {
          alertify.error('Please Select Dates.').dismissOthers();
          this.curentDateDisable = false;
        }
        this.selectedDDateData = this.duData.toString();
      }
      else {
        this.selectedDDateData = '';
      }

    }

    if (this.filterName == 'checked') {
      if (value == 'A') {
        const check = this.dealstatus.includes(value);
        if (check == false) {
          this.dealstatusdata = [];
          this.dealstatus.push(value);
          for (let a = 0; a < this.totalstatus.length; a++) {
            this.dealstatusdata.push(this.totalstatus[a].id);
          }
        } else {
          this.dealstatus = [];
          this.dealstatusdata = [];
        }
      } else {
        this.dealstatus = [];
        const check = this.dealstatusdata.includes(value);
        if (check == false) {
          this.dealstatusdata.push(value);
          const result =  this.dealstatusdata.filter((e:any) =>  e);
          console.log(result);

        } else {
          this.dealstatusdata.forEach((element: any, index: any) => {
            if (element == value) this.dealstatusdata.splice(index, 1);
          });
        }
        if (this.totalstatus.length == this.dealstatusdata.length) {
          this.selectedItems('A');
        }
      }
      const statusarray: any = [];
      for (let i = 0; i < this.dealstatusdata.length; i++) {
        statusarray.push("'" + this.dealstatusdata[i] + "'");
      }
      this.selectedStatus = statusarray.toString();
    }

    if (this.filterName == 'tradetype') {
      if (value == 'A') {
        const check = this.tradetypes.includes(value);
        if (check == false) {
          this.tradedata = [];
          this.tradetypes.push(value);
          for (let a = 0; a < this.tradetypedata.length; a++) {
            this.tradedata.push(this.tradetypedata[a].id);
          }
        } else {
          this.tradetypes = [];
          this.tradedata = [];
        }
      } else {
        this.tradetypes = [];
        const check = this.tradedata.includes(value);
        if (check == false) {
          this.tradedata.push(value);
        } else {
          this.tradedata.forEach((element: any, index: any) => {
            if (element == value) this.tradedata.splice(index, 1);
          });
        }
        if (this.tradetypedata.length == this.tradedata.length) {
          this.selectedItems('A');
        }
      }
      const tradetypearray: any = [];
      for (let i = 0; i < this.tradedata.length; i++) {
        tradetypearray.push("'" + this.tradedata[i] + "'");
      }
      this.selectedtrade = tradetypearray.toString();
    }

    if (this.filterName == 'dealtype') {
      if (value == 'A') {
        const check = this.dealtypes.includes(value);
        if (check == false) {
          this.dealdata = [];
          this.dealtypes.push(value);
          for (let a = 0; a < this.dealtypedata.length; a++) {
            this.dealdata.push(this.dealtypedata[a].id);
          }
        } else {
          this.dealtypes = [];
          this.dealdata = [];
        }
      } else {
        this.dealtypes = [];
        const check = this.dealdata.includes(value);
        if (check == false) {
          this.dealdata.push(value);
        } else {
          this.dealdata.forEach((element: any, index: any) => {
            if (element == value) this.dealdata.splice(index, 1);
          });
        }
        if (this.dealtypedata.length == this.dealdata.length) {
          this.selectedItems('A')
        }
      }
      const dealtypearray: any = [];
      for (let i = 0; i < this.dealdata.length; i++) {
        dealtypearray.push("'" + this.dealdata[i] + "'");
      }
      this.selecteddeal = dealtypearray.toString();
    }
  }

  // VIEW REPORT FUNCTION FOR ALL FILTERS...
  viewReport() {
    if (this.rangedate1 == '' && this.rangedate2 == '' && this.startDate == '' && this.endDate == '') {
      this.datedummy = '';
    }
    this.lastArray = [];
    if (this.selectedStoreData != '' && this.selectedStoreData != undefined && this.selectedStoreData != null) {
      const store = 'as_Id in' + '(' + this.selectedStoreData + ')';
      localStorage.setItem('SS', this.selectedStoreData);
      this.lastArray.push(store);
    }

    if (this.selecteddealStatus != '' && this.selecteddealStatus != undefined && this.selecteddealStatus != null) {
      const status = 'dealstatus in' + '(' + this.selecteddealStatus + ')';
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + status);
      } else {
        this.lastArray.push(status);
      }
    }

    if (this.selectedDDateData != '' && this.selectedDDateData != undefined && this.selectedDDateData != null) {
      if (this.current == 'current') {
        const currentMonth = 'contractdate' + ' >= ' + "'" + this.startDate + "'" + ' and ' + 'contractdate' + ' <= ' + "'" + this.endDate + "'";
        localStorage.setItem('month1', this.startDate);
        localStorage.setItem('month2', this.endDate);
        if (this.lastArray.length != 0) {
          this.lastArray.push('and ' + currentMonth);
        } else {
          this.lastArray.push(currentMonth)
        }
        localStorage.removeItem('date1');
        this.datedummy = "Current Month";
      } else {
        if (this.rangedate1 == '') {
          const currentMonth = 'contractdate' + ' >= ' + "'" + this.startDate + "'" + ' and ' + 'contractdate' + ' <= ' + "'" + this.endDate + "'";
          localStorage.setItem('month1', this.startDate);
          localStorage.setItem('month2', this.endDate);
          if (this.lastArray.length != 0) {
            this.lastArray.push('and ' + currentMonth);
          } else {
            this.lastArray.push(currentMonth)
          }
          localStorage.removeItem('date1')
        }
        else {
          localStorage.removeItem('month1')
          const dbdate = 'contractdate' + ' >= ' + "'" + this.rangedate1 + "'" + ' and ' + 'contractdate' + ' <= ' + "'" + this.rangedate2 + "'";
          localStorage.setItem('date1', this.rangedate1);
          localStorage.setItem('date2', this.rangedate2)
          if (this.lastArray.length != 0) {
            this.lastArray.push('and ' + dbdate);
          } else {
            this.lastArray.push(dbdate);
          }
        }
        this.datedummy = this.rangedate1 + " " + "To" + " " + this.rangedate2;

      }
    }
    else {
      localStorage.removeItem('month1');
      localStorage.removeItem('date1')
    }

    if (this.selectedStatus != '' && this.selectedStatus != undefined && this.selectedStatus != null) {
      const status = 'status in' + '(' + this.selectedStatus + ')';
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + status);
      } else {
        this.lastArray.push(status);
      }
    }

    if (this.firstname != '' && this.firstname != undefined && this.firstname != null) {
      const name = "custFname like'%" + this.firstname + "%'";
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + name);
      } else {
        this.lastArray.push(name);
      }
    }

    if (this.salesperson1 != '' && this.salesperson1 != undefined && this.salesperson1 != null) {
      const name = "salesperson1 like'%" + this.salesperson1 + "%'";
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + name);
      } else {
        this.lastArray.push(name);
      }
    }

    if (this.salesperson2 != '' && this.salesperson2 != undefined && this.salesperson2 != null) {
      const name = "salesperson2 like'%" + this.salesperson2 + "%'";
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + name);
      } else {
        this.lastArray.push(name);
      }
    }

    if (this.fandimanager != '' && this.fandimanager != undefined && this.fandimanager != null) {
      const name = "fimgr1 like'%" + this.fandimanager + "%'";
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + name);
      } else {
        this.lastArray.push(name);
      }
    }

    if (this.salesmanager != '' && this.salesmanager != undefined && this.salesmanager != null) {
      const name = "salesmgr like'%" + this.salesmanager + "%'";
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + name);
      } else {
        this.lastArray.push(name);
      }
    }

    if (this.selectedtrade != '' && this.selectedtrade != undefined && this.selectedtrade != null) {
      const trade = 'trade in' + '(' + this.selectedtrade + ')';
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + trade);
      } else {
        this.lastArray.push(trade);
      }
    }

    if (this.selecteddeal != '' && this.selecteddeal != undefined && this.selecteddeal != null) {
      const deal = 'dealtype in' + '(' + this.selecteddeal + ')';
      if (this.lastArray.length != 0) {
        this.lastArray.push('and ' + deal);
      } else {
        this.lastArray.push(deal);
      }
    }
    localStorage.setItem('storesid', this.selectedStoreData);
    localStorage.setItem('complete', this.selectedStatus);
    localStorage.setItem('dealstatus', this.selecteddealStatus)
    localStorage.setItem('dealtype', this.selecteddeal)
    localStorage.setItem('firstname', this.firstname);
    localStorage.setItem('trade', this.selectedtrade)
    localStorage.setItem('salesmanager', this.salesmanager);
    localStorage.setItem('f&imanager', this.fandimanager);
    localStorage.setItem('salesperson2', this.salesperson2);
    localStorage.setItem('salesperson1', this.salesperson1);
    if (this.storData.length == this.storesdata.length) {
      this.dummy = "All"
    }
    else {
      for (let i = 0; i < this.storData.length; i++) {
        this.storesdata.forEach((element: any) => {
          if (element.id == this.storData[i]) {
            this.dummy.push(element.name)
          }
        });
      }
    }
    if (this.statusData.length == this.dealStatus.length) {
      this.dummy1 = "All"
    }
    else {
      for (let j = 0; j < this.statusData.length; j++) {
        this.dealStatus.forEach((element: any) => {
          if (element.id == this.statusData[j]) {
            this.dummy1.push(element.name)
          }
        });
      }
    }
    if (this.dealstatusdata.length == this.totalstatus.length) {
      this.dummy2 = "All"
    }
    else {
      for (let j = 0; j < this.dealstatusdata.length; j++) {
        this.totalstatus.forEach((element: any) => {
          if (element.id == this.dealstatusdata[j]) {
            this.dummy2.push(element.name)
          }
        });
      }
    }
    if (this.tradedata.length == this.tradetypedata.length) {
      this.dummy3 = ""
    }
    else {
      for (let j = 0; j < this.tradedata.length; j++) {
        this.tradetypedata.forEach((element: any) => {
          if (element.id == this.tradedata[j]) {
            this.dummy3.push(element.name)
          }
        });
      }
    }
    if (this.dealdata.length == this.dealtypedata.length) {
      this.dummy4 = ""
    }
    else {
      for (let j = 0; j < this.dealdata.length; j++) {
        this.dealtypedata.forEach((element: any) => {
          if (element.id == this.dealdata[j]) {
            this.dummy4.push(element.name)
          }
        });
      }
    }
    let obj = {
      storenames: this.dummy.toString(),
      dealstatus: this.dummy1.toString(),
      complete: this.dummy2.toString(),
      trade: this.dummy3.toString(),
      dealtype: this.dummy4.toString(),
      firstname: this.firstname,
      salesperson1: this.salesperson1,
      salesperson2: this.salesperson2,
      fandiManager: this.fandimanager,
      salesmanager: this.salesmanager,
      date: this.datedummy
    }
    localStorage.setItem('final', JSON.stringify(obj))
    var FinalData = '';
    if (this.lastArray.length == 0) {
      alertify.error("You Have Not Apply Any Filters..!").dismissOthers();
      FinalData = this.lastArray.join(' ');
    } else {
      FinalData = this.lastArray.join(' ');
      this.deallogserv.setFilterRef(FinalData);
      this.activeModal.close();
    }
  }

  // CLOSE MODAL FUNCTION....
  closediv() {
    this.closeTotaldiv = false;
    this.activeModal.close();
  }

  // CLICKFILTER FOR STORESETUP MODAL....
  clkFilter(value: any) {
    this.filter = value;
    if (this.filter == 'stores') {
      this.closeleftdiv = true;
    }
  }

  // STORESETUP FILTERS SINGLE SELECT STORE.....
  selectedstore(id: any, name: any) {
    this.storename = name;
    localStorage.setItem('selectstorename', this.storename);
    if (id == 'stores') {
      this.storeid = 'stores';
    } else {
      this.storeid = id;
    }
  }

  // VIEW IN STORESETUP COMPONENT....
  viewstoresetup() {
    this.activeModal.close();
    localStorage.setItem('storeSetupid', this.storeid);
    this.deallogserv.setStore({ store: this.storeid, val: 1, name: this.storename });
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    // // // // alert('Ok');
    // localStorage.removeItem('A')
  }
}
