import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment.local';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authReq = req.clone({
    setHeaders:{
      Authorization: `Bearer ${environment.apiKey}`
    }
  })
  return next(authReq);
};
