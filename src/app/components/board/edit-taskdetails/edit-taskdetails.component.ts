import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { TaskService } from '../../../services/task.service';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-taskdetails',
  standalone: true,
  imports: [CommonModule, EditTaskdetailsComponent, ReactiveFormsModule],
  templateUrl: './edit-taskdetails.component.html',
  styleUrl: './edit-taskdetails.component.scss'
})
export class EditTaskdetailsComponent {
  users: any = [];
  task_details: any = {};
  taskPrio = 0;
  @Output() closeOverlay = new EventEmitter();
  today = new Date().toISOString().split('T')[0];
  categories = ['Technical Task', 'Design Task', 'User Story', 'Other Task'];
  dropdownOpen = false;

  edit_taskForm = new FormGroup({
    taskName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    taskDescription: new FormControl('', [Validators.minLength(5)]),
    taskDueDate: new FormControl('', [Validators.required]),
    taskCategory: new FormControl('', [Validators.required]),
    taskAssigned: new FormArray([]),
    subTasks: new FormControl(''),
    taskPrio: new FormControl(0)
  });

  constructor(private contacts: ContactsService, private tasks: TaskService) {

  }

  ngOnInit(): void {

    this.contacts.contacts$.subscribe((users) => {
      this.users = users;
    });
    this.tasks.selected_task$.subscribe((task) => {
      this.task_details = task;
      if (this.task_details['id']) {
        this.edit_taskForm.get('taskName')?.setValue(this.task_details['title']);
        this.edit_taskForm.get('taskDescription')?.setValue(this.task_details['description']);
        this.edit_taskForm.get('taskPrio')?.setValue(this.task_details['prio']);
        this.setTaskPrio(this.task_details['prio']);
        this.edit_taskForm.get('taskDueDate')?.setValue(this.task_details['due_date']);
        this.edit_taskForm.get('taskCategory')?.setValue(this.task_details['category']);
        for (let i = 0; i < this.task_details['assigned'].length; i++) {
          this.taskAssigned.push(new FormControl(this.task_details['assigned'][i]));

        }
      }

    });
  }

  close() {
    this.closeOverlay.emit();
  }

  isContactAssigned(contact: any) {
    this.task_details['assigned'].forEach((assigned: any) => {
      if (assigned === contact.email) {
        contact.assigned = true;
      }
    });
    return contact.assigned === true;
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

  setTaskPrio(prio: number) {
    this.taskPrio = this.taskPrio === prio ? 0 : prio;
  }

  getPrioImage(prio: number): string {
    if (this.taskPrio === prio) {
      switch (prio) {
        case 1:
          return '../../../../assets/img/inputs/Prio alta active.svg';
        case 2:
          return '../../../../assets/img/inputs/Prio media active.svg';
        case 3:
          return '../../../../assets/img/inputs/Prio baja active.svg';
        default:
          return '';
      }
    } else {
      switch (prio) {
        case 1:
          return '../../../../assets/img/inputs/Prio alta.svg';
        case 2:
          return '../../../../assets/img/inputs/Prio media.svg';
        case 3:
          return '../../../../assets/img/inputs/Prio baja.svg';
        default:
          return '';
      }
    }
  }

  get taskAssigned() {
    return this.edit_taskForm.get('taskAssigned') as FormArray;
  }

  getInitials(email: string) {
    const contact = this.users.find((c: any) => c.email === email);
    if (contact) {
      return contact.firstName[0] + contact.lastName[0];
    }
    return '';
  }

  onCheckboxChange(e: any, contact: any) {
    if (e.target.checked) {
      this.taskAssigned.push(new FormControl(e.target.value));
      contact.isSelected = true;
    } else {
      let i: number = 0;
      this.taskAssigned.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          this.taskAssigned.removeAt(i);
          contact.isSelected = false;
          return;
        }
        i++;
      });
    }
  }

  getColorKey(email: string) {
    const contact = this.users.find((c: any) => c.email === email);
    if (contact) {
      return contact.color_key;
    }
    return '';
  }

  async saveTask() {
    let body = {
      id: this.task_details['id'],
      title: this.edit_taskForm.get('taskName')?.value,
      description: this.edit_taskForm.get('taskDescription')?.value,
      due_date: this.edit_taskForm.get('taskDueDate')?.value,
      category: this.edit_taskForm.get('taskCategory')?.value,
      prio: this.taskPrio,
      assigned: this.taskAssigned.value,
    }

    await this.tasks.updateTask(body).then((response: any) => {
      this.tasks.getTasks();
      this.close();
    });
  }
}
