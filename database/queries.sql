USE sqlproject;

-- כל המשתמשים
SELECT * FROM users;

-- כל ה-todos של משתמש מסוים
SELECT * FROM todos WHERE userId = 1 ORDER BY id;

-- כל ה-posts עם שם המשתמש
SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id ORDER BY p.id;

-- כל ה-comments של פוסט מסוים
SELECT * FROM comments WHERE postId = 1 ORDER BY id;

-- todos שלא בוצעו
SELECT * FROM todos WHERE completed = FALSE;
