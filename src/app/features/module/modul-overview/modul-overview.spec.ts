import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulOverview } from './modul-overview';

describe('ModulOverview', () => {
  let component: ModulOverview;
  let fixture: ComponentFixture<ModulOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
