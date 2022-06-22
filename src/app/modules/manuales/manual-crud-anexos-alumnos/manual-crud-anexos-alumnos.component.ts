import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-crud-anexos-alumnos',
  templateUrl: './manual-crud-anexos-alumnos.component.html',
  styleUrls: ['./manual-crud-anexos-alumnos.component.scss']
})
export class ManualCrudAnexosAlumnosComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
  }

CloseModal(){
  this.modalActive.dismiss();
}

}
