import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddColorVehiculoComponent } from './add-color-vehiculo.component';

describe('AddColorVehiculoComponent', () => {
  let component: AddColorVehiculoComponent;
  let fixture: ComponentFixture<AddColorVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddColorVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddColorVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
