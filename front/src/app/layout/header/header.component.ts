import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  boards: string[] = ['DevOps', 'Management', 'Jira 2008'];
}
