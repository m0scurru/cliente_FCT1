import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-gestion-empresas',
  templateUrl: './manual-gestion-empresas.component.html',
  styleUrls: ['./manual-gestion-empresas.component.scss']
})
export class ManualGestionEmpresasComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
