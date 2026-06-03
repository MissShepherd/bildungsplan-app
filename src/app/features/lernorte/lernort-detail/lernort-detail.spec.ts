import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { LernortDetail } from './lernort-detail';

describe('LernortDetail', () => {
  let component: LernortDetail;
  let fixture: ComponentFixture<LernortDetail>;

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
      imports: [LernortDetail],
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

    fixture = TestBed.createComponent(LernortDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});