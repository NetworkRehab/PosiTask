# Encrypted ToDo App

## Prerequisites
- Node.js (v16+ recommended)
- npm

## Installation
1. Clone or download this repository.
2. Navigate to the root folder and run:
   ```
   npm install
   ```

## Development
- Start the app in dev mode:
  ```
  npm run start
  ```
  This runs both the Electron main process and the React development server.

- You will be prompted for a password. The same password is used to unlock the encrypted SQLite database.

## Build
- To build the app:
  ```
  npm run build
  ```
  Compiles TypeScript files into the `dist` folder.

## Notes
- The database file `encrypted.db` is created and encrypted with SQLCipher when the app runs.  
- Password prompts appear via Electron dialog.  
- Tailwind CSS is used for UI styles, and React handles the frontend.  
- All task data is stored securely and requires the set password to decrypt.
