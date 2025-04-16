import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DivisionService } from '../services/division.service';
import { Division } from '../models/division.model';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-create-division-dialog',
  templateUrl: './create-division.component.html',
  styleUrls: ['./create-division.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule
  ]
})
export class CreateDivisionDialogComponent implements OnInit {
  private modalService = inject(NzModalService);
  divisionForm!: FormGroup;
  isSubmitting = false;
  divisions: Division[] = [];

  constructor(
    private fb: FormBuilder,
    private divisionService: DivisionService,
    private modal: NzModalRef,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadDivisions();
    this.initForm();
  }

  loadDivisions(): void {
    this.divisionService.getDivisions().subscribe({
      next: (data) => {
        this.divisions = data;
      },
      error: (error) => {
        console.error('Error fetching divisions:', error);
      }
    });
  }

  initForm(): void {
    this.divisionForm = this.fb.group({
      name: ['', [Validators.required]],
      ambassador: [null],
      upper_division_id: [null]
    });
  }

  onUpperDivisionChange(divisionId: number): void {
    if (divisionId) {
      const selectedDivision = this.divisions.find(d => d.id === divisionId);
      if (selectedDivision) {

        this.divisionForm.patchValue({
          level: selectedDivision.level + 1
        });
      }
    }
  }

  submitForm(): void {
    if (this.divisionForm.valid) {
      this.isSubmitting = true;
      
      const formData = this.divisionForm.value;
      
      this.divisionService.createDivision(formData).subscribe({
        next: (response) => {
          this.message.success('División creada exitosamente');
          this.modal.close(response);
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error creating division:', error);
          this.message.error('Error al crear la división');
          this.isSubmitting = false;
        }
      });
    } else {
      Object.values(this.divisionForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancel(): void {
    this.modal.close();
  }
}