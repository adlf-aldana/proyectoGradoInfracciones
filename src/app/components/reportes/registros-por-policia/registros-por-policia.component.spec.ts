import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrosPorPoliciaComponent } from './registros-por-policia.component';

describe('RegistrosPorPoliciaComponent', () => {
  let component: RegistrosPorPoliciaComponent;
  let fixture: ComponentFixture<RegistrosPorPoliciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrosPorPoliciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrosPorPoliciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
