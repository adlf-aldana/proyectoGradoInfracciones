import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInfractorComponent } from './list-infractor.component';

describe('ListInfractorComponent', () => {
  let component: ListInfractorComponent;
  let fixture: ComponentFixture<ListInfractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListInfractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInfractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
