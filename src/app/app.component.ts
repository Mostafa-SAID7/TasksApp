// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-950 text-gray-100 transition-colors duration-300">

      <!-- ── Authenticated: show sidebar nav ── -->
      @if (isAuthenticated()) {
        <div class="flex h-screen overflow-hidden">

          <!-- Sidebar -->
          <aside class="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
            <!-- Logo -->
            <div class="h-16 flex items-center px-6 border-b border-gray-800">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span class="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  TaskFlow
                </span>
              </div>
            </div>

            <!-- Nav links -->
            <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Sidebar navigation">
              <a routerLink="/dashboard"
                routerLinkActive="bg-blue-600/20 text-blue-400 border-blue-500"
                [routerLinkActiveOptions]="{exact: false}"
                class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400
                       hover:bg-gray-800 hover:text-gray-100 border border-transparent transition-all duration-200"
                aria-label="Dashboard">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </a>

              <a routerLink="/projects"
                routerLinkActive="bg-blue-600/20 text-blue-400 border-blue-500"
                class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400
                       hover:bg-gray-800 hover:text-gray-100 border border-transparent transition-all duration-200"
                aria-label="Projects">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Projects
              </a>

              <a routerLink="/tasks"
                routerLinkActive="bg-blue-600/20 text-blue-400 border-blue-500"
                class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400
                       hover:bg-gray-800 hover:text-gray-100 border border-transparent transition-all duration-200"
                aria-label="Tasks">
                <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Task Board
              </a>
            </nav>

            <!-- Bottom: user + theme -->
            <div class="p-3 border-t border-gray-800 space-y-1">
              <!-- Theme toggle -->
              <button (click)="toggleTheme()" type="button"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400
                       hover:bg-gray-800 hover:text-gray-100 transition-all duration-200"
                [attr.aria-label]="currentTheme() === 'light' ? 'Switch to dark mode' : 'Switch to light mode'">
                @if (currentTheme() === 'light') {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                } @else {
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                }
              </button>

              <!-- User + logout -->
              @if (currentUser(); as user) {
                <div class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/50">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <span class="text-xs font-bold text-white">{{ user.name.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-200 truncate">{{ user.name }}</p>
                  </div>
                  <button (click)="logout()" type="button"
                    class="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    aria-label="Logout">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              }
            </div>
          </aside>

          <!-- Main content area -->
          <main class="flex-1 overflow-y-auto bg-gray-950" role="main">
            <div class="max-w-7xl mx-auto px-6 py-8">
              <router-outlet />
            </div>
          </main>
        </div>

      } @else {
        <!-- Unauthenticated: full-page router outlet (login/register) -->
        <router-outlet />
      }
    </div>
  `
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser = this.authService.currentUser;
  readonly currentTheme = this.themeService.theme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }
}