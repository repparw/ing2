import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContraPerfilComponent } from './cambiar-contra-perfil.component';

describe('CambiarContraPerfilComponent', () => {
  let component: CambiarContraPerfilComponent;
  let fixture: ComponentFixture<CambiarContraPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambiarContraPerfilComponent]
    });
    fixture = TestBed.createComponent(CambiarContraPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
