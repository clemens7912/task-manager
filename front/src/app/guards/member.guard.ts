import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BoardService } from '../services/board.service';
import { AlertService } from '../shared/services/alert.service';
import { catchError, map, of } from 'rxjs';

export const memberGuard: CanActivateFn = (route, state) => {
  const boardId = route.params['id'];
  const alert = inject(AlertService);
  const router = inject(Router);

  return inject(BoardService).checkBoardMembership(boardId).pipe(
    map(() => true),
    catchError((err) => {
      alert.open({
        message: err.message,
        options: { level: 'danger' }
      });
      return of(router.parseUrl('/'));
    })
  );
  
};
