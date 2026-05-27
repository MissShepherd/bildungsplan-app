import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LernortSelector } from './lernort-selector';

describe('LernortSelector', () => {
  let component: LernortSelector;
  let fixture: ComponentFixture<LernortSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LernortSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LernortSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
