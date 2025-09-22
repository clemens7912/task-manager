import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { memberGuard } from './guards/member.guard';

export const routes: Routes = [
    {
        'path': 'board/:id',
        'loadComponent': () => import('./components/board/board.component').then(c => c.BoardComponent),
        canActivate: [authGuard, memberGuard]
    },
    {
        'path': '',
        'loadComponent':  () => import('./components/home/home.component').then(c => c.HomeComponent)
    }
];
