import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AstronautService } from '../../services/astronaut.service';

@Component({
  selector: 'app-add-person-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>person_add</mat-icon>
      Add New Astronaut
    </h2>

    <mat-dialog-content>
      <form [formGroup]="form" class="person-form">
        <mat-form-field appearance="outline">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. John Smith">
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        @if (errorMessage()) {
          <div class="error-message">
            <mat-icon>error</mat-icon>
            {{ errorMessage() }}
          </div>
        }
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="form.invalid || saving()">
        @if (saving()) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          <span>Add Astronaut</span>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #00f0ff;
      margin: 0;
      padding: 16px 24px;
      background: rgba(0, 240, 255, 0.1);
      border-bottom: 1px solid rgba(0, 240, 255, 0.3);

      mat-icon {
        color: #00f0ff;
      }
    }

    mat-dialog-content {
      padding: 24px !important;
      background: #0a0e17;
    }

    .person-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 350px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      font-size: 14px;
      padding: 8px 12px;
      background: rgba(244, 67, 54, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(244, 67, 54, 0.3);

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
      background: rgba(0, 240, 255, 0.05);
      border-top: 1px solid rgba(0, 240, 255, 0.2);
    }

    button[mat-raised-button] {
      background: linear-gradient(135deg, #00f0ff, #b366ff) !important;
      min-width: 120px;

      mat-spinner {
        display: inline-block;
      }
    }
  `]
})
export class AddPersonDialogComponent {
  form: FormGroup;
  saving = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddPersonDialogComponent>,
    private astronautService: AstronautService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.errorMessage.set('');
    const name = this.form.value.name.trim();

    this.astronautService.createPerson(name).subscribe({
      next: (response) => {
        this.saving.set(false);
        if (response.success) {
          this.dialogRef.close(name);
        } else {
          this.errorMessage.set(response.message || 'Failed to create astronaut');
        }
      },
      error: (err) => {
        this.saving.set(false);
        // API returns 400 for duplicate names
        if (err.status === 400) {
          this.errorMessage.set('An astronaut with this name already exists');
        } else {
          this.errorMessage.set('Failed to create astronaut. Please try again.');
        }
      }
    });
  }
}
