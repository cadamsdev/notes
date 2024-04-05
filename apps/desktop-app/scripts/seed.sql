create table notes(
  id integer primary key autoincrement not null,
  title text not null,
  content text
);

create table tags(
  id integer primary key autoincrement not null,
  name text not null,
  UNIQUE (name)
);

create table note_tags (
  note_id integer NOT NULL,
  tag_id integer NOT NULL,
  primary key (note_id, tag_id),
  foreign key (note_id) references notes(id),
  foreign key (tag_id) references tags(id)
);
