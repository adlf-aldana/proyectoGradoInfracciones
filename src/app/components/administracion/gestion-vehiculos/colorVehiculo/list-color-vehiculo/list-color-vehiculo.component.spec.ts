import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListColorVehiculoComponent } from './list-color-vehiculo.component';

describe('ListColorVehiculoComponent', () => {
  let component: ListColorVehiculoComponent;
  let fixture: ComponentFixture<ListColorVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListColorVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListColorVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
