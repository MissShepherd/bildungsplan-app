import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ModulDetail } from './modul-detail';

describe('ModulDetail', () => {
  let component: ModulDetail;
  let fixture: ComponentFixture<ModulDetail>;

  const activatedRouteMock = {
    snapshot: {
      paramMap: convertToParamMap({ id: '1' }),
      params: { id: '1' },
    },
    paramMap: of(convertToParamMap({ id: '1' })),
    params: of({ id: '1' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModulDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});