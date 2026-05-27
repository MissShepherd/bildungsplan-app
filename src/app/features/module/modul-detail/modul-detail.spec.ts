import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulDetail } from './modul-detail';

describe('ModulDetail', () => {
  let component: ModulDetail;
  let fixture: ComponentFixture<ModulDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
