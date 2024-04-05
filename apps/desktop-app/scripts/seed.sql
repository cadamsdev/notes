create table notes(
  id integer primary key autoincrement not null,
  title text not null,
  content text
);

create table tags(
  id integer primary key autoincrement not null,
  note_id integer not null,
  name text not null,
  FOREIGN KEY (note_id) REFERENCES notes(id)
);
