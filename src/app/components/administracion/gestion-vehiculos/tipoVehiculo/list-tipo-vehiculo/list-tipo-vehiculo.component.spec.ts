import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipoVehiculoComponent } from './list-tipo-vehiculo.component';

describe('ListTipoVehiculoComponent', () => {
  let component: ListTipoVehiculoComponent;
  let fixture: ComponentFixture<ListTipoVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTipoVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipoVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
