import { Tag } from './../shared/models/tag';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND_URL } from '../shared/constants';
import { Observable, Subject, filter } from 'rxjs';
import { Board } from '../shared/models/Board';
import { User } from '../shared/models/user';
import { Column } from '../shared/models/column';
import { Card } from '../shared/models/card';
import { PaginatedData } from '../shared/models/paginatedData';
import { Filters } from '../shared/models/filters';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  newBoard$: Subject<Board> = new Subject<Board>();
  cardRemoved$: Subject<number> = new Subject<number>();
  cardUpdated$: Subject<Card> = new Subject<Card>(); 
  filtersChanged$: Subject<Filters> = new Subject<Filters>();

  private _tags: Tag[] = [];
  private filters?: Filters;

  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]>{
    return this.http.get<Board[]>(BACKEND_URL+'/api/boards');
  }

  createBoard(name: string, members: User[]): Observable<Board>{
    return this.http.post<Board>(BACKEND_URL+'/api/boards', {name, members});
  }

  checkBoardMembership(id: number): Observable<any>{
    return this.http.get(BACKEND_URL+`/api/boards/${id}/member-access`);
  }

  getBoard(id: number): Observable<Board>{
    return this.http.get<Board>(BACKEND_URL+`/api/boards/${id}`);
  }

  addBoard(board: Board){
    this.newBoard$.next(board);
  }

  createColumn(name: string, boardId: number): Observable<Column>{
    return this.http.post<Column>(BACKEND_URL+'/api/columns', {name, boardId});
  }

  getColumns(boardId: number): Observable<Column[]>{
    const params = new HttpParams()
      .set('boardId', boardId);

    return this.http.get<Column[]>(BACKEND_URL+'/api/columns', {params});
  }

  getTags(boardId: number): Observable<Tag[]>{
    const params = new HttpParams()
      .set('boardId', boardId);

    return this.http.get<Tag[]>(BACKEND_URL+'/api/tags', {params});
  }

  get cachedTags(): Tag[] {
    return this._tags;
  }
  set cachedTags(tags: Tag[]) {
    this._tags = tags;
  }

  createTag(name: string, color: string, boardId: number): Observable<Tag>{
    return this.http.post<Tag>(BACKEND_URL+'/api/tags/', {color, name, boardId});
  }

  updateTag(id: number, name: string, color: string): Observable<any>{
    return this.http.put(BACKEND_URL+`/api/tags/${id}`, {name, color});
  }

  deleteTag(id: number): Observable<any>{
    return this.http.delete(BACKEND_URL+`/api/tags/${id}`);
  }

  addMember(userId: number, boardId: number): Observable<any>{
    return this.http.post(BACKEND_URL + '/api/boards/members', {userId, boardId});
  }

  deleteMember(userId: number, boardId: number): Observable<any>{
    return this.http.post(BACKEND_URL + '/api/boards/members/delete', {userId, boardId});
  }

  getCards(columnId: number, page: number, limit: number, filters?: Filters): Observable<PaginatedData<Card>> {
    let params = new HttpParams()
      .set('columnId', columnId)
      .set('limit', limit)
      .set('page', page);

    if(filters){
      params = params.set('filters', JSON.stringify(filters));
    }
    
    return this.http.get<PaginatedData<Card>>(BACKEND_URL+'/api/cards', {params});
  }

  createCard(card: Card): Observable<Card> {
    return this.http.post<Card>(BACKEND_URL+'/api/cards', card);
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.put<Card>(BACKEND_URL+`/api/cards/${card.id}`, card);
  }

  deleteCard(id: number): Observable<any> {
    return this.http.delete(BACKEND_URL + `/api/cards/${id}`);
  }

  updateCardColumn(cardId: number, columnId: number): Observable<Card>{
    return this.http.put<Card>(BACKEND_URL+`/api/cards/${cardId}/column`, {columnId});
  }

  columnCardRemoved(columnId: number){
    this.cardRemoved$.next(columnId);
  }

  columnCarUpdated(card: Card){
    this.cardUpdated$.next(card);
  }

  setFilters(filters: Filters) {
    this.filters = filters;
    this.filtersChanged$.next(this.filters);
  }

  getFilters(): Filters {
    return this.getFilters();
  }
}
