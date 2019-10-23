import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLogueoComponent } from './add-logueo.component';

describe('AddLogueoComponent', () => {
  let component: AddLogueoComponent;
  let fixture: ComponentFixture<AddLogueoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLogueoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLogueoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
