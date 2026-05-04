# SQLProject - React + Node.js + MySQL

פרויקט מלא עם לקוח React, שרת Node.js/Express, ומאגר MySQL.

## מבנה הפרויקט

```
project-root/
├── client/        # React (צד לקוח)
├── server/        # NodeJS + Express (צד שרת)
├── database/      # סכמות + סקריפטים של MySQL
└── docs/          # אפיון, ERD, תרשימים
```

## התקנה והרצה

### 1. הגדרת מאגר המידע

```bash
# התחבר ל-MySQL והרץ:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. הגדרת השרת

```bash
cd server
npm install
# ערוך את קובץ .env עם פרטי החיבור למאגר
npm start
```

השרת ירוץ על http://localhost:3000

### 3. הגדרת הלקוח

```bash
cd client
npm install
npm run dev
```

הלקוח ירוץ על http://localhost:5173

## משתמשים לבדיקה

- Username: `shlomo` | Password: `pass1234`
- Username: `rivka` | Password: `pass5678`
- Username: `moshe` | Password: `pass9012`

## API Endpoints

### Auth
- POST `/auth/login` - התחברות

### Users
- GET `/users` - כל המשתמשים
- GET `/users/:id` - משתמש לפי ID
- GET `/users/:userId/todos` - todos של משתמש
- GET `/users/:userId/posts` - posts של משתמש

### Todos
- POST `/todos` - יצירת todo
- PUT `/todos/:id` - עדכון todo
- DELETE `/todos/:id` - מחיקת todo

### Posts
- GET `/posts` - כל הפוסטים
- POST `/posts` - יצירת post
- PUT `/posts/:id` - עדכון post
- DELETE `/posts/:id` - מחיקת post
- GET `/posts/:postId/comments` - comments של post

### Comments
- POST `/comments` - יצירת comment
- PUT `/comments/:id` - עדכון comment
- DELETE `/comments/:id` - מחיקת comment

## טכנולוגיות

### Client
- React 19
- React Router
- Fetch API
- Vite

### Server
- Node.js
- Express
- MySQL2
- CORS
- dotenv

### Database
- MySQL
