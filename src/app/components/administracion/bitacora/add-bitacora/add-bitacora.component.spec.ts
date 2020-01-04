import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBitacoraComponent } from './add-bitacora.component';

describe('AddBitacoraComponent', () => {
  let component: AddBitacoraComponent;
  let fixture: ComponentFixture<AddBitacoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBitacoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
