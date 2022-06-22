import { Component, OnInit } from '@angular/core';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public imgLogo: string;
  usuario;
  public email?:string;
  public dni?:string;
  public numNotificaciones:number = 0;
  public arrayNotificaciones: any = [];

  constructor
    (
      private storageUser: LoginStorageUserService,
      private notificacionesService: NotificacionesService,
    ) {
    this.imgLogo = './assets/images/logo.png';
    this.usuario = storageUser.getUser();
    this.email = this.usuario?.email;
    this.dni = this.usuario?.dni;
  }

  ngOnInit(): void {
    this.generarNotificaciones();
    this.getNotificaciones();
    this.countNotificaciones();
  }

  salir() {
    this.storageUser.removeUser();
    window.location.href = '';
  }

  public generarNotificaciones(){
    this.notificacionesService.generarNotificaciones(this.dni!, this.email!).subscribe({
      next:()=>{},
      error:(e)=>{}
    })
  }

  public getNotificaciones(){
    this.notificacionesService.getNotificacionesHeader(this.dni!, this.email!).subscribe({
      next:(response:any)=>{
        this.arrayNotificaciones = response;
      },
      error:(e)=>{}
    })
  }

  public countNotificaciones(){
    this.notificacionesService.countNotificaciones(this.dni!, this.email!).subscribe({
      next:(response:any)=>{
        this.numNotificaciones = response;
      },
      error:(e)=>{}
    })
  }
}
