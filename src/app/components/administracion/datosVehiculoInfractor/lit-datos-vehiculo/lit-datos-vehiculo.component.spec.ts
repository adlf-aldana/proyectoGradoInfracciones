import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LitDatosVehiculoComponent } from './lit-datos-vehiculo.component';

describe('LitDatosVehiculoComponent', () => {
  let component: LitDatosVehiculoComponent;
  let fixture: ComponentFixture<LitDatosVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LitDatosVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LitDatosVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
