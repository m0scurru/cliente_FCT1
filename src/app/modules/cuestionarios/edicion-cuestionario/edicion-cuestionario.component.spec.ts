import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicionCuestionarioComponent } from './edicion-cuestionario.component';

describe('EdicionCuestionarioComponent', () => {
  let component: EdicionCuestionarioComponent;
  let fixture: ComponentFixture<EdicionCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdicionCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdicionCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
