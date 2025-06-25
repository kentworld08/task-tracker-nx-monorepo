Nx Monorepo: Angular, React & Node.js
This project is an Nx monorepo containing three applications: an Angular host, a React micro-frontend, and a Node.js Express API. It's designed for efficient development and independent deployment of each part.

Table of Contents
Key Features

Local Setup

Deployment Guide

Contributing

License

Key Features
Unified Development: Manage Angular, React, and Node.js projects from a single repository using Nx Monorepo.

Angular Host (angular-store): A standalone Angular app for task submission, featuring a loading button and custom alerts.

React Micro-frontend (react-store): A standalone React app displaying tasks with live updates (polling every 15 seconds) and interaction (toggle/delete).

Node.js Backend (task-api): A simple REST API for managing tasks.

Seamless Communication: Angular and React apps communicate via browser events (task-added) for instant UI updates.

Independent Deployment: Each frontend application can be deployed separately, while sharing the same backend.

Local Setup
Prerequisites
Ensure Node.js (LTS), npm/Yarn/pnpm, and Git are installed.

Getting Started
Clone the repository:

git clone <your-repository-url>
cd angular-nx-monorepo

Install dependencies (using pnpm is recommended):

pnpm install

# or npm install / yarn install

Run applications locally:

Backend API: npx nx serve task-api (runs on http://localhost:3000)

Angular App: npx nx serve angular-store (runs on http://localhost:4200)

React App: npx nx serve react-store (runs on http://localhost:4201)

# Deployment Guide

This project is set up for Vercel for frontends and Render.com for the backend.

Strategy
The backend API is deployed separately (e.g., Render.com). Both Angular and React frontends are deployed as distinct projects on Vercel from this single monorepo, with each pointing to your live backend API.

Steps
Prepare & Deploy Backend API (Render.com):

Commit all code to GitHub.

Deploy your apps/task-api to Render.com (or your chosen cloud provider).

Crucially, obtain your live backend API URL (e.g., https://your-api.onrender.com).

Deploy Angular Host (angular-store) to Vercel:

Go to Vercel Dashboard -> Add New Project.

Import your angular-nx-monorepo GitHub repository.

Configure Project:

Root Directory: apps/angular-store

Build Command: npx nx build angular-store --prod

Output Directory: dist/apps/angular-store

Environment Variable: Add API_BASE_URL with your live backend API URL.

Click "Deploy".

Deploy React Micro-frontend (react-store) to Vercel:

Repeat the Vercel "Add New Project" process, importing the same GitHub repository.

Configure Project:

Root Directory: apps/react-store

Build Command: npx nx build react-store --prod

Output Directory: dist/apps/react-store

Environment Variable: Add API_BASE_URL (or REACT_APP_API_BASE_URL) with your live backend API URL.

Click "Deploy".

Contributing
Fork, improve, and submit pull requests!

License
MIT License
