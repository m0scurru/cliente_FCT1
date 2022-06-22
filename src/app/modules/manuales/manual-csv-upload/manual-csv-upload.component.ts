import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manual-csv-upload',
  templateUrl: './manual-csv-upload.component.html',
  styleUrls: ['./manual-csv-upload.component.scss']
})
export class ManualCSVUploadComponent implements OnInit {

  constructor(
    private modalActive: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  public closeModal() {
    this.modalActive.close();
  }
}
