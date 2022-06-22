import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-anexo2y4',
  templateUrl: './manual-anexo2y4.component.html',
  styleUrls: ['./manual-anexo2y4.component.scss']
})
export class ManualAnexo2y4Component implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  CloseModal(){
    this.modalActive.dismiss();
  }
}
