USE sqlproject;

INSERT INTO users (username, name, email) VALUES
  ('shlomo', 'שלמה כהן', 'shlomo@example.com'),
  ('rivka', 'רבקה לוי', 'rivka@example.com'),
  ('moshe', 'משה ישראלי', 'moshe@example.com');

INSERT INTO passwords (userId, password) VALUES
  (1, 'pass1234'),
  (2, 'pass5678'),
  (3, 'pass9012');

INSERT INTO todos (userId, title, completed) VALUES
  (1, 'לקנות חלב', FALSE),
  (1, 'לסיים שיעורי בית', TRUE),
  (2, 'לשלם חשבונות', FALSE),
  (2, 'לקרוא ספר', TRUE),
  (3, 'לצלצל לאמא', FALSE);

INSERT INTO posts (userId, title, body) VALUES
  (1, 'הפוסט הראשון שלי', 'זהו תוכן הפוסט הראשון'),
  (1, 'עוד פוסט מעניין', 'תוכן מעניין נוסף כאן'),
  (2, 'פוסט של רבקה', 'רבקה כותבת על החיים'),
  (3, 'מחשבות של משה', 'משה חולק את מחשבותיו');

INSERT INTO comments (postId, userId, name, body) VALUES
  (1, 2, 'רבקה', 'פוסט מעולה!'),
  (1, 3, 'משה', 'מסכים לחלוטין'),
  (2, 2, 'רבקה', 'מאוד מעניין'),
  (3, 1, 'שלמה', 'כתיבה יפה');
