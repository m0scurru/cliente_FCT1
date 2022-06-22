import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-gestion-gastos-alumno',
  templateUrl: './manual-gestion-gastos-alumno.component.html',
  styleUrls: ['./manual-gestion-gastos-alumno.component.scss']
})
export class ManualGestionGastosAlumnoComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
