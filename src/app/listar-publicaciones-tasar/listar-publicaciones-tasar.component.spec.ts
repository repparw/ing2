import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPublicacionesTasarComponent } from './listar-publicaciones-tasar.component';

describe('ListarPublicacionesTasarComponent', () => {
  let component: ListarPublicacionesTasarComponent;
  let fixture: ComponentFixture<ListarPublicacionesTasarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPublicacionesTasarComponent]
    });
    fixture = TestBed.createComponent(ListarPublicacionesTasarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
