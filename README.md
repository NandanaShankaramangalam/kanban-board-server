# Collaborative Kanban Board with Chat and AI Bot

## Overview

This project is a **Collaborative Kanban Board** application built to enhance task management and team collaboration. It features real-time chat, task management across different board columns, and an integrated AI bot that provides assistance and task summaries.

## Features

### 1. Board Management
- **Create Kanban boards** with fixed columns: "To Do," "In Progress," and "Done."
- Add and remove members from the board using a static list of dummy users.

### 2. Task Management
- Create, edit, delete, and move tasks between columns.
- Assign tasks to members from the predefined user list.

### 3. Chat Interface
- Real-time chat functionality associated with each board.
- Support for **mentions** (`Shift + @`) to tag users from the member list.

### 4. AI Bot Integration
- Mention the bot (`@AI`) in the chat to:
  - List tasks pending in the "To Do" column.
  - Summarize the current state of tasks (e.g., "3 tasks in To Do, 2 in Progress, 1 Done").
- Integrated with **OpenAI's GPT-3.5 API** for generating responses.

### 5. Real-Time Updates
- Live updates for:
  - Task movements and changes.
  - Chat messages and bot responses.

How to start
1. Run: git clone https://github.com/NandanaShankaramangalam/kanban-board-server.git
2. CD into the folder
3. Run: npm install
4. Run: npm start

Note: Create a .env file based on .env.example and add your environment variables.
