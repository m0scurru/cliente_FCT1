import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-gestion-gastos-profesor',
  templateUrl: './manual-gestion-gastos-profesor.component.html',
  styleUrls: ['./manual-gestion-gastos-profesor.component.scss']
})
export class ManualGestionGastosProfesorComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
