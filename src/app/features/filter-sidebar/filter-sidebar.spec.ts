import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FachrichtungService } from '../../core/services/fachrichtung.service';
import { FilterSidebarComponent } from './filter-sidebar';

describe('FilterSidebarComponent', () => {
  let component: FilterSidebarComponent;
  let fixture: ComponentFixture<FilterSidebarComponent>;

  const fachrichtungServiceMock = {
    getByEfzId: vi.fn(() => of([])),
  };

  beforeEach(async () => {
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
    component.selectEfz(1);

    expect(component.state.selectedEfzId()).toBe(1);
    expect(fachrichtungServiceMock.getByEfzId).toHaveBeenCalledWith(1);
  });
});