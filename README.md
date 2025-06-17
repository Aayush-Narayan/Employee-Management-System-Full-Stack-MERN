# Employee Management System

A full-stack MERN (MySQL, Express.js, React, Node.js) application to streamline employee administration including attendance, leave, and payroll management.

---
```text
# Directories

Employee-Management-System-Full-Stack-MERN/
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/
│   ├── .env
│   ├── config.py
│   ├── app.py
│   ├── models/
│   ├── routes/
│   └── ...
├── database/
│   └── schema.sql
├── venv/
├── README.md
└── ...
```
## 🔧 Tech Stack

* **Frontend:** React.js, TypeScript, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** MySQL
* **Auth:** JWT (JSON Web Tokens), BCRYPT

---

## 📦 Features

### 🧑 Employee Dashboard

* View & edit profile
* Mark attendance
* Apply for leaves
* View payroll

### 👨‍💼 Admin Dashboard

* Approve employee registrations
* Manage employee details
* Track attendance & leave
* Manage payroll

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aayush-Narayan/Employee-Management-System-Full-Stack-MERN.git
cd Employee-Management-System-Full-Stack-MERN
```

### 2. Set Up the Backend

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=employee_management
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the backend:

```bash
npm run dev
```

---

### 3. Set Up the Frontend

```bash
cd ../Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

---

### 4. Import Database Schema

Run this in your terminal:

```bash
mysql -u root -p < Database/schema.sql
```

---

## 📷 Screenshots

> Added screenshots to `/screenshots` and reference them here:

```
![Screenshot 2025-06-12 202643](https://github.com/user-attachments/assets/d0acd2db-3e09-4ee7-82b9-3e251449e90f)
![Screenshot 2025-06-12 202654](https://github.com/user-attachments/assets/738c8c94-3105-4b90-a288-d64b2aeb36c5)
![Screenshot 2025-06-12 202703](https://github.com/user-attachments/assets/644ddebd-cb6d-4342-b920-82737711536d)
![Screenshot 2025-06-12 202757](https://github.com/user-attachments/assets/4689166a-1624-4f78-919f-feff14d71043)
![Screenshot 2025-06-12 202829](https://github.com/user-attachments/assets/710f5866-5eea-416d-837f-870e848c766f)
![Screenshot 2025-06-12 202739](https://github.com/user-attachments/assets/5b788dcb-cd06-4eca-a844-1ac32f99d111)

```

---

## 📫 Contact

For queries or support:
📧 [2201020963@cgu-odisha.ac.in](mailto:2201020963@cgu-odisha.ac.in)

---

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

# Employee-Management-System-Full-Stack-MERN
This project is a comprehensive Employee Management System designed to streamline administrative tasks for organizations. It provides a robust backend API with features for employee onboarding, attendance tracking, leave management, payroll processing, and role-based access control.

Things I used here
---

## 🔧 Step 1: Open `.gitignore` and edit it

In your code editor, open the `.gitignore` file. You’ll see conflict markers like this:

```gitignore
<<<<<<< HEAD
Backend/node_modules
Frontend/node_modules
Backend/dist
Backend/.env
venv/
Frontend/.env
node_modules/
=======
# Logs
logs
*.log
… (other ignore patterns)
>>>>>>> origin/main
```

Decide what entries to keep—either your version, the remote version, or merge them both. For example, combining both sets:

```gitignore
# Project dependencies
Backend/node_modules
Frontend/node_modules
node_modules/

# Build outputs and env files
Backend/dist
Backend/.env
Frontend/.env
venv/

# Log files
logs/
*.log
… (rest of patterns)
```

Save the file after removing the `<<<<<<<`, `=======`, and `>>>>>>>` lines.

---

## ✅ Step 2: Stage the resolved file

```bash
git add .gitignore
```

---

## 📝 Step 3: Commit the merge resolution

```bash
git commit -m "Resolve merge conflict in .gitignore"
```

This finalizes the merge process, as outlined in the GitHub docs ([stackoverflow.com][1], [docs.github.com][2], [app.studyraid.com][3]).

---

## 🚀 Step 4: Push your changes to GitHub

```bash
git push -u origin main
```

Your local and remote branches are now synchronized.

---

Let me know if you'd like help verifying the final `.gitignore` or navigating other merge issues!

[1]: https://stackoverflow.com/questions/12160676/merge-conflict-in-gitignore?utm_source=chatgpt.com "Merge conflict in .gitignore - Stack Overflow"
[2]: https://docs.github.com/articles/resolving-a-merge-conflict-using-the-command-line?utm_source=chatgpt.com "Resolving a merge conflict using the command line - GitHub Docs"
[3]: https://app.studyraid.com/en/read/15176/525734/merging-gitignore-changes-without-conflicts?utm_source=chatgpt.com "Merging .gitignore changes without conflicts - StudyRaid"

---

