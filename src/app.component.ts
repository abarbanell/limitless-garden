import { Component } from '@angular/core';

@Component({
  selector: 'spa-app',
  template: `
    <div class="container">
      <h1>Hello {{name}} !</h1>
    </div>
    `,
})
export class AppComponent  { name = 'Angular'; }
