import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<any>([]);
  tasks$ = this.tasks.asObservable();


  constructor(private http: HttpClient) {
    this.getTasks().subscribe(tasks => {
      this.tasks.next(tasks.tasks);
    });
  }

  createTask(task: any): Observable<any> {
    return this.http.post('./phpscripts/createTask', task);
  }

  getTasks(): Observable<any>{
    return this.http.get('./phpscripts/getAllTasks.php');
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
    return lastValueFrom(this.http.post('./phpscripts/updateTask.php', body));
  }


}
