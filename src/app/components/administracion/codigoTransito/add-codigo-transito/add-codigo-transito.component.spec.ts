import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCodigoTransitoComponent } from './add-codigo-transito.component';

describe('AddCodigoTransitoComponent', () => {
  let component: AddCodigoTransitoComponent;
  let fixture: ComponentFixture<AddCodigoTransitoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCodigoTransitoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCodigoTransitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
