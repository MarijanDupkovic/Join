import { AfterViewInit, Component, OnInit, ElementRef } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../services/contacts.service';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragRelease, CdkDragStart, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskdetailsComponent } from '../taskdetails/taskdetails.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-kb-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskdetailsComponent,RouterLink],
  templateUrl: './kb-board.component.html',
  styleUrl: './kb-board.component.scss'
})
export class KbBoardComponent implements OnInit {
  loaded_tasks: any = [];
  filtered_tasks: any = [];
  isFiltered = false;
  users = [];
  acronyms: any = [];
  public isDetailView = false;
  static isDetailView: boolean;
  detailsView: any;
  isDraggingOver = '';
  constructor(private tasks: TaskService, private contact: ContactsService) { }
  ngOnInit(): void {
    this.init();

  }
  init() {

    this.tasks.tasks$.subscribe((data) => {
      this.loaded_tasks = data;
      if (this.loaded_tasks.length > 0) {
        this.loaded_tasks.forEach(async (task: any) => {
          if (!task.users) {
          task.users = [];
          for (let email of task.assigned) {
            await this.getUserDetails(email).then((userDetails) => {
              task.users.push(userDetails);
            });
          }
        }
        });
      }
    });

  }

  ngOnDestroy() {
    this.tasks.tasks$.subscribe().unsubscribe();
    this.acronyms = [];
    this.users = [];
  }

  openDetailsView(task: any) {
    this.tasks.setSelectedTask(task);
    this.isDetailView = true;


  }
  dragStart(event: CdkDragStart) {
    event.source.element.nativeElement.classList.add('dragging');
  }

  dragEnd(event: CdkDragRelease) {
    event.source.element.nativeElement.classList.remove('dragging');
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

  showPreview(event: CdkDragEnter, status: string) {
    this.isDraggingOver = status;
  }

  hidePreview(event: CdkDragExit) {
    this.isDraggingOver = '';
  }

  getSubtaskProgress(task: any) {
    const totalSubtasks = task.subTasks.length;
    const completedSubtasks = task.subTasks.filter((subtask: any) => subtask.checked).length;
    return { totalSubtasks, completedSubtasks };
  }

  async getUserDetails(email: string) {
    let body = { email: email }
    if (email) {
      let response: any = await this.contact.getUserDetails(body);
      let firstName = response.data.firstName;
      let lastName = response.data.lastName;
      let acronym = firstName.charAt(0) + lastName.charAt(0);
      return { acronym: acronym, color: response.data.color_key };
    }
    return { acronym: "N/A", color: "white" };
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

  hasTasks(status: string) {
    return this.loaded_tasks.some((task: any) => task.status === status);
  }

  getTasksByStatus(status: string) {
    return this.loaded_tasks.filter((task: any) => task.status === status);
  }

  searchTasks(target: any) {
    if (target.value === "") {

      this.isFiltered = false;
      this.filtered_tasks = [];
      return;
    } else {
      console.log(target.value);
      console.log(this.loaded_tasks);
      this.isFiltered = true;
      this.filtered_tasks = this.loaded_tasks.filter((task: any) =>

        task.title.toLowerCase().includes(target.value.toLowerCase()) ||
        task.description.toLowerCase().includes(target.value.toLowerCase())
      );
      console.log(this.filtered_tasks);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    this.isDraggingOver = '';

    if (event.item.dropContainer && event.item.dropContainer.id) {
      let status = event.item.dropContainer.id;
      if (event.container.id === status) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        let body = {
          id: event.item.data.id,
          status: event.container.id
        }

        this.tasks.updateTaskStatus(body).then(() => {
          this.tasks.getTasks();
        });
      }
    }
  }



  moveTask(task: any, direction: string) {
    const statuses = ["todo", "inProgress", "awaitingFeedback", "done"];
    const currentIndex = statuses.indexOf(task.status);
    let newIndex;

    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < statuses.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== undefined) {
      const newStatus = statuses[newIndex];
      task.status = newStatus;
      const body = {
        id: task.id,
        status: newStatus
      };

      this.tasks.updateTaskStatus(body).then(() => {
        this.tasks.getTasks();
      });
    }
  }
}
