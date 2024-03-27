import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<any>([]);
  tasks$ = this.tasks.asObservable();
  private selected_task = new BehaviorSubject<any>([]);
  public selected_task$ = this.selected_task.asObservable();
  public tasksChanged = new EventEmitter<void>();



  constructor(private http: HttpClient) {
    this.getTasks();
  }

  async createTask(task: any){
    return lastValueFrom(this.http.post('./phpscripts/createTask', task)).then((response: any) => {
      this.updatedTasks();
      this.getTasks();
    });
  }

  setSelectedTask(task: any) {
    this.selected_task.next(task);
  }

  async getTasks(){
    return lastValueFrom(this.http.get('./phpscripts/getAllTasks.php')).then((response: any) => {
      this.tasks.next(response['tasks']);
    });
  }

  deleteTask(body: object){
    return lastValueFrom(this.http.post('./phpscripts/deleteTask.php', body));
  }

  updateTaskStatus(task: Object) {
    return lastValueFrom(this.http.post('./phpscripts/updateTaskStatus.php', task));
  }

  changeSubtaskStatus(subtask: Object) {
    return lastValueFrom(this.http.post('./phpscripts/updateSubtaskStatus.php', subtask));
  }

  updateTask(body: Object) {
    return lastValueFrom(this.http.post('./phpscripts/updateTask.php', body)).then((response: any) => {
      this.updatedTasks();
    });
  }
  updatedTasks() {
    this.tasksChanged.emit();
  }

}
