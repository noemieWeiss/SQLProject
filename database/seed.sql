USE sqlproject;

INSERT INTO users (username, name, email) VALUES
  ('shlomo', 'שלמה כהן', 'shlomo@example.com'),
  ('rivka', 'רבקה לוי', 'rivka@example.com'),
  ('moshe', 'משה ישראלי', 'moshe@example.com'),
  ('Noemie', 'נעמי וייס', 'nw3996@gmail.com');

INSERT INTO passwords (userId, password) VALUES
  (1, 'pass1234'),
  (2, 'pass5678'),
  (3, 'pass9012'),
  (4, 'pass3456');

INSERT INTO todos (userId, title, completed) VALUES
  (1, 'לקנות חלב', FALSE),
  (1, 'לסיים שיעורי בית', TRUE),
  (2, 'לשלם חשבונות', FALSE),
  (2, 'לקרוא ספר', TRUE),
  (3, 'לצלצל לאמא', FALSE),
  (4, 'לכתוב דיווח', TRUE);

INSERT INTO posts (userId, title, body) VALUES
  (1, 'הפוסט הראשון שלי', 'זהו תוכן הפוסט הראשון'),
  (1, 'עוד פוסט מעניין', 'תוכן מעניין נוסף כאן'),
  (2, 'פוסט של רבקה', 'רבקה כותבת על החיים'),
  (3, 'מחשבות של משה', 'משה חולק את מחשבותיו'),
  (4, 'מחשבות של נעמי', 'נעמי חולק את מחשבותיה');

INSERT INTO albums (userId, title) VALUES
  (1, 'אלבום של שלמה'),
  (1, 'תמונות משפחה'),
  (2, 'אלבום של רבקה'),
  (3, 'אלבום של משה'),
  (4, 'אלבום של נעמי');

INSERT INTO photos (albumId, title, url) VALUES
  (1, 'תמונה 1', 'https://picsum.photos/id/1/200/200'),
  (1, 'תמונה 2', 'https://picsum.photos/id/2/200/200'),
  (2, 'תמונה 3', 'https://picsum.photos/id/3/200/200'),
  (3, 'תמונה 4', 'https://picsum.photos/id/4/200/200'),
  (4, 'תמונה 5', 'https://picsum.photos/id/5/200/200');


  (1, 2, 'רבקה', 'rivka@example.com', 'פוסט מעולה!'),
  (1, 3, 'משה', 'moshe@example.com', 'מסכים לחלוטין'),
  (2, 2, 'רבקה', 'rivka@example.com', 'מאוד מעניין'),
  (3, 1, 'שלמה', 'shlomo@example.com', 'כתיבה יפה');
