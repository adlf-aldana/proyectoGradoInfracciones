import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMarcaVehiculoComponent } from './list-marca-vehiculo.component';

describe('ListMarcaVehiculoComponent', () => {
  let component: ListMarcaVehiculoComponent;
  let fixture: ComponentFixture<ListMarcaVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMarcaVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMarcaVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
