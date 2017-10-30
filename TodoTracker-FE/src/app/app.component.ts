import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Todo, TodoActions, TodoStatus } from './app';
import { TodoService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TodoService]
})

export class AppComponent implements OnInit {
  appTitle: string;
  modalTitle: string;
  modalType: string;
  todoActions: any;
  todoStatus: any;
  todoList: any[];
  currentTodo: Todo;
  filterCriteria: Object;

  constructor(private _modalService: NgbModal, private _todoService: TodoService) {
    this.appTitle = 'Todo Angular Application';
    this.todoActions = TodoActions;
    this.todoStatus = TodoStatus;
    this.currentTodo = {
      id: null,
      title: '',
      description: ''
    };
    this.filterCriteria = {
        pending: true,
        completed: true
    };
  }

  public openTodoModal(modal, action?: string, todo?: any) {
    switch (action) {
      case this.todoActions['CREATE']:
        this.modalTitle = "Add a new todo";
        this.modalType = this.todoActions['ADD'];
        this.openModal(modal);
        break;
      case this.todoActions['UPDATE']:
        this.modalTitle = "Edit the todo";
        this.modalType = this.todoActions['EDIT'];
        this.currentTodo.id = todo.id;
        this.currentTodo.title = todo.title;
        this.currentTodo.description = todo.description;
        this.currentTodo.status = (todo.statusId == this.todoStatus['COMPLETED'].id);
        this.openModal(modal);
        break;
      default :
        break;
    }
  }

  public openConfirmModal(modal, action?: string, todo?: any) {
    switch (action) {
      case this.todoActions['DELETE']:
        this.currentTodo.id = todo.id;
        this.currentTodo.title = todo.title;
        this.currentTodo.description = todo.description;
        this.openModal(modal);
        break;
      default :
        break;
    }
  }

  public applyFilterCriteria() {
    let filterCriteriaParam: string = '';
    if((this.filterCriteria['pending'] && this.filterCriteria['completed']) || (!this.filterCriteria['pending'] && !this.filterCriteria['completed'])){
      filterCriteriaParam = undefined;
    }
    else if(this.filterCriteria['pending'] && !this.filterCriteria['completed']){
      filterCriteriaParam = this.todoStatus['PENDING'].title;
    }
    else if(!this.filterCriteria['pending'] && this.filterCriteria['completed']){
      filterCriteriaParam = this.todoStatus['COMPLETED'].title;
    }
    this.fetchTodos(filterCriteriaParam);
  }

  public ngOnInit(): void {
    this.fetchTodos();
  }

  private fetchTodos(filterCriteria?: string): void {
    this._todoService.getTodos(filterCriteria).subscribe((responseData) => {
      this.todoList = responseData.todoResponse;
    }, (errorData) => {
      console.log("Error", errorData);
    })
  }

  private openModal(modal, action?: string): void {
    this._modalService.open(modal).result.then((result) => {
      console.log("Result", result);
      if (result === this.todoActions['CREATE']) {
        this._todoService.createTodo(this.currentTodo.title, this.currentTodo.description).subscribe((responseData) => {
          alert(`Todo: ${this.currentTodo.title} created successfully`);
          this.fetchTodos();
          this.resetTodoData();
        }, (errorData) => {
          console.log("Error", errorData);
        })
      }
      else if (result === this.todoActions['UPDATE']) {
        this._todoService.updateTodo(this.currentTodo).subscribe((responseData) => {
          alert(`Todo: ${this.currentTodo.title} updated successfully`);
          this.fetchTodos();
          this.resetTodoData();
        }, (errorData) => {
          console.log("Error", errorData);
        })
      }
      else if (result === this.todoActions['DELETE']) {
        this._todoService.deleteTodo(this.currentTodo).subscribe((responseData) => {
          alert(`Todo: ${this.currentTodo.title} deleted successfully`);
          this.fetchTodos();
          this.resetTodoData();
        }, (errorData) => {
          console.log("Error", errorData);
        })
      }
    }, (reason) => {
      console.log("closed with reason", reason);
    });
  }

  private resetTodoData(): void {
    this.currentTodo.title = '';
    this.currentTodo.description = '';
    this.currentTodo.status = false;
  }
}
