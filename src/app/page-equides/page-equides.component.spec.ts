import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEquidesComponent } from './page-equides.component';

describe('PageEquidesComponent', () => {
  let component: PageEquidesComponent;
  let fixture: ComponentFixture<PageEquidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageEquidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEquidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
