import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './app/home.component';
import { JsonViewerComponent } from './app/json-viewer.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viewer', component: JsonViewerComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, { providers: [provideRouter(routes)] });
