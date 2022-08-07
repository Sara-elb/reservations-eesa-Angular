import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueReservationsComponent } from './historique-reservations.component';

describe('HistoriqueReservationsComponent', () => {
  let component: HistoriqueReservationsComponent;
  let fixture: ComponentFixture<HistoriqueReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueReservationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
