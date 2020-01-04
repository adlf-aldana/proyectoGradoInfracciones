import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCargoComponent } from './add-cargo.component';

describe('AddCargoComponent', () => {
  let component: AddCargoComponent;
  let fixture: ComponentFixture<AddCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
