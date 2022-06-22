import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaDocComponent } from './firma-doc.component';

describe('FirmaDocComponent', () => {
  let component: FirmaDocComponent;
  let fixture: ComponentFixture<FirmaDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmaDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmaDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
