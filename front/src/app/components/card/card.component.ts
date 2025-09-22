import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../../shared/models/card';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { BoardService } from '../../services/board.service';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-card',
  imports: [MatIconModule, InitialsPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent{
  @Input() card!: Card;
  @Output() deleteCard = new EventEmitter<number>();

  constructor(private boardService: BoardService,
              private alertService: AlertService){}

  delete(event: Event){
    event.stopPropagation();
    this.boardService.deleteCard(this.card.id!).subscribe({
      next: () => {
        this.deleteCard.emit(this.card.id);
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
