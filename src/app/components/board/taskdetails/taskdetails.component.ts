import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { TaskService } from '../../../services/task.service';
import { EditTaskdetailsComponent } from '../edit-taskdetails/edit-taskdetails.component';
import { Subscription } from 'rxjs';
import { ErrorService } from '../../../services/error.service';

@Component({
  selector: 'app-taskdetails',
  standalone: true,
  imports: [CommonModule, EditTaskdetailsComponent],
  templateUrl: './taskdetails.component.html',
  styleUrl: './taskdetails.component.scss'
})
export class TaskdetailsComponent {
  task_details: any = [];
  users: any = [];
  isEdit: boolean = false;

  loading: boolean = false;
  errorSubscription: Subscription = new Subscription;
  errorCodeSubscription: Subscription = new Subscription;

  successMessageSubscription: Subscription = new Subscription;
  successMessage: string = '';

  errorMessage: string = '';
  errorCode: number | undefined;
  @Output() closeOverlay = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<void>();
  constructor(private contacts: ContactsService, private tasks: TaskService, private errorService: ErrorService) { }

  ngOnInit(): void {
    this.errorCodeSubscription = this.errorService.errorCode$.subscribe((errorCode: any) => {
      this.errorCode = errorCode;
    });
    this.errorSubscription = this.errorService.errorMessage$.subscribe((error: any) => {
      this.errorMessage = error;
    });
    this.successMessageSubscription = this.errorService.successMessage$.subscribe((successMessage: any) => {
      this.successMessage = successMessage;
    });
    this.tasks.selected_task$.subscribe((task) => {
      this.task_details = task;
    });
    this.contacts.contacts$.subscribe((users) => {
      this.users = users;
    });
  }

  getCategoryColor(category: string) {
    switch (category) {
      case 'Technical Task':
        return 'blue';
      case 'Design Task':
        return 'green';
      case 'User Story':
        return 'orange';
      case 'Other Task':
        return 'gray';
      default:
        return 'white';
    }
  }

  public formatTaskPrio(prio: string) {
    if (prio == '1') {
      return "../../../../assets/img/inputs/Prio alta.svg";
    }
    if (prio == '2') {
      return "../../../../assets/img/inputs/Prio media.svg";
    }
    if (prio == '3') {
      return "../../../../assets/img/inputs/Prio baja.svg";
    } else {
      return "../../../../assets/img/inputs/Prio baja.svg";
    }
  }

  formatTaskPrioName(prio: string) {
    if (prio == '1') {
      return "Urgent";
    }
    if (prio == '2') {
      return "Medium";
    }
    if (prio == '3') {
      return "Low";
    } else {
      return "Low";
    }
  }

  close(): void {
    this.users = [];
    this.task_details = [];
    this.closeOverlay.emit();
  }

  async deleteTask() {
    let body = {
      task_id: this.task_details['id']
    };
    this.loading = true;
    try {
      await this.tasks.deleteTask(body);
      this.errorService.handleSuccessMessages('Task successfully deleted');
      setTimeout(() => {
        this.afterTaskDeleted();
      }, 3000);
    } catch (error) {
      this.errorService.handleError(error);
    } finally {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }

  afterTaskDeleted() {
    this.taskDeleted.emit();
    this.tasks.getTasks();
    this.close();
  }

  openEditView() {
    this.isEdit = true;
  }

  getUserDetails(colorkey: string) {
    let name = '';
    this.users.forEach((user: any) => {
      if (user['color_key'] === colorkey) {
        name = user['firstName'] + ' ' + user['lastName'];
      }
    });
    return name;
  }

  changeSubtaskStatus(subtask: any, status: number) {
    subtask['checked'] = status;
    this.tasks.changeSubtaskStatus(subtask);
  }

}
