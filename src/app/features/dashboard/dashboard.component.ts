// src/app/features/dashboard/dashboard.component.ts
import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div class="flex gap-3">
          <a
            routerLink="/projects/new"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Project
          </a>
          <a
            routerLink="/tasks/new"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            New Task
          </a>
        </div>
      </div>

      @if (currentUser(); as user) {
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome back, {{ user.name }}!</h2>
          <p class="text-gray-600 dark:text-gray-400">Here's what's happening with your projects today.</p>
        </div>
      }

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Projects</dt>
                  <dd class="text-3xl font-semibold text-gray-900 dark:text-white">{{ projectCount() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Tasks</dt>
                  <dd class="text-3xl font-semibold text-gray-900 dark:text-white">{{ taskCount() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">In Progress</dt>
                  <dd class="text-3xl font-semibold text-gray-900 dark:text-white">{{ inProgressCount() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Completed</dt>
                  <dd class="text-3xl font-semibold text-gray-900 dark:text-white">{{ completedCount() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Projects</h3>
        </div>
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
          @if (projectsLoading()) {
            <li class="px-6 py-4">
              <div class="flex items-center justify-center">
                <svg class="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </li>
          } @else if (projects().length === 0) {
            <li class="px-6 py-4">
              <p class="text-center text-gray-500 dark:text-gray-400">No projects yet. Create your first project to get started!</p>
            </li>
          } @else {
            @for (project of projects(); track project.id) {
              <li class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <a [routerLink]="['/projects', project.id]" class="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center min-w-0 flex-1">
                      <div class="w-3 h-3 rounded-full flex-shrink-0" [style.background-color]="project.color"></div>
                      <div class="ml-4 flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ project.name }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ project.description }}</p>
                      </div>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </a>
              </li>
            }
          }
        </ul>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly taskService = inject(TaskService);
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly projects = this.projectService.projects;
  readonly projectsLoading = this.projectService.loading;
  readonly tasks = this.taskService.tasks;
  readonly tasksByStatus = this.taskService.tasksByStatus;

  readonly projectCount = computed(() => this.projects().length);
  readonly taskCount = computed(() => this.tasks().length);
  readonly inProgressCount = computed(() => this.tasksByStatus()['in-progress'].length);
  readonly completedCount = computed(() => this.tasksByStatus().done.length);

  ngOnInit(): void {
    this.projectService.loadProjects().subscribe();
    this.taskService.loadTasks().subscribe();
  }
}