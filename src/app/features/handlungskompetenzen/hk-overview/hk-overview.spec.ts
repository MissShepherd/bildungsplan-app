import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HkOverview } from './hk-overview';

describe('HkOverview', () => {
  let component: HkOverview;
  let fixture: ComponentFixture<HkOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HkOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HkOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
