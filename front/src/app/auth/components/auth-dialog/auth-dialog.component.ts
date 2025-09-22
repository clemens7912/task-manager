import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ComponentRef, Testability, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ActionCompleted } from '../../../shared/interfaces/action-completed.interface';

@Component({
  selector: 'app-auth-dialog',
  imports: [NgClass,MatDialogModule],
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.css'
})
export class AuthDialogComponent implements AfterViewInit{

  //We use viewchild to load components dynamically and avoid loading unnecessary components
  @ViewChild('container', {read: ViewContainerRef}) container!: ViewContainerRef;

  private componentsMap = new Map<string, ComponentRef<any>>();
  private currentComponentRef?: ComponentRef<any>;

  activeTab: string = 'login';

  constructor(private dialogRef: MatDialogRef<AuthDialogComponent>) {}

  ngAfterViewInit(): void {
    this.loadComponent('login');
  }

  //Loads component into container
  loadComponent(tab: string){
    if(this.componentsMap.has(tab)){
      this.attachComponent(tab);
      this.activeTab = tab;
      return;
    }

    //Instantiate component
    const insertedComponent: Type<LoginComponent|RegisterComponent> = tab === 'login' ? LoginComponent : RegisterComponent;
    const componentRef = this.container.createComponent(insertedComponent);

    //store component in map
    this.componentsMap.set(tab, componentRef);

    //attach component
    this.attachComponent(tab);

    //update selected tab
    this.activeTab = tab;
  }

  /**
   * Attaches existing instance of component to container
   * Keeps state of the component as it gets the existing instance
   * @param tab {string}
   */
  attachComponent(tab: string){
    //dettach previous component
    this.dettachAllComponents();

    //retrieve and attach new component
    this.currentComponentRef = this.componentsMap.get(tab);
    if(this.currentComponentRef){
      this.container.insert(this.currentComponentRef.hostView);
      (this.currentComponentRef.instance as ActionCompleted).actionCompleted.subscribe(() => {
        this.actionCompleted();
      })
    }
  }

  //Detaches all components of the container.
  dettachAllComponents(){
    while(this.container.length > 0){
      this.container.detach(0);
    }
  }

  actionCompleted(){
    switch(this.activeTab){
      case 'login':
        this.close();
        break;
      case 'register':
        this.loadComponent('login');
        break;
    }
  }

  close() {
    this.dialogRef.close();
  }

}
