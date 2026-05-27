import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HkbDetail } from './hkb-detail';

describe('HkbDetail', () => {
  let component: HkbDetail;
  let fixture: ComponentFixture<HkbDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HkbDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HkbDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
