import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveFilterChipsComponent } from './active-filter-chips';

describe('ActiveFilterChipsComponent', () => {
  let component: ActiveFilterChipsComponent;
  let fixture: ComponentFixture<ActiveFilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveFilterChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveFilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});