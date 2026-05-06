USE sqlproject;

SELECT * FROM users;

SELECT * FROM todos WHERE userId = 1 ORDER BY id;

SELECT p.*, u.username FROM posts p JOIN users u ON p.userId = u.id ORDER BY p.id;

SELECT * FROM comments WHERE postId = 1 ORDER BY id;

SELECT * FROM todos WHERE completed = FALSE;
