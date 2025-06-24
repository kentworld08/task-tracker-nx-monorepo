// apps/angular-store/src/app/components/form/task-form.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Still need to import HttpClient for type definition and inject()

// Define an interface for your task data, matching the backend's expected structure
interface Task {
  id?: string; // Optional, as backend will generate it
  text: string;
  day: string;
  reminder: boolean;
}

@Component({
  standalone: true, // This component is standalone
  selector: 'app-form', // Ensure this matches the HTML tag you'll use
  templateUrl: './task-form.html', // Point to its HTML file
  styleUrls: ['./task-form.css'], // Point to its CSS file
  imports: [
    CommonModule, // For Angular's common directives like ngIf, ngFor
    FormsModule, // For [(ngModel)] (two-way data binding)
    // IMPORTANT: HttpClient is NOT imported here. It's provided globally via app.config.ts
  ],
})
export class TaskFormComponent {
  // Class name matches the file: TaskFormComponent
  text = ''; // Initialized values (removes ESLint inferrable-types warning)
  day = '';
  reminder = false;

  private readonly API_BASE_URL =
    'https://task-tracker-nx-monorepo-web-server.onrender.com';
  // private readonly API_BASE_URL = 'http://localhost:3000'; // Uncomment for local backend testing

  // Use inject() to get the HttpClient instance (configured in app.config.ts)
  private http = inject(HttpClient);

  onSubmit(): void {
    if (!this.text || !this.day) {
      alert('Please add a task and day.');
      return;
    }

    const newTask: Task = {
      text: this.text,
      day: this.day,
      reminder: this.reminder,
    };

    console.log(
      'Angular (TaskFormComponent): Attempting to add new task:',
      newTask
    );

    this.http.post<Task>(`${this.API_BASE_URL}/api/tasks`, newTask).subscribe({
      next: (responseTask) => {
        console.log(
          'Angular (TaskFormComponent): Task added successfully!',
          responseTask
        );
        window.dispatchEvent(new CustomEvent('task-added')); // Dispatch event for React

        // Clear the form fields
        this.text = '';
        this.day = '';
        this.reminder = false;
      },
      error: (error) => {
        console.error('Angular (TaskFormComponent): Error adding task:', error);
        alert(`Failed to add task: ${error.message || 'Unknown error'}`);
      },
    });
  }
}
