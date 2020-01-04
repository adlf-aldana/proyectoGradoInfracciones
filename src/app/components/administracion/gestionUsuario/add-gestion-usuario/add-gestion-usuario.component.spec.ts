import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGestionUsuarioComponent } from './add-gestion-usuario.component';

describe('AddGestionUsuarioComponent', () => {
  let component: AddGestionUsuarioComponent;
  let fixture: ComponentFixture<AddGestionUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGestionUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGestionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
