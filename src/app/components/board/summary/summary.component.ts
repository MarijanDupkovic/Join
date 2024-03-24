import { Component, HostListener } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  loaded_tasks = [];
  todos = 0;
  inProgress = 0;
  awaitingFeedback = 0;
  done = 0;
  urgent = 0;
  upcomingTask = '';
  isMobile = window.innerWidth < 1000;

  constructor(private tasks: TaskService) { }
  ngOnInit() {
    this.tasks.tasks$.subscribe((data) => {
      this.loaded_tasks = data;
      if (this.loaded_tasks.length > 0) {
        this.countStatus();
        this.getUpcomingTask();
      }
    });

  }
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.isMobile = event.target.innerWidth < 1000;
  }
  countStatus() {

    this.loaded_tasks.forEach((task: any) => {
      if (task.status === 'todo') {
        this.todos++;
      }
      if (task.status === 'inProgress') {
        this.inProgress++;
      }
      if (task.status === 'awaitingFeedback') {
        this.awaitingFeedback++;
      }
      if (task.status === 'done') {
        this.done++;
      }
      if (task.prio === 1) {
        this.urgent++;
      }
    });
  }

  getUpcomingTask() {
    let closest = Infinity;
    let upcomingTask: any = null;

    this.loaded_tasks.forEach((task: any) => {
      const dueDate = new Date(task.due_date).getTime();
      const now = Date.now();

      if (dueDate > now && dueDate < closest) {
        closest = dueDate;
        upcomingTask = task;
      }
    });

    if (upcomingTask) {
      this.upcomingTask = upcomingTask.due_date;
    }
    console.log(this.upcomingTask);
  }

  format(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
