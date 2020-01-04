import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonalTransitoComponent } from './add-personal-transito.component';

describe('AddPersonalTransitoComponent', () => {
  let component: AddPersonalTransitoComponent;
  let fixture: ComponentFixture<AddPersonalTransitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPersonalTransitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPersonalTransitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
