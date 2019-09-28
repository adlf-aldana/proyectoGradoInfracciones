import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultasRegistradasComponent } from './multas-registradas.component';

describe('MultasRegistradasComponent', () => {
  let component: MultasRegistradasComponent;
  let fixture: ComponentFixture<MultasRegistradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultasRegistradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultasRegistradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
