import { AuthService } from './../../../auth/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { InitialsPipe } from '../../pipes/initials.pipe';
import { User } from '../../models/user';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { getDifferentUsers } from '../../utils/utils';

@Component({
  selector: 'app-user-selection',
  imports: [CommonModule, MatIconModule, MatAutocompleteModule, 
    ReactiveFormsModule, InitialsPipe],
  templateUrl: './user-selection.component.html',
  styleUrl: './user-selection.component.css'
})
export class UserSelectionComponent implements OnInit{

  @Input() users!: User[];
  @Input() board: boolean = false;
  @Input() owner: boolean = false;
  @Input() phone: boolean = false;

  @Output() addUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<number>();

  filteredUsers!: Observable<User[]>;
  searchControl!: FormControl;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
      this.searchControl = new FormControl('');

      this.filteredUsers = this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => this.authService.getUsers(value!, 5)),
        map(users => getDifferentUsers(users, this.users))
      );
  }

  onAddUser(user: User){
    this.addUser.emit(user);
  }

  onDeleteUser(userId: number){
    this.deleteUser.emit(userId);
  }

}
