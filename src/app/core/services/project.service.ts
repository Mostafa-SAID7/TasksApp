// src/app/core/services/project.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Project, CreateProjectDto } from '../models/project.model';

const API_URL = 'http://localhost:3000/api';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly http = inject(HttpClient);

  private readonly projectsSignal = signal<Project[]>([]);
  private readonly selectedProjectIdSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly projects = this.projectsSignal.asReadonly();
  readonly selectedProjectId = this.selectedProjectIdSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly selectedProject = computed(() => {
    const id = this.selectedProjectIdSignal();
    return id ? this.projectsSignal().find(p => p.id === id) : null;
  });

  loadProjects(): Observable<Project[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http.get<Project[]>(`${API_URL}/projects`).pipe(
      tap({
        next: projects => {
          this.projectsSignal.set(projects);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(err.message || 'Failed to load projects');
          this.loadingSignal.set(false);
        }
      })
    );
  }

  createProject(dto: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(`${API_URL}/projects`, dto).pipe(
      tap(project => {
        this.projectsSignal.update(projects => [...projects, project]);
      })
    );
  }

  updateProject(id: string, updates: Partial<CreateProjectDto>): Observable<Project> {
    return this.http.patch<Project>(`${API_URL}/projects/${id}`, updates).pipe(
      tap(updated => {
        this.projectsSignal.update(projects =>
          projects.map(p => p.id === id ? updated : p)
        );
      })
    );
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/projects/${id}`).pipe(
      tap(() => {
        this.projectsSignal.update(projects => projects.filter(p => p.id !== id));
        if (this.selectedProjectIdSignal() === id) {
          this.selectedProjectIdSignal.set(null);
        }
      })
    );
  }

  selectProject(id: string | null): void {
    this.selectedProjectIdSignal.set(id);
  }
}