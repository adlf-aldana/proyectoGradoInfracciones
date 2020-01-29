import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoInfraccionesComponent } from './codigo-infracciones.component';

describe('CodigoInfraccionesComponent', () => {
  let component: CodigoInfraccionesComponent;
  let fixture: ComponentFixture<CodigoInfraccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodigoInfraccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoInfraccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
