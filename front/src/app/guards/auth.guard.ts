import { inject } from '@angular/core';
import { StorageService } from './../services/storage.service';
import { CanActivateFn, Router } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';

export const authGuard: CanActivateFn = (route, state) => {
  if(!inject(StorageService).isLoggedIn()){
    inject(AlertService).open({
      message: 'Log in to navigate',
      options: {level: 'danger'}
    });
    inject(Router).navigate(['/']);
    return false;
  }
  return true;
};
