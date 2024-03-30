import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  color_key: string;
  isSelected: boolean;
}


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  selectedCategory = '';
  taskPrio = 0;
  hoverPrio = 0;
  today = new Date().toISOString().split('T')[0];
  categories = ['Technical Task', 'Design Task', 'User Story', 'Other Task'];
  contacts: Contact[] = [];
  dropdownOpen = false;
  errorCode?: number;
  errorMessage?: string;
  loading: boolean = false;
  success: boolean = false;
  isSubtaskActive = false;
  subTasks: string[] = [];
  isEditingSubtask: boolean = false;
  editingSubtask: string | null = null;

  taskForm = new FormGroup({
    taskName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    taskDescription: new FormControl('', [Validators.minLength(5)]),
    taskDueDate: new FormControl('', [Validators.required]),
    taskCategory: new FormControl('', [Validators.required]),
    taskAssigned: new FormArray([]),
    subTasks: new FormControl(''),
    taskPrio: new FormControl(0)
  });
  constructor(private contactsService: ContactsService, private taskService: TaskService) { }

  ngOnInit(): void {
    this.contactsService.contacts$.subscribe((contacts: any) => {
      this.contacts = contacts;
    });
  }

  resetForm() {
    this.taskForm.reset();
    this.taskPrio = 0;
    this.subTasks = [];
  }

  setTaskPrio(prio: number) {
    this.taskPrio = this.taskPrio === prio ? 0 : prio;
  }
  setHoverPrio(prio: number) {
    this.hoverPrio = this.hoverPrio === prio ? 0 : prio;
  }

  editSubTask(subtask: string) {
    this.isEditingSubtask = true;
    this.editingSubtask = subtask;
  }

  saveSubTask(editSubtaskValue: string, subtask: string) {
    const index = this.subTasks.indexOf(subtask);
    if (index !== -1) {
      this.subTasks[index] = editSubtaskValue;
    }
    this.editingSubtask = null;
  }

  removeSubTask(subtask: string) {
    const index = this.subTasks.indexOf(subtask);
    if (index !== -1) {
      this.subTasks.splice(index, 1);
    }
    if (this.editingSubtask === subtask) {
      this.editingSubtask = null;
    }
  }

  toggleCheckbox(i: number, contact: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    const checkbox = event.target.parentElement.parentElement.children[1];
    if (checkbox) {

      checkbox.checked = !checkbox.checked;
      const newEvent = {
        target: checkbox
      };
      this.onCheckboxChange(newEvent, contact);
    }
  }

  getPrioImage(prio: number): string {

      if (this.taskPrio === prio || this.hoverPrio === prio) {
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
    return this.taskForm.get('taskAssigned') as FormArray;
  }

  getInitials(email: string) {
    const contact = this.contacts.find(c => c.email === email);
    if (contact) {
      return contact.firstName[0] + contact.lastName[0];
    }
    return '';
  }

  getColorKey(email: string) {
    const contact = this.contacts.find(c => c.email === email);
    if (contact) {
      return contact.color_key;
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

  resetSubTask() {
    this.isSubtaskActive = !this.isSubtaskActive;
    this.taskForm.get('subTasks')?.reset();
  }

  addSubTask() {
    if (this.taskForm.get('subTasks')?.value) {
      this.subTasks.push(this.taskForm.get('subTasks')!.value!);
      this.resetSubTask();
    }
  }

  createTask() {
    this.setLoading(true);

    if (this.taskForm.valid) {
      const body = {
        title: this.taskForm.get('taskName')!.value!,
        description: this.taskForm.get('taskDescription')!.value!,
        dueDate: this.taskForm.get('taskDueDate')!.value!,
        category: this.taskForm.get('taskCategory')!.value!,
        priority: this.taskPrio,
        assigned: this.taskForm.get('taskAssigned')!.value!,
        subTasks: this.subTasks
      }

      this.taskService.createTask(body).then(response => {
        this.handleSuccessMessages('Task created successfully');
      }, error => {
        if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 500) {
          this.handleErrorMessages(error);
        }
      });
    }
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setErrorCode(errorCode: number | undefined) {
    this.errorCode = errorCode;
  }

  setErrorMessage(errorMessage: string | undefined) {
    this.errorMessage = errorMessage;
  }

  handleErrorMessages(error: any): void {
    this.setErrorMessages(error);
    this.resetErrorMessages();
  }

  handleSuccessMessages(error: any): void {
    setTimeout(() => {
      this.setLoading(false);
      this.setErrorMessage(error);
      this.success = true;
    }, 1000);
    this.resetSuccessMessages();
  }

  resetSuccessMessages(): void {
    setTimeout(() => {
      this.setErrorMessage(undefined);
      this.success = false;
      this.taskForm.reset();
      this.taskPrio = 0;
      this.subTasks = [];
    }, 5000);
  }

  setErrorMessages(error: any): void {
    setTimeout(() => {
      this.setLoading(false);
      this.setErrorCode(error.status);
      this.setErrorMessage(error.error.error);
    }, 1000);
  }

  resetErrorMessages(): void {
    setTimeout(() => {
      this.setErrorCode(undefined);
      this.setErrorMessage(undefined);
      this.taskForm.reset();
      this.taskPrio = 0;
      this.subTasks = [];

    }, 5000);
  }

}
