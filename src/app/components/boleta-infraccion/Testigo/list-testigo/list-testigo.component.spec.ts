import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTestigoComponent } from './list-testigo.component';

describe('ListTestigoComponent', () => {
  let component: ListTestigoComponent;
  let fixture: ComponentFixture<ListTestigoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTestigoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTestigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
