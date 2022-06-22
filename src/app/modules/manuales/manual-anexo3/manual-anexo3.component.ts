import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-anexo3',
  templateUrl: './manual-anexo3.component.html',
  styleUrls: ['./manual-anexo3.component.scss']
})
export class ManualAnexo3Component implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }

}
