import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCodigoTransitoComponent } from './list-codigo-transito.component';

describe('ListCodigoTransitoComponent', () => {
  let component: ListCodigoTransitoComponent;
  let fixture: ComponentFixture<ListCodigoTransitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCodigoTransitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCodigoTransitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
