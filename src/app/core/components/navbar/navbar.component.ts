import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { LoginComponent } from 'src/app/modules/auth/login/login.component';
import { LoginStorageUserService } from 'src/app/services/login.storageUser.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  usuario:any;
  constructor(private storageUser: LoginStorageUserService) {
    this.usuario = storageUser.getUser();
    console.log(this.usuario);
    console.log(this.usuario?.isTutorEmpresa());
  }

  ngOnInit(): void {}
}
