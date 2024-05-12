import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPublicacionComponent } from './ver-publicacion.component';

describe('VerPublicacionComponent', () => {
  let component: VerPublicacionComponent;
  let fixture: ComponentFixture<VerPublicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPublicacionComponent]
    });
    fixture = TestBed.createComponent(VerPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
