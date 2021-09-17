import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataStorage } from '../models/data-storage';
import { LocalStorageRefService } from './local-storage-ref.service';

// Source: https://blog.briebug.com/blog/managing-local-storage-in-angular
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private _localStorage: Storage;

  private _dataStorage$ = new BehaviorSubject<DataStorage>({
    favoriteBooks: {},
  });
  public dataStorage$ = this._dataStorage$.asObservable();

  constructor(private _localStorageRefService: LocalStorageRefService) {
    this._localStorage = _localStorageRefService.localStorage;
  }

  setData(data: DataStorage) {
    const jsonData = JSON.stringify(data);
    this._localStorage.setItem('dataStorage', jsonData);
    this._dataStorage$.next(data);
  }

  loadData() {
    const data = JSON.parse(this._localStorage.getItem('dataStorage'));
    this._dataStorage$.next(data);
  }

  clearData() {
    this._localStorage.removeItem('dataStorage');
    this._dataStorage$.next(null);
  }

  clearAllLocalStorage() {
    this._localStorage.clear();
    this._dataStorage$.next(null);
  }
}
