import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFirmaComponent } from './modal-firma.component';

describe('ModalFirmaComponent', () => {
  let component: ModalFirmaComponent;
  let fixture: ComponentFixture<ModalFirmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFirmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
