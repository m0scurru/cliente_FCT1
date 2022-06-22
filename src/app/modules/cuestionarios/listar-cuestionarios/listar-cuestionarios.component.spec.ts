import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCuestionariosComponent } from './listar-cuestionarios.component';

describe('ListarCuestionariosComponent', () => {
  let component: ListarCuestionariosComponent;
  let fixture: ComponentFixture<ListarCuestionariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarCuestionariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarCuestionariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
