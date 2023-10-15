import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  constructor() {}

  parse(content: string): { valid: boolean; content?: object } {
    try {
      const object = JSON.parse(content);
      return { valid: true, content: object };
    } catch (error) {
      return { valid: false };
    }
  }
}
