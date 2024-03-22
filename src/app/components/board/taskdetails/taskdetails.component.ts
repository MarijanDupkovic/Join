import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { TaskService } from '../../../services/task.service';
import { EditTaskdetailsComponent } from '../edit-taskdetails/edit-taskdetails.component';

@Component({
  selector: 'app-taskdetails',
  standalone: true,
  imports: [CommonModule,EditTaskdetailsComponent],
  templateUrl: './taskdetails.component.html',
  styleUrl: './taskdetails.component.scss'
})
export class TaskdetailsComponent {
  public static task: any = [];
  task_details: any = TaskdetailsComponent.task;
  users: any = [];
  isEdit: boolean = false;

  @Output() closeOverlay = new EventEmitter<void>();
  @Output() taskDeleted = new EventEmitter<void>();
  constructor(private contacts: ContactsService,private tasks:TaskService) { }

  ngOnInit(): void {
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
      return "Low";
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
    this.closeOverlay.emit();
  }

  deleteTask() {
    let body = {
      task_id: this.task_details['id']
    };
    this.tasks.deleteTask(body).then((response:any) => {
      if(response['status'] === 200){
        this.taskDeleted.emit();
        this.close();
      }
    });

  }

  openEditView() {
    this.isEdit = true;
    EditTaskdetailsComponent.task = this.task_details;
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
