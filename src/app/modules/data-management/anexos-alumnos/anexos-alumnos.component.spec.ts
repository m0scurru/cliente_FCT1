import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnexosAlumnosComponent } from './anexos-alumnos.component';

describe('AnexosAlumnosComponent', () => {
  let component: AnexosAlumnosComponent;
  let fixture: ComponentFixture<AnexosAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnexosAlumnosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnexosAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
