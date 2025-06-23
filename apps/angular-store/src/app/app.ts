import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Form } from './components';

@Component({
  imports: [Form, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ This tells Angular to allow custom HTML elements
})
export class App {
  protected title = 'angular-store';
}
