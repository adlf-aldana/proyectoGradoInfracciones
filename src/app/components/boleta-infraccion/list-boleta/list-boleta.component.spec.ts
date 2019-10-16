import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBoletaComponent } from './list-boleta.component';

describe('ListBoletaComponent', () => {
  let component: ListBoletaComponent;
  let fixture: ComponentFixture<ListBoletaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBoletaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
