import { Component, Input, OnInit } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {
  @Input() content: any;

  ngOnInit(): void {}

  closeResult = '';

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}
}
