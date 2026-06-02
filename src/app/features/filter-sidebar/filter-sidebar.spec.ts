import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FachrichtungService } from '../../core/services/fachrichtung.service';
import { Efz } from '../../models/efz.model';
import { FilterSidebarComponent } from './filter-sidebar';

describe('FilterSidebarComponent', () => {
  let component: FilterSidebarComponent;
  let fixture: ComponentFixture<FilterSidebarComponent>;

  const efzMock = {
    id: 1,
    titel: 'Informatikerin/Informatiker',
  } as Efz;

  const fachrichtungServiceMock = {
    getByEfzId: vi.fn(() => of([])),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    fachrichtungServiceMock.getByEfzId.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [FilterSidebarComponent],
      providers: [
        {
          provide: FachrichtungService,
          useValue: fachrichtungServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select EFZ and load Fachrichtungen', () => {
    component.selectEfz(efzMock);

    expect(component.state.selectedEfz()).toEqual(efzMock);
    expect(component.state.selectedEfzId()).toBe(1);
    expect(fachrichtungServiceMock.getByEfzId).toHaveBeenCalledWith(1);
  });
});