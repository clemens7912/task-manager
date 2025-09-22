import { BoardService } from './../../services/board.service';
import { CardDetailComponent } from './../card-detail/card-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from './../card/card.component';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Column } from '../../shared/models/column';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertService } from '../../shared/services/alert.service';
import { Card } from '../../shared/models/card';
import { debounceTime, finalize, fromEvent } from 'rxjs';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { Filters } from '../../shared/models/filters';
import { checkScreenSize } from '../../shared/utils/utils';

@Component({
  selector: 'app-column',
  imports: [CardComponent, MatIconModule, MatDialogModule, DragDropModule],
  templateUrl: './column.component.html',
  styleUrl: './column.component.css'
})
export class ColumnComponent implements OnInit, AfterViewInit{

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  @Input() column!: Column;
  @Input() availableColumns?: Column[];

  isSmallScreen: boolean = false;
  page: number = 0;
  limit: number = 10;
  hasMoreCards: boolean = true;
  checkDuplicates: boolean = false;
  loading: boolean = false; 
  filters?: Filters;

  constructor(private dialog: MatDialog,
              private alertService: AlertService,
              private boardService: BoardService){}

  ngOnInit(): void {
    this.isSmallScreen = checkScreenSize();
    window.addEventListener('resize', () => {
      this.isSmallScreen = checkScreenSize();
    });
    
    this.column.cards = [];

    this.boardService.filtersChanged$.subscribe((filters) => {
      this.filters = filters;
      this.page = 0;
      this.column.cards = [];
      this.hasMoreCards = true;
      this.loadCards();
    });

    this.boardService.cardRemoved$.subscribe((id) => {
      if(id !== this.column.id){
        return;
      }

      this.checkDuplicates = true;
      setTimeout(() => {
        this.checkScrollAndLoad();
      }, 0);
    });

    this.boardService.cardUpdated$.subscribe((card) => {
      if(card.column?.id !== this.column.id){
        return;
      }

      this.column.cards?.push(card);
      this.checkDuplicates = true;
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadCards();
    }, 0);
    fromEvent(this.scrollContainer.nativeElement, 'scroll')
      .pipe(debounceTime(200))
      .subscribe(() => this.checkScrollPosition());
  }

  checkScrollPosition() {
    if(!this.hasMoreCards || this.loading){
      return;
    }

    const el: HTMLElement= this.scrollContainer.nativeElement;

    const threshold = 10;
    const scrollPosition = el.scrollTop + el.clientHeight;
    const scrollHeight = el.scrollHeight;

    if (scrollHeight - scrollPosition <= threshold) {
      this.loadCards();
    }
  }

  /**
   * Checks if column is scrollable after a card is moved to another
   * column and if it isn't and the column has more cards, it loads
   * new cards. If not, the user won't be able to scroll and load
   * new cards
   */
  checkScrollAndLoad(){
    const el: HTMLElement= this.scrollContainer.nativeElement;
    if(el.scrollHeight <= el.clientHeight && !this.loading && this.hasMoreCards){
      this.loadCards(true);
    }
  }

  scrollToBottom(){
    const el: HTMLElement= this.scrollContainer.nativeElement;
    //let browser finish rendering of spinner, and then scroll
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 0)
  }

  async loadCards(keepPage: boolean = false) {
    this.loading = true;
    this.scrollToBottom();
    const page = keepPage ? this.page : this.page + 1;
    this.boardService.getCards(this.column.id, page, this.limit, this.filters)
      .pipe(finalize(() => {
        this.loading = false;
      })).subscribe(
        {
          next: (response) => {
            if(this.checkDuplicates){
              this.column.cards = [...this.column.cards!, ...this.removeDuplicates(response.data)];
            }else{
              this.column.cards = [...this.column.cards!, ...response.data];
            }
            if(!keepPage){
              this.page++;
            }
            if(this.column.cards.length >= response.total ){
              this.hasMoreCards = false;
            }
          },
          error: (err) => {
            this.alertService.open({
              message: String(err.message),
              options: {level: 'danger'}
            })
          }
        }
      ); 
  }

  /**
   * Removes duplicates in case a new card has been created, as the same
   * card can later on be loaded again by infinite scrolling
   */
  removeDuplicates(newCards: Card[]): Card[]{
    const existingIds = new Set(this.column.cards!.map(card => card.id));
    return newCards.filter(card => !existingIds.has(card.id));
  }

  openCreateCardModal(index: number | null){
    const card = (index !== null) ? this.column.cards![index] : null;
    const dialogRef = this.dialog.open(CardDetailComponent, {
      data: {
        card: card,
        column: this.column,
        availableColumns: this.availableColumns
      },
      enterAnimationDuration: 700,
      exitAnimationDuration: 400,
      panelClass: 'dialog-responsive',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe((newCard?: Card) => {
      //user has closed dialog without any action
      if(!newCard){
        return;
      }

      //We have created one
      if(!card){
        this.column.cards?.push(newCard);
        this.checkDuplicates = true;
      }

      //We have updated one
      if(this.column.id == newCard.column!.id){ //card is in the same column
        this.column.cards![index!] = newCard;
      } 
      else { //card has changed column
        this.column.cards?.splice(index!, 1);
        this.boardService.columnCardRemoved(this.column.id);
        this.boardService.columnCarUpdated(newCard);
      }
    });
  }

  onDeleteCard(id: number, index: number){
    this.column.cards?.splice(index, 1);
    this.alertService.open({
      message: `Card ${id} deleted.`,
      options: {level: 'success', duration: 5}
    });
  }

  onDrop(event: CdkDragDrop<Card[] | undefined>, targetId: number){
    if(!event.container.data || !event.previousContainer.data){
      return;
    }

    const card: Card = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer.id !== event.container.id) {
      this.boardService.updateCardColumn(card.id!, targetId).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data!,
            event.container.data!,
            event.previousIndex,
            event.container.data!.length
          );  
          this.checkDuplicates = true;
          requestAnimationFrame(() => {
            this.boardService.columnCardRemoved(+event.previousContainer.id.split('-')[2]);
          })
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
}
