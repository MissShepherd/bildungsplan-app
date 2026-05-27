import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LernortOverview } from './lernort-overview';

describe('LernortOverview', () => {
  let component: LernortOverview;
  let fixture: ComponentFixture<LernortOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LernortOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LernortOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
