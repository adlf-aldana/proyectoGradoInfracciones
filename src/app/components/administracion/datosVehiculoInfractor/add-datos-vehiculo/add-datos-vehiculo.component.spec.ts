import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDatosVehiculoComponent } from './add-datos-vehiculo.component';

describe('AddDatosVehiculoComponent', () => {
  let component: AddDatosVehiculoComponent;
  let fixture: ComponentFixture<AddDatosVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDatosVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDatosVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
