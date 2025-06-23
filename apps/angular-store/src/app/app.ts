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
  taskText = '';

  // constructor(private http: HttpClient) {}

  addTask(event: Event) {
    event.preventDefault();
    if (!this.taskText.trim()) return;

    // this.http
    //   .post('https://your-json-server-url/tasks', {
    //     title: this.taskText,
    //   })
    //   .subscribe(() => {
    //     // ✅ Dispatch the event to notify React
    //     window.dispatchEvent(new Event('task-added'));
    //     this.taskText = '';
    //   });
  }
}
