import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() {}

  readFileContent(file: File): Observable<string> {
    const reader = new FileReader();
    return new Observable(observer => {
      reader.readAsText(file, 'UTF-8');
      reader.onload = event => {
        const result = event.target?.result as string;
        observer.next(result || '');
        observer.complete();
      };
      reader.onerror = () => {
        observer.error();
        observer.complete();
      };
    });
  }
}
