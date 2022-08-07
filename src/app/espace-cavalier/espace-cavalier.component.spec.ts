import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceCavalierComponent } from './espace-cavalier.component';

describe('EspaceCavalierComponent', () => {
  let component: EspaceCavalierComponent;
  let fixture: ComponentFixture<EspaceCavalierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspaceCavalierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceCavalierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
