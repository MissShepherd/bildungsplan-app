import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfzPage } from './efz-page';

describe('EfzPage', () => {
  let component: EfzPage;
  let fixture: ComponentFixture<EfzPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EfzPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfzPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
