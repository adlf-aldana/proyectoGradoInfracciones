import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMapaComponent } from './list-mapa.component';

describe('ListMapaComponent', () => {
  let component: ListMapaComponent;
  let fixture: ComponentFixture<ListMapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMapaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
