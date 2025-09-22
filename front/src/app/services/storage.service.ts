import { Injectable } from '@angular/core';
import { User } from './../shared/models/user';
import { Subject } from 'rxjs';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  loggedInChange$: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  saveUser(user: User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.loggedInChange$.next(true);
  }

  getUser(): User | undefined {
    const user = localStorage.getItem(USER_KEY);
    if(!user){
      return undefined;
    }

    return JSON.parse(user);
  }

  clean(){
    localStorage.clear();
    this.loggedInChange$.next(false);
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem(USER_KEY);
    return user ? true : false;
  }
}
