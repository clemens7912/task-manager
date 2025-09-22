import { StorageService } from './../../services/storage.service';
import { InitialsPipe } from './../../shared/pipes/initials.pipe';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Board } from '../../shared/models/Board';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { ColumnComponent } from "../column/column.component";
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Column } from '../../shared/models/column';
import { ColorPickerComponent } from '../../shared/components/color-picker/color-picker.component';
import { Tag } from '../../shared/models/tag';
import { User } from '../../shared/models/user';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../shared/services/alert.service';
import { UserSelectionComponent } from '../../shared/components/user-selection/user-selection.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Filters } from '../../shared/models/filters';

@Component({
  selector: 'app-board',
  imports: [CommonModule, ColumnComponent, MatIconModule, FormsModule, ColorPickerComponent,
    UserSelectionComponent, DragDropModule, InitialsPipe
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit{

  @ViewChild('columnInput') columnInput!: ElementRef;

  board?: Board;
  owner: boolean = false;
  editingColumn: boolean = true; 
  columnName: string = ''; 
  columns?: Column[];
  showTagsDropdown: boolean = false;
  tags?: Tag[];
  activeColorPicker: number = -1;
  showMembersDropdown: boolean = false;
  showFiltersDropdown: boolean = false;
  showTagsFiltersDropdown: boolean = false; 
  showUsersFiltersDropdown: boolean = false;
  showDateFiltersDropdown: boolean = false;
  filters: Filters = {};
  filterStartDate: string = '';
  filterEndDate: string = '';
  //phone variables
  showManagementMenu: boolean = false;


  constructor(private activatedRoute: ActivatedRoute,
              private boardService: BoardService,
              private authService: AuthService,
              private alertService: AlertService,
              private storageService: StorageService){}

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((params) => {
        this.loadBoard(+params.get('id')!);
        this.setInitialValues();
      });
  }

  setInitialValues() {
    this.editingColumn = true; 
    this.showTagsDropdown = false; 
    this.showMembersDropdown = false; 
  }

  loadBoard(id: number){
    this.boardService.getBoard(id).subscribe({
      next: (board) => {
        this.board = board;
        this.checkOwnership();
        this.loadColumns(this.board.id);
        this.loadTags(this.board.id);
      },
      error: (err) => {
        this.alertService.open({
          message: String(err.message), 
          options: {level: 'danger'}
        });
      }
    });
  }

  checkOwnership(){
    const userId = this.storageService.getUser()!.id;
    this.owner = this.board!.users!.some((user) => user.id == userId && user.boardUsers?.[0].boardRoles.name === 'BOARD_OWNER');
  }

  loadColumns(boardId: number){
    this.boardService.getColumns(boardId)
      .subscribe({
        next: (columns) => {
          this.columns = columns;
        },
        error: (err) => {
          this.alertService.open({
            message: String(err.message), 
            options: {level: 'danger'}
          });
        }
      })
  }

  loadTags(boardId: number){
    this.boardService.getTags(boardId)
      .subscribe({
        next: (tags) => {
          this.tags = tags;
          this.boardService.cachedTags = this.tags;
        },
        error: (err) => {
          this.alertService.open({
          message: String(err.message), 
          options: {level: 'danger'}
        });
        }
      })
  }

  startEditingColumn(){
    this.editingColumn = true;
    setTimeout(() => this.columnInput.nativeElement.focus(), 0);
  }

  createColumn() {
    if(this.columnName == ''){
      return;
    }
    this.boardService.createColumn(this.columnName, this.board!.id)
      .subscribe({
        next: (column) => {
          column['cards'] = [];
          this.columns?.push(column);
        },
        error: (err) => {
          this.alertService.open({
          message: String(err.message), 
          options: {level: 'danger'}
        });
        }
      })
    this.columnName = '';
    this.editingColumn = false;
  }

  cancel() {
    this.columnName = '';
    this.editingColumn = false; 
  }
  
  toggleColorPicker(index: number){
    //if is equal we hide it (-1). if it is not equal we show it
    this.activeColorPicker = (this.activeColorPicker == index) ? -1 : index;
  }

  onColorChange(color: string, index: number){
    this.tags![index].color = color;
  }

  addTag(){
    this.tags?.push({
      color: 'blue-500',
      name: ''
    });
  }

  saveTag(index: number, event?: Event){
    if(event){
      (event.target as HTMLInputElement).blur();
    }
    const tag = this.tags![index];
    console.log(tag);
    if(tag.id){
      this.boardService.updateTag(tag.id, tag.name, tag.color)
        .subscribe({
          next: () => {
            this.boardService.cachedTags = this.tags!;
          },
          error: (err) => {
            this.alertService.open({
              message: String(err.message), 
              options: {level: 'danger'}
            });
          }
        });
    }else{
      this.boardService.createTag(tag.name, tag.color, this.board!.id)
        .subscribe({
          next: (tag) => {
            this.tags![index] = tag;
            this.boardService.cachedTags = this.tags!;
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

  deleteTag(index: number){
    const tag = this.tags![index];
    
    //Tag not saved, we only delete from list, it is not in db
    if(!tag.id){
      this.tags?.splice(index, 1);
      return;
    }

    this.boardService.deleteTag(tag.id).subscribe({
      next: () => {
        this.tags?.splice(index, 1);
        this.boardService.cachedTags = this.tags!;
      },
      error: (err) => {
        this.alertService.open({
          message: String(err.message), 
          options: {level: 'danger'}
        });
      }
    })
  }

  addMember(member: User){
    this.boardService.addMember(member.id, this.board!.id)
      .subscribe({
        next: () => {
          this.board!.users!.push(member);
        },
        error: (err) => {
          this.alertService.open({
          message: String(err.message), 
          options: {level: 'danger'}
        });
        }
      });
  }

  deleteMember(userId: number){
    this.boardService.deleteMember(userId, this.board!.id)
      .subscribe({
        next: () => {
          this.board!.users = this.board?.users?.filter(user => user.id !== userId);
        },
        error: (err) => {
          this.alertService.open({
          message: String(err.message), 
          options: {level: 'danger'}
        });
        }
      })
  }

  toggleTagFilter(tagId: number){
    if(!('cards_tags_id' in this.filters)){
      this.filters.cards_tags_id = {
        operator: 'in',
        value: []
      };
    }

    if(this.filters.cards_tags_id!.value.includes(tagId)){
      const index = this.filters.cards_tags_id!.value.findIndex((value) => value == tagId);
      this.filters.cards_tags_id!.value.splice(index, 1);
      if(this.filters.cards_tags_id!.value.length == 0){
        delete this.filters.cards_tags_id;
      }
    }else {
      this.filters.cards_tags_id!.value.push(tagId);
    }
  }

  toggleUserFilter(userId: number){
    if(!('cards_users_id' in this.filters)){
      this.filters.cards_users_id = {
        operator: 'in',
        value: []
      };
    }

    if(this.filters.cards_users_id!.value.includes(userId)){
      const index = this.filters.cards_users_id!.value.findIndex((value) => value == userId);
      this.filters.cards_users_id!.value.splice(index, 1);
      if(this.filters.cards_users_id!.value.length == 0){
        delete this.filters.cards_users_id;
      }
    }else {
      this.filters.cards_users_id!.value.push(userId);
    }
  }

  startDateFilterChange(){
    if(this.filterStartDate === ''){
      delete this.filters.endDate;
    }
  }

  endDateFilterChange(){
    if(!('endDate' in this.filters)){
      this.filters.endDate = {
        operator: 'between',
        value: []
      }
    }

    if(this.filterEndDate === ''){
      delete this.filters.endDate;
      return;
    }

    this.filters.endDate!.value = [this.filterStartDate, this.filterEndDate];
  }

  /**
   * Triggers search with new filters
   */
  search(event: Event){
    event.stopPropagation();
    event.preventDefault();
    this.boardService.setFilters(this.filters);
  }


}
