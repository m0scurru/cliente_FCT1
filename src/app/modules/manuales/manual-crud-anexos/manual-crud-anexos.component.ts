import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-crud-anexos',
  templateUrl: './manual-crud-anexos.component.html',
  styleUrls: ['./manual-crud-anexos.component.scss']
})
export class ManualCrudAnexosComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  CloseModal(){
    this.modalActive.dismiss();
  }

}
