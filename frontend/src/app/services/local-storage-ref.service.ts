import { Injectable } from '@angular/core';

function getLocalStorage(): Storage {
  return localStorage;
}

// Source: https://blog.briebug.com/blog/managing-local-storage-in-angular
@Injectable({
  providedIn: 'root',
})
export class LocalStorageRefService {
  get localStorage(): Storage {
    return getLocalStorage();
  }
}
