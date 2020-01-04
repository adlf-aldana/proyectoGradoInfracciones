import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarcaVehiculoComponent } from './add-marca-vehiculo.component';

describe('AddMarcaVehiculoComponent', () => {
  let component: AddMarcaVehiculoComponent;
  let fixture: ComponentFixture<AddMarcaVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarcaVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarcaVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
