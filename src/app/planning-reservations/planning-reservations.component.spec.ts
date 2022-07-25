import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningReservationsComponent } from './planning-reservations.component';

describe('PlanningReservationsComponent', () => {
  let component: PlanningReservationsComponent;
  let fixture: ComponentFixture<PlanningReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
