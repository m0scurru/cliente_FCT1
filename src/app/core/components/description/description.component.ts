import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {
  public title : string;

  constructor() {
    this.title="Gestión FCT";
  }

  ngOnInit(): void {
  }

}
