import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-historial-anexos',
  templateUrl: './manual-historial-anexos.component.html',
  styleUrls: ['./manual-historial-anexos.component.scss']
})
export class ManualHistorialAnexosComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  CloseModal(){
    this.modalActive.dismiss();
  }

}
