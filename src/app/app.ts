import { Component, signal } from '@angular/core';


@Component({
selector: 'app-root',
standalone: true,
imports: [],
template: `
<main class="p-4">
<header>
<h1>TaskFlow</h1>
</header>
<router-outlet></router-outlet>
</main>
`
})
export class AppComponent {
readonly dark = signal(false);
}