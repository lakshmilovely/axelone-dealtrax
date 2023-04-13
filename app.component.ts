import { Component } from '@angular/core';
import { SignalrService } from './core/_services/SignalR/signalr.service';
import { MessageSignalRService } from './core/_services/SignalR/message-signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trax';


  constructor(public signalrService:SignalrService, public messageService:MessageSignalRService) {
  }
  ngOnInit()
  {
    // this.signalrService.startConnection();
    // setTimeout(()=>{
    //   this.signalrService.askServerListener();
    //   // this.signalrService.askServer();
    // },2000);
    // this.messageService.startConnection();
    // setTimeout(()=>{
    //   this.messageService.askServerListener1();
    // },2000);

  }

  ngOnDestory()
  {
    this.signalrService.hubConnection.off("askServerResponse")
  }
}
