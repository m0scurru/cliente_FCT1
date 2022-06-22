import { Component, OnInit } from '@angular/core';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';
import { NotificacionesService } from 'src/app/services/notificaciones.service';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/core/components/header/header.component';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {
  usuario;
  public email?:string;
  public dni?:string;
  public arrayNotificaciones:any=[];
  constructor(
    private storageUser: LoginStorageUserService,
    private notificacionesService: NotificacionesService,
    private router: Router,

  ) {
    this.usuario = storageUser.getUser();
    this.email = this.usuario?.email;
    this.dni = this.usuario?.dni;
  }

  ngOnInit(): void {
    this.getNotificaciones();
  }


  public getNotificaciones(){
    this.notificacionesService.getNotificacionesHeader(this.dni!, this.email!).subscribe({
      next: (response:any) => {
        console.log(response);
        this.arrayNotificaciones = response;
      },
      error:(e) =>{

      }
    })
  }

  public cambiarEstilo(leido:number){
    var clase = "";
    if(leido == 1){
      clase = "leido";
    }
    return clase;
  }

}
