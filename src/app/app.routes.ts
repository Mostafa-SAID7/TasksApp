import { Routes } from '@angular/router';
import { TaskBoardComponent } from './features/tasks/task-board/task-board.component';
import { AppComponent } from './app.component';


export const appRoutes: Routes = [
{ path: '', component: TaskBoardComponent },
{ path: '**', redirectTo: '' }
];