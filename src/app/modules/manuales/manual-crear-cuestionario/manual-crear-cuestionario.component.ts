import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-asig-alum',
  templateUrl: './manual-crear-cuestionario.component.html',
  styleUrls: ['./manual-crear-cuestionario.component.scss']
})
export class ManualCrearCuestionario implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
