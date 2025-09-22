import { AuthService } from './../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { debounceTime, distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { User } from '../../shared/models/user';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardService } from '../../services/board.service';
import { getDifferentUsers } from '../../shared/utils/utils';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-create-board',
  imports: [CommonModule, ReactiveFormsModule,  MatAutocompleteModule, MatIconModule, 
    MatDialogModule],
  templateUrl: './create-board.component.html',
  styleUrl: './create-board.component.css'
})
export class CreateBoardComponent implements OnInit{

  createBoardForm!: FormGroup;
  filteredUsers!: Observable<User[]> ;
  selectedMembers: User[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService,
                private boardService: BoardService,
                private alertService: AlertService){}

  ngOnInit(): void {
    this.createBoardForm = this.fb.group({
      name: ['', Validators.required],
      member: [''],
    });

    this.filteredUsers = this.createBoardForm.get('member')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.authService.getUsers(value)),
      map(users => getDifferentUsers(users, this.selectedMembers))
    );
  }

  get name() { return this.createBoardForm.get('name'); }
  get member() { return this.createBoardForm.get('member') }

  addMember(event:Event, user: User){
    event.preventDefault();
    this.selectedMembers.push(user);
    this.member?.setValue('');
  }

  removeMember(user: User){
    this.selectedMembers = this.selectedMembers.filter(selectedUser => selectedUser.id != user.id);
  }

  submit(event: Event){
    event.preventDefault();
    this.boardService.createBoard(this.name?.value, this.selectedMembers)
      .subscribe({
        next: (board) => {
          this.alertService.open({
            message: `Board ${board.id} created`, 
            options: {level: 'success', duration: 5}
          });

          this.createBoardForm.reset();
          this.selectedMembers = [];
          this.boardService.addBoard(board);
        },
        error: (err) => {
          this.alertService.open({
            message: String(err.message), 
            options: {level: 'danger'}
          });
        }
      })
  }

}
