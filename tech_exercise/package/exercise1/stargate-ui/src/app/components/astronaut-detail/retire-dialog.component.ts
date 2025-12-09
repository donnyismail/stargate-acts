import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AstronautService } from '../../services/astronaut.service';

@Component({
  selector: 'app-retire-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>logout</mat-icon>
      Retire Astronaut
    </h2>

    <mat-dialog-content>
      <div class="warning-message">
        <mat-icon>warning</mat-icon>
        <p>You are about to retire <strong>{{ data.name }}</strong>. This action will:</p>
        <ul>
          <li>End their current duty assignment</li>
          <li>Set their career end date</li>
          <li>Mark them as RETIRED</li>
        </ul>
        <p>This action cannot be undone.</p>
      </div>

      <form [formGroup]="form" class="retire-form">
        <mat-form-field appearance="outline">
          <mat-label>Retirement Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="retireDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          @if (form.get('retireDate')?.hasError('required') && form.get('retireDate')?.touched) {
            <mat-error>Retirement date is required</mat-error>
          }
        </mat-form-field>
      </form>

      @if (errorMessage()) {
        <div class="error-message">
          <mat-icon>error</mat-icon>
          {{ errorMessage() }}
        </div>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirm()" [disabled]="form.invalid || saving()">
        @if (saving()) {
          <mat-spinner diameter="20"></mat-spinner>
        } @else {
          <span>Confirm Retirement</span>
        }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #ff9800;
      margin: 0;
      padding: 16px 24px;
      background: rgba(255, 152, 0, 0.1);
      border-bottom: 1px solid rgba(255, 152, 0, 0.3);

      mat-icon {
        color: #ff9800;
      }
    }

    mat-dialog-content {
      padding: 24px !important;
      background: #0a0e17;
    }

    .warning-message {
      background: rgba(255, 152, 0, 0.1);
      border: 1px solid rgba(255, 152, 0, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;

      mat-icon {
        color: #ff9800;
        float: left;
        margin-right: 12px;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      p {
        margin: 0 0 8px 0;
        color: rgba(255, 255, 255, 0.9);
      }

      ul {
        margin: 8px 0;
        padding-left: 20px;
        color: rgba(255, 255, 255, 0.7);
      }

      li {
        margin: 4px 0;
      }

      strong {
        color: #00f0ff;
      }
    }

    .retire-form {
      display: flex;
      flex-direction: column;
      min-width: 400px;
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
      margin-top: 16px;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    mat-dialog-actions {
      padding: 16px 24px !important;
      background: rgba(255, 152, 0, 0.05);
      border-top: 1px solid rgba(255, 152, 0, 0.2);
    }

    button[mat-raised-button][color="warn"] {
      min-width: 150px;

      mat-spinner {
        display: inline-block;
      }
    }
  `]
})
export class RetireDialogComponent {
  form: FormGroup;
  saving = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RetireDialogComponent>,
    private astronautService: AstronautService,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; currentRank: string }
  ) {
    this.form = this.fb.group({
      retireDate: [new Date(), Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.errorMessage.set('');

    const retireDate = new Date(this.form.value.retireDate);

    this.astronautService.createAstronautDuty({
      name: this.data.name,
      rank: this.data.currentRank || 'Retired',
      dutyTitle: 'RETIRED',
      dutyStartDate: retireDate.toISOString()
    }).subscribe({
      next: (response) => {
        this.saving.set(false);
        if (response.success) {
          this.dialogRef.close(true);
        } else {
          this.errorMessage.set(response.message || 'Failed to retire astronaut');
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set('Failed to retire astronaut. Please try again.');
      }
    });
  }
}
