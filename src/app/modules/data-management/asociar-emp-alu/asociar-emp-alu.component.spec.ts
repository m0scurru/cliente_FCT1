import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociarEmpAluComponent } from './asociar-emp-alu.component';

describe('AsociarEmpAluComponent', () => {
  let component: AsociarEmpAluComponent;
  let fixture: ComponentFixture<AsociarEmpAluComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsociarEmpAluComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociarEmpAluComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
