import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageSignalRService {

  constructor() { }
  hubConnection2!: signalR.HubConnection;
  startConnection=()=>{
    this.hubConnection2=new signalR.HubConnectionBuilder()
    .withUrl(environment.messageHubUrl,{
      skipNegotiation:true,
      transport:signalR.HttpTransportType.WebSockets
    })
    .build();
    this.hubConnection2.start().then(()=>{
      console.log("Message Hub Connection Started!");
    })
    .catch(err=>console.log('Error while starting connection:'+err))
  }

  // askServer(){
  //   this.hubConnection.invoke("sendAction","hey")
  //   .catch(err=>console.error(err));
  // }

  // askServerListener1(){
  //   this.hubConnection2.on("ReceiveMessage",(MId)=>{
  //     console.log(MId);

  //   })
  // }
}
