import { Component, Inject, Input, OnInit } from '@angular/core';
import { Card } from '../../shared/models/card';
import { MatIconModule } from '@angular/material/icon';
import { Column } from '../../shared/models/column';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { BoardService } from '../../services/board.service';
import { Tag } from '../../shared/models/tag';
import { AlertService } from '../../shared/services/alert.service';
import { UserSelectionComponent } from '../../shared/components/user-selection/user-selection.component';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-card-detail',
  imports: [MatIconModule, ReactiveFormsModule, InitialsPipe, UserSelectionComponent],
  templateUrl: './card-detail.component.html',
  styleUrl: './card-detail.component.css'
})
export class CardDetailComponent implements OnInit {
  
  card!: Card;
  column!: Column;
  availableColumns?: Column[];
  tags!: Tag[];
  tagsDropdown: boolean = false;
  usersDropdown: boolean = false;
  new: boolean = false;
  form!: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private boardService: BoardService,
              private dialogRef: MatDialogRef<CardDetailComponent>,
              private alertService: AlertService,
              private fb: FormBuilder) {

    if(data.card){
      this.card = data.card;
    }

    this.column = data.column;
    this.availableColumns = data.availableColumns;
  }

  ngOnInit(): void {
    if(!this.card){
      this.createEmptyCard();
      this.new = true; 
    }

    this.tags = this.boardService.cachedTags;

    this.form = this.fb.group({
      shortDescription: [this.card.shortDescription, Validators.required],
      columnId: [this.column.id, Validators.required],
      tags: this.fb.array(
        this.card.tags.map((tag) => this.fb.control(tag)), 
        [this.minArrayLength(1)]
      ),
      users: this.fb.array(
        this.card.users.map((user) => this.fb.control(user))
      ),
      longDescription: [this.card.longDescription],
      startDate: [this.card.startDate],
      endDate: [this.card.endDate]
    });    
  }
  get shortDescription() {return this.form.get('shortDescription')}
  get columnId() {return this.form.get('columnId') }
  get tagsForm(): FormArray {return this.form.get('tags') as FormArray};
  get selectedTags(): Tag[] {
    return this.tagsForm.controls.map(ctrl => ctrl.value as Tag);
  }
  get usersForm(): FormArray {return this.form.get('users') as FormArray};
  get selectedUsers(): User[] {
    return this.usersForm.controls.map(ctrl => ctrl.value as User);
  }

  /**
   * Custom validator for arrays. Checks that length of array is more than min
   * @param min {number} - Validator for min length in array
   */
  minArrayLength(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length >= min
          ? null
          : {
              minArrayLength: {
                requiredLength: min,
                actualLength: control.length
              }
            };
      }
      return null; // Not a FormArray, so don't validate
    };
  }

  createEmptyCard() {
    this.card = {
        tags: [],
        column: this.column,
        shortDescription: '',
        longDescription: '',
        startDate: '',
        endDate: '',
        users: []
      }
  }

  differentTags(): Tag[] {
    return this.tags.filter(a => !this.selectedTags.some(b => b.id === a.id));
  }

  addTag(tag: Tag, index: number){
    this.tagsForm.push(this.fb.control(tag));
  }

  removeSelectedTag(index: number, tag: Tag){
    this.tagsForm.removeAt(index);
  }

  onAddUser(user: User){
    this.usersForm.push(this.fb.control(user));
  }

  onDeleteUser(userId: number){
    const index = this.usersForm.controls.findIndex(control => control.value.id === userId);
    if(index !== -1){
      this.usersForm.removeAt(index);
    }
  }

  save(event: Event){
    event.preventDefault();
    this.card = {...this.card, ...this.form.value};
    this.card.column = this.availableColumns?.find((column) => column.id == this.columnId?.value);

    if(this.new){
      this.createCard();
    }else{
      this.updateCard();
    }
  }
  
  createCard(){
    this.boardService.createCard(this.card).subscribe({
      next: (card) => {
        this.dialogRef.close(card);
      },
      error: (err) => {
        this.alertService.open({
          message: String(err.message),
          options: {level: 'danger'}
        });
      }
    })
  }

  updateCard(){
    this.boardService.updateCard(this.card).subscribe({
      next: (card) => {
        this.dialogRef.close(card);
      },
      error: (err) => {
        this.alertService.open({
          message: String(err.message),
          options: {level: 'danger'}
        });
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
