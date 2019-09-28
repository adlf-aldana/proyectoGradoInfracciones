import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPersonalTransitoComponent } from './list-personal-transito.component';

describe('ListPersonalTransitoComponent', () => {
  let component: ListPersonalTransitoComponent;
  let fixture: ComponentFixture<ListPersonalTransitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPersonalTransitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPersonalTransitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
