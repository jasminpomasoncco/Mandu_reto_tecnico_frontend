import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDivisionDialogComponent } from './create-division.component';

describe('CreateDivisionComponent', () => {
  let component: CreateDivisionDialogComponent;
  let fixture: ComponentFixture<CreateDivisionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDivisionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDivisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
