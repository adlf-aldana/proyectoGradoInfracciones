import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroVehiculosInfraccionadosComponent } from './registro-vehiculos-infraccionados.component';

describe('RegistroVehiculosInfraccionadosComponent', () => {
  let component: RegistroVehiculosInfraccionadosComponent;
  let fixture: ComponentFixture<RegistroVehiculosInfraccionadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroVehiculosInfraccionadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroVehiculosInfraccionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
