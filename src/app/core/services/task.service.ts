import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Task } from '../../models/task';
import { tasksSignal } from '../../state/tasks.signal';


@Injectable({ providedIn: 'root' })
export class TaskService {
private readonly http = inject(HttpClient);


async loadAll(): Promise<void> {
// placeholder for API call
const mock: Task[] = [
{ id: '1', title: 'Hello world', status: 'todo', order: 1, description: '', projectId: null }
];
tasksSignal.set(mock);
}


create(task: Task): void {
tasksSignal.update(curr => [...curr, task]);
}


update(updated: Task): void {
tasksSignal.update(curr => curr.map(t => t.id === updated.id ? updated : t));
}


remove(id: string): void {
tasksSignal.update(curr => curr.filter(t => t.id !== id));
}
}