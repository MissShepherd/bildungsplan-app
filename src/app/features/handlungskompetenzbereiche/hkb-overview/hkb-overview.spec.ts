import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HkbOverview } from './hkb-overview';

describe('HkbOverview', () => {
  let component: HkbOverview;
  let fixture: ComponentFixture<HkbOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HkbOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HkbOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
