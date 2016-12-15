import { Component } from '@angular/core';


@Component({
  selector: 'spa-app',
  template: `
    <navbar></navbar>
    <div class="container">
      <h1>Hello {{name}} !</h1>
    </div>
    `,
})
export class AppComponent  { name = 'Limitless Spa'; }
