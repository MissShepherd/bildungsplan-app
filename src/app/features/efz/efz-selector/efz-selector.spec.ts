import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfzSelector } from './efz-selector';

describe('EfzSelector', () => {
  let component: EfzSelector;
  let fixture: ComponentFixture<EfzSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfzSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfzSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
