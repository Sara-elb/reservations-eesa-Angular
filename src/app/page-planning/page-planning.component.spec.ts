import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePlanningComponent } from './page-planning.component';

describe('PagePlanningComponent', () => {
  let component: PagePlanningComponent;
  let fixture: ComponentFixture<PagePlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagePlanningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
