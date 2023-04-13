import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  constructor() { }

  hubConnection!: signalR.HubConnection;
  startConnection=()=>{
    this.hubConnection=new signalR.HubConnectionBuilder()
    .withUrl(environment.actionHubUrl,{
      skipNegotiation:true,
      transport:signalR.HttpTransportType.WebSockets
    })
    .build();
    this.hubConnection.start().then(()=>{
      console.log("Hub Connection Started!");
    })
    .catch(err=>console.log('Error while starting connection:'+err))
  }

  // askServer(){
  //   this.hubConnection.invoke("sendAction","hey")
  //   .catch(err=>console.error(err));
  // }

  askServerListener(){
    this.hubConnection.on("ReceiveAction",(someText)=>{
      console.log(someText);

    })
  }
}
