import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { TaskFormComponent } from './components/form/task-form';

@Component({
  standalone: true,
  imports: [TaskFormComponent, RouterModule, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // ✅ This tells Angular to allow custom HTML elements from another app
})
export class App {
  title = 'angular-store';
}
