import { Component, HostListener } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ContactsService } from '../../../services/contacts.service';
import { Subscription } from 'rxjs';

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
  loaded_contacts: any = [];
  loggedInMail = '';
  userName: any;
  tasksObserver: Subscription | undefined;
  userMailObserver: Subscription | undefined;
  contactsObserver: Subscription | undefined;

  constructor(private tasks: TaskService, private auth: AuthService, private contacts: ContactsService) { }

  ngOnInit() {
    this.loadTasksObserver();
    this.loadUserMailObserver();
    this.loadContactsObserver();
  }

  loadContactsObserver() {
    this.contactsObserver = this.contacts.contacts$.subscribe((data) => {
      this.loaded_contacts = data;
      this.loaded_contacts.forEach((contact: any) => {
        this.setUserName(contact);
      });
    });
  }

  loadUserMailObserver() {
    this.userMailObserver = this.auth.user_mail$.subscribe((data) => {
      this.loggedInMail = data;
    });
  }

  loadTasksObserver() {
    this.tasksObserver = this.tasks.tasks$.subscribe((data) => {
      this.loaded_tasks = data;
      if (this.tasksLoaded()) this.initTaskDetails();
    });
  }

  initTaskDetails() {
    this.countStatus();
    this.getUpcomingTask();
  }

  ngOnDestroy() {
    if (this.tasksObserver) {
      this.tasksObserver.unsubscribe();
    }
    if (this.userMailObserver) {
      this.userMailObserver.unsubscribe();
    }
    if (this.contactsObserver) {
      this.contactsObserver.unsubscribe();
    }
  }

  setUserName(contact: any) {
    if (this.isLoggedInUser(contact)) this.userName = this.getUserName(contact);
  }

  getUserName(contact: any) {
    return contact.firstName + ' ' + contact.lastName
  }

  isLoggedInUser(contact: any) {
    return contact.email === this.loggedInMail
  }

  tasksLoaded() {
    return this.loaded_tasks.length > 0;
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
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

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good Morning';
    } else if (hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
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
  }

  format(date: string) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
