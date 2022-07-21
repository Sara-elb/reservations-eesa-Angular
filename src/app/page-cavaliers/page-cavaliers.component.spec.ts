import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCavaliersComponent } from './page-cavaliers.component';

describe('PageCavaliersComponent', () => {
  let component: PageCavaliersComponent;
  let fixture: ComponentFixture<PageCavaliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCavaliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCavaliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
