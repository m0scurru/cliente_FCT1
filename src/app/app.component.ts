import { Component } from '@angular/core';
import { LoginStorageUserService } from './services/login.storageUser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'cliente-fct-filler';
  usuario;
  constructor(
    private storageUser: LoginStorageUserService,
  ) {
    this.usuario = storageUser.getUser();
  }
}
