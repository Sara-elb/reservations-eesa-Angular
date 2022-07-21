import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceAdministrateurComponent } from './espace-administrateur.component';

describe('EspaceAdministrateurComponent', () => {
  let component: EspaceAdministrateurComponent;
  let fixture: ComponentFixture<EspaceAdministrateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspaceAdministrateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceAdministrateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
