import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AstronautService } from '../../services/astronaut.service';
import { PersonAstronaut, AstronautDuty } from '../../models/astronaut.models';
import { AddDutyDialogComponent } from './add-duty-dialog.component';
import { RetireDialogComponent } from './retire-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-astronaut-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './astronaut-detail.component.html',
  styleUrl: './astronaut-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AstronautDetailComponent implements OnInit {
  person = signal<PersonAstronaut | null>(null);
  duties = signal<AstronautDuty[]>([]);
  loading = signal(true);
  name = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private astronautService: AstronautService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('name') || '';
    this.loadAstronautData();
  }

  loadAstronautData(): void {
    this.loading.set(true);
    this.astronautService.getAstronautDuties(this.name).subscribe({
      next: (response) => {
        if (response.success) {
          this.person.set(response.person);
          // Sort duties by start date descending (newest first)
          const sortedDuties = response.astronautDuties.sort((a, b) =>
            new Date(b.dutyStartDate).getTime() - new Date(a.dutyStartDate).getTime()
          );
          this.duties.set(sortedDuties);
        } else {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load astronaut data', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  isRetired(): boolean {
    return this.person()?.currentDutyTitle === 'RETIRED';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openAddDutyDialog(): void {
    const dialogRef = this.dialog.open(AddDutyDialogComponent, {
      data: { name: this.name },
      panelClass: 'space-dialog'
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.snackBar.open('Duty added successfully!', 'Close', { duration: 3000 });
        this.loadAstronautData();
      }
    });
  }

  openRetireDialog(): void {
    const dialogRef = this.dialog.open(RetireDialogComponent, {
      data: {
        name: this.name,
        currentRank: this.person()?.currentRank || 'Retired'
      },
      panelClass: 'space-dialog'
    });

    dialogRef.afterClosed().subscribe((success) => {
      if (success) {
        this.snackBar.open('Astronaut retired successfully!', 'Close', { duration: 3000 });
        this.loadAstronautData();
      }
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Current';
    return new Date(dateStr).toLocaleDateString();
  }
}
