import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      console.log(err);
      const message = err.error.message || err.message || `Server error: ${err.responseText}`;
      const error = {
        message: message, 
        status: err.status
      }
      return throwError(() => error);
    })
  );
};
