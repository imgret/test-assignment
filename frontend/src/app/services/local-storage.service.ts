import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataStorage } from '../models/data-storage';
import { LocalStorageRefService } from './local-storage-ref.service';

// Source: https://blog.briebug.com/blog/managing-local-storage-in-angular
// Added checking of local storage's content to constructor.
// If local storage already contains value with key 'dataStorage', then use it as initial value.
// Otherwise use object { favoriteBooks: {} } as default value.
@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private _localStorage: Storage;

  private _dataStorage$: BehaviorSubject<DataStorage>;
  public dataStorage$: Observable<DataStorage>;

  constructor(private _localStorageRefService: LocalStorageRefService) {
    this._localStorage = _localStorageRefService.localStorage;
    const data = JSON.parse(this._localStorage.getItem('dataStorage'));
    const defaultData = { favoriteBooks: {} };
    this._dataStorage$ = new BehaviorSubject<DataStorage>(data ?? defaultData);
    this.dataStorage$ = this._dataStorage$.asObservable();
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
