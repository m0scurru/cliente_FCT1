import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-gestion-alumnos',
  templateUrl: './manual-gestion-alumnos.component.html',
  styleUrls: ['./manual-gestion-alumnos.component.scss']
})
export class ManualGestionAlumnosComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
