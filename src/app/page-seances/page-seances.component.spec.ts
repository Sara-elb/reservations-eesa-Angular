import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSeancesComponent } from './page-seances.component';

describe('PageSeancesComponent', () => {
  let component: PageSeancesComponent;
  let fixture: ComponentFixture<PageSeancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSeancesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSeancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
