import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfractorComponent } from './add-infractor.component';

describe('AddInfractorComponent', () => {
  let component: AddInfractorComponent;
  let fixture: ComponentFixture<AddInfractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInfractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
