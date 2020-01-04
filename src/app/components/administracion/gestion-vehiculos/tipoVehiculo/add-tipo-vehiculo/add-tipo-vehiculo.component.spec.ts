import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTipoVehiculoComponent } from './add-tipo-vehiculo.component';

describe('AddTipoVehiculoComponent', () => {
  let component: AddTipoVehiculoComponent;
  let fixture: ComponentFixture<AddTipoVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTipoVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTipoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
