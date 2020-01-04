import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaInfraccionComponent } from './boleta-infraccion.component';

describe('BoletaInfraccionComponent', () => {
  let component: BoletaInfraccionComponent;
  let fixture: ComponentFixture<BoletaInfraccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoletaInfraccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoletaInfraccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
