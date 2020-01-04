import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapaComponent } from './add-mapa.component';

describe('AddMapaComponent', () => {
  let component: AddMapaComponent;
  let fixture: ComponentFixture<AddMapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMapaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
