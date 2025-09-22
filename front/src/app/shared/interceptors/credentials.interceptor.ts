import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedRequest = req.clone({
    withCredentials: true
  });

  return next(modifiedRequest);
};
