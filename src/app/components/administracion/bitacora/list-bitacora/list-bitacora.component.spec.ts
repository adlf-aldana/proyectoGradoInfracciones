import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBitacoraComponent } from './list-bitacora.component';

describe('ListBitacoraComponent', () => {
  let component: ListBitacoraComponent;
  let fixture: ComponentFixture<ListBitacoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBitacoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
