import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestarCuestionarioComponent } from './contestar-cuestionario.component';

describe('ContestarCuestionarioComponent', () => {
  let component: ContestarCuestionarioComponent;
  let fixture: ComponentFixture<ContestarCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestarCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContestarCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
