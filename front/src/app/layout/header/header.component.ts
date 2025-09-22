import { StorageService } from './../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {Router, RouterModule } from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AuthDialogComponent } from '../../auth/components/auth-dialog/auth-dialog.component';
import { User } from '../../shared/models/user';
import { AuthService } from '../../auth/services/auth.service';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { NgClass } from '@angular/common';
import { Board } from '../../shared/models/Board';
import { BoardService } from '../../services/board.service';
import { CreateBoardComponent } from '../../components/create-board/create-board.component';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, RouterModule, MatDialogModule, InitialsPipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  boards?: Board[];
  user?: User;
  showUserInfo: boolean = false;
  showSmallMenu: boolean = false;
  showBoardsDropdown: boolean = false;
  selectedBoard: number = 0;

  constructor(private dialog: MatDialog, private storageService: StorageService,
              private authService: AuthService, private boardService: BoardService,
              private router: Router){}

  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
        this.authService.refreshSession()
          .subscribe(() => {
            this.user = this.storageService.getUser();
            //Load user boards
            this.loadUserBoards();
          });
    }

    //Suscribe to logged in changes
    this.storageService.loggedInChange$
      .subscribe((loggedIn) => {
        if(!loggedIn){
          this.user = undefined;
          return;
        }

        this.user = this.storageService.getUser();
        this.loadUserBoards();
      });

    //subscribe for new board
    this.boardService.newBoard$.subscribe((board) => {
      this.boards?.push(board);
    })
   
  }

  openAuthDialog() {
    this.dialog.open(AuthDialogComponent, {
      enterAnimationDuration: 700,
      exitAnimationDuration: 400,
      panelClass: 'dialog-responsive',
      autoFocus: false
    });
  }

  openCreateBoardDialog(closeMenu: boolean = false) {
    this.dialog.open(CreateBoardComponent, {
      enterAnimationDuration: 700,
      exitAnimationDuration: 400,
      panelClass: 'dialog-responsive',
      autoFocus: false
    });

    if(closeMenu){
      this.showSmallMenu = false;
    }
  }

  logout(){
    this.authService.logout()
      .subscribe(() => {
        this.showUserInfo = false;
        this.storageService.clean();
        this.router.navigate(['/']);
      })
  }

  loadUserBoards() {
    this.boardService.getBoards()
      .subscribe({
        next: (boards) => {
          this.boards = boards;
        },
        error: (err) => {
          console.log(err.message);
        }
      });
  }

  selectBoard(index: number){
    this.selectedBoard = index;
  }
}
