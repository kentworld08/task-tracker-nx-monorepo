import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

interface Task {
  id?: string;
  text: string;
  day: string;
  reminder: boolean;
}

@Component({
  standalone: true,
  selector: 'app-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class Form {
  private http = inject(HttpClient);

  text = '';
  day = '';
  reminder = false;
  isLoading = false;

  private readonly API_BASE_URL =
    'https://task-tracker-nx-monorepo-web-server.onrender.com';

  onSubmit(): void {
    // Basic client-side validation
    if (!this.text || !this.day) {
      alert('Please add a task and day.');
      return;
    }
    this.isLoading = true;

    // Create the new task object from the form data
    const newTask: Task = {
      text: this.text,
      day: this.day,
      reminder: this.reminder,
    };

    console.log(
      'Angular (FormComponent): Attempting to add new task:',
      newTask
    );

    // Send POST request to your backend API
    this.http.post<Task>(`${this.API_BASE_URL}/api/tasks`, newTask).subscribe({
      next: (responseTask) => {
        // Log success and dispatch the custom event
        console.log(
          'Angular (FormComponent): Task added successfully!',
          responseTask
        );
        alert('Task added successfully!');

        // --- CRUCIAL FOR CROSS-APP COMMUNICATION ---
        // Dispatch a custom browser event to notify the React application
        // that a new task has been added to the backend.
        window.dispatchEvent(new CustomEvent('task-added'));

        // Clear the form fields after successful submission
        this.text = '';
        this.day = '';
        this.reminder = false;
        this.isLoading = false;
      },
      error: (error) => {
        // Log and display error if the request fails
        console.error('Angular (FormComponent): Error adding task:', error);
        alert(`Failed to add task: ${error.message || 'Unknown error'}`);
      },
    });
  }
}
