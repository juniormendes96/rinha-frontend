import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { CanActivateFn, Router, Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './app/home.component';
import { JsonViewerComponent } from './app/json-viewer.component';
import { inject } from '@angular/core';

const getFile = (): File | undefined => {
  const router = inject(Router);
  return (router.getCurrentNavigation()?.extras.state || {})['file'];
};

const jsonViewerGuard: CanActivateFn = () => {
  const file = getFile();
  if (!file) {
    inject(Router).navigate(['/']);
  }
  return !!file;
};

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'viewer',
    component: JsonViewerComponent,
    canActivate: [jsonViewerGuard],
    resolve: {
      file: () => getFile()
    }
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

bootstrapApplication(AppComponent, { providers: [provideRouter(routes)] });
