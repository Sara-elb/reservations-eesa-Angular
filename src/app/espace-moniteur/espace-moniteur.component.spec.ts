import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceMoniteurComponent } from './espace-moniteur.component';

describe('EspaceMoniteurComponent', () => {
  let component: EspaceMoniteurComponent;
  let fixture: ComponentFixture<EspaceMoniteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspaceMoniteurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceMoniteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
