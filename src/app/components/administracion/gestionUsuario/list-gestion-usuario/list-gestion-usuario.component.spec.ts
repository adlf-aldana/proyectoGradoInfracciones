import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGestionUsuarioComponent } from './list-gestion-usuario.component';

describe('ListGestionUsuarioComponent', () => {
  let component: ListGestionUsuarioComponent;
  let fixture: ComponentFixture<ListGestionUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGestionUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGestionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
