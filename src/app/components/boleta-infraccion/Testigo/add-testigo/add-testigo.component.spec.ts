import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestigoComponent } from './add-testigo.component';

describe('AddTestigoComponent', () => {
  let component: AddTestigoComponent;
  let fixture: ComponentFixture<AddTestigoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTestigoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
