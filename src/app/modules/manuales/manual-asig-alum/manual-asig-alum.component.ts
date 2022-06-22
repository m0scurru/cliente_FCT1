import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-asig-alum',
  templateUrl: './manual-asig-alum.component.html',
  styleUrls: ['./manual-asig-alum.component.scss']
})
export class ManualAsigAlumComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
