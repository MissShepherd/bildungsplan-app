import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LernortDetail } from './lernort-detail';

describe('LernortDetail', () => {
  let component: LernortDetail;
  let fixture: ComponentFixture<LernortDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LernortDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LernortDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
