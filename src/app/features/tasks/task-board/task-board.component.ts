// src/app/features/tasks/task-board/task-board.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../../core/services/task.service';
import { ProjectService } from '../../../core/services/project.service';
import { Task, TaskStatus } from '../../../core/models/task.model';
import { RouterLink } from '@angular/router';

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Task Board</h1>
        <div class="flex gap-3 items-center">
          <select
            [(ngModel)]="selectedProjectFilter"
            (change)="onProjectFilterChange()"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by project"
          >
            <option value="">All Projects</option>
            @for (project of projects(); track project.id) {
              <option [value]="project.id">{{ project.name }}</option>
            }
          </select>
          <a
            routerLink="/tasks/new"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + New Task
          </a>
        </div>
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-12" role="status" aria-live="polite">
          <svg class="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="sr-only">Loading tasks...</span>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" cdkDropListGroup>
          @for (column of columns; track column.id) {
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[600px] flex flex-col">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" [style.background-color]="column.color"></div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ column.title }}
                  </h2>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    ({{ getTasksByStatus(column.id).length }})
                  </span>
                </div>
              </div>

              <div
                cdkDropList
                [id]="column.id"
                [cdkDropListData]="getTasksByStatus(column.id)"
                (cdkDropListDropped)="onDrop($event)"
                class="flex-1 space-y-3"
                [attr.aria-label]="column.title + ' column'"
              >
                @for (task of getTasksByStatus(column.id); track task.id) {
                  <div
                    cdkDrag
                    class="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move focus:outline-none focus:ring-2 focus:ring-blue-500"
                    [attr.aria-label]="'Task: ' + task.title"
                    role="button"
                    tabindex="0"
                  >
                    <div class="space-y-2">
                      <div class="flex items-start justify-between gap-2">
                        <h3 class="text-sm font-medium text-gray-900 dark:text-white flex-1">
                          {{ task.title }}
                        </h3>
                        <span
                          class="px-2 py-1 text-xs font-medium rounded"
                          [ngClass]="{
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': task.priority === 'urgent',
                            'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300': task.priority === 'high',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': task.priority === 'medium',
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': task.priority === 'low'
                          }"
                        >
                          {{ task.priority }}
                        </span>
                      </div>

                      @if (task.description) {
                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {{ task.description }}
                        </p>
                      }

                      @if (task.tags.length > 0) {
                        <div class="flex flex-wrap gap-1">
                          @for (tag of task.tags; track tag) {
                            <span class="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                              {{ tag }}
                            </span>
                          }
                        </div>
                      }

                      @if (task.dueDate) {
                        <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {{ task.dueDate | date:'MMM d, y' }}
                        </div>
                      }

                      <div class="flex justify-end gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <button
                          (click)="editTask(task)"
                          class="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          (click)="deleteTask(task.id)"
                          class="text-sm text-red-600 dark:text-red-400 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                }

                @if (getTasksByStatus(column.id).length === 0) {
                  <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p class="text-sm">No tasks</p>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TaskBoardComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly projectService = inject(ProjectService);

  readonly loading = this.taskService.loading;
  readonly projects = this.projectService.projects;
  readonly tasksByStatus = this.taskService.tasksByStatus;

  selectedProjectFilter = signal<string>('');

  readonly columns: Column[] = [
    { id: 'todo', title: 'To Do', color: '#94a3b8' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
    { id: 'review', title: 'Review', color: '#8b5cf6' },
    { id: 'done', title: 'Done', color: '#10b981' }
  ];

  ngOnInit(): void {
    this.projectService.loadProjects().subscribe();
    this.loadTasks();
  }

  loadTasks(): void {
    const projectId = this.selectedProjectFilter();
    this.taskService.loadTasks(projectId || undefined).subscribe();
  }

  onProjectFilterChange(): void {
    this.loadTasks();
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasksByStatus()[status] || [];
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const task = event.container.data[event.currentIndex];
    const newStatus = event.container.id as TaskStatus;
    const newOrder = event.currentIndex;

    this.taskService.moveTask(task.id, newStatus, newOrder).subscribe({
      error: () => {
        // Revert on error
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.currentIndex, event.previousIndex);
        } else {
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
        }
      }
    });
  }

  editTask(task: Task): void {
    // Navigate to edit page or open modal
    console.log('Edit task:', task);
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId).subscribe();
    }
  }
}