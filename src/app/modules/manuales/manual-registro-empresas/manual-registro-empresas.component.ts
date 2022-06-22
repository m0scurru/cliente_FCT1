import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-registro-empresas',
  templateUrl: './manual-registro-empresas.component.html',
  styleUrls: ['./manual-registro-empresas.component.scss']
})
export class ManualRegistroEmpresasComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
