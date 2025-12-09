import { Routes } from '@angular/router';
import { PeopleListComponent } from './components/people-list/people-list.component';
import { AstronautDetailComponent } from './components/astronaut-detail/astronaut-detail.component';

export const routes: Routes = [
  { path: '', component: PeopleListComponent },
  { path: 'astronaut/:name', component: AstronautDetailComponent },
  { path: '**', redirectTo: '' }
];
