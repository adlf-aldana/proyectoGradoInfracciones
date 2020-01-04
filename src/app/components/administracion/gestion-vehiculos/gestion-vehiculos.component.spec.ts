import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVehiculosComponent } from './gestion-vehiculos.component';

describe('GestionVehiculosComponent', () => {
  let component: GestionVehiculosComponent;
  let fixture: ComponentFixture<GestionVehiculosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionVehiculosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionVehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
