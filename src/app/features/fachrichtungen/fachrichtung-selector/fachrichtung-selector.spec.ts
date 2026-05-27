import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FachrichtungSelector } from './fachrichtung-selector';

describe('FachrichtungSelector', () => {
  let component: FachrichtungSelector;
  let fixture: ComponentFixture<FachrichtungSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FachrichtungSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FachrichtungSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
