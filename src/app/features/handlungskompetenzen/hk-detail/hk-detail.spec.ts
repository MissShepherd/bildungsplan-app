import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HkDetail } from './hk-detail';

describe('HkDetail', () => {
  let component: HkDetail;
  let fixture: ComponentFixture<HkDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HkDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HkDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
