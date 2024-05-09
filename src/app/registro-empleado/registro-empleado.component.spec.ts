import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmpleadoComponent } from './registro-empleado.component';

describe('RegistroEmpleadoComponent', () => {
  let component: RegistroEmpleadoComponent;
  let fixture: ComponentFixture<RegistroEmpleadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroEmpleadoComponent]
    });
    fixture = TestBed.createComponent(RegistroEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
