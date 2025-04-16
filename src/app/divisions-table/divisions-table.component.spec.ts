import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsTableComponent } from './divisions-table.component';

describe('DivisionsTableComponent', () => {
  let component: DivisionsTableComponent;
  let fixture: ComponentFixture<DivisionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivisionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivisionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
