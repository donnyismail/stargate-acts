import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Angular Material imports
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AstronautService } from '../../services/astronaut.service';
import { PersonAstronaut } from '../../models/astronaut.models';
import { AddPersonDialogComponent } from './add-person-dialog.component';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.scss'
})
export class PeopleListComponent implements OnInit {
  // Signals for reactive state
  people = signal<PersonAstronaut[]>([]);
  searchText = signal('');
  loading = signal(true);

  // Computed signals
  filteredPeople = computed(() => {
    const search = this.searchText().toLowerCase();
    if (!search) return this.people();
    return this.people().filter(p =>
      p.name.toLowerCase().includes(search) ||
      (p.currentRank?.toLowerCase().includes(search)) ||
      (p.currentDutyTitle?.toLowerCase().includes(search))
    );
  });

  activeCount = computed(() =>
    this.people().filter(p => p.currentDutyTitle && p.currentDutyTitle !== 'RETIRED').length
  );

  retiredCount = computed(() =>
    this.people().filter(p => p.currentDutyTitle === 'RETIRED').length
  );

  displayedColumns = ['name', 'currentRank', 'currentDutyTitle', 'careerStartDate', 'status'];

  constructor(
    private astronautService: AstronautService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading.set(true);
    this.astronautService.getPeople().subscribe({
      next: (response) => {
        if (response.success) {
          this.people.set(response.people);
        } else {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to connect to API', 'Close', { duration: 5000 });
        this.loading.set(false);
        this.people.set([]);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchText.set(value);
  }

  isRetired(person: PersonAstronaut): boolean {
    return person.currentDutyTitle === 'RETIRED';
  }

  onRowClick(person: PersonAstronaut): void {
    this.router.navigate(['/astronaut', person.name]);
  }

  addPerson(): void {
    const dialogRef = this.dialog.open(AddPersonDialogComponent, {
      panelClass: 'space-dialog'
    });

    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        this.snackBar.open(`Astronaut "${name}" added!`, 'Close', { duration: 3000 });
        this.loadPeople();
      }
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  }
}
