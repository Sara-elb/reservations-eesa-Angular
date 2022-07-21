import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCartesComponent } from './page-cartes.component';

describe('PageCartesComponent', () => {
  let component: PageCartesComponent;
  let fixture: ComponentFixture<PageCartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
