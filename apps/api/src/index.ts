import Fastify, { FastifyInstance } from 'fastify';
import * as dotenv from 'dotenv';
dotenv.config();
import { createNote, deleteNote, deleteTag, getAllTags, getNoteForId, getNotes, updateNote, updateTag } from './db';
import { Note } from './models/note';
import { Tag } from './models/tag';

const server: FastifyInstance = Fastify({
  logger: true,
});

server.get('/notes', async (request, reply) => {
  const notes = await getNotes();
  return notes;
});

server.get('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const note = await getNoteForId(id);
  return note;
});

server.post('/notes', async (request, reply) => {
  const { title, content } = request.body as { title: string; content: string };
  const note = await createNote(title, content);
  return note;
});

server.put('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const newNote = request.body as Note;
  newNote.id = id;
  const note = await updateNote(newNote);
  return note;
});

server.delete('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const note = await deleteNote(id);
  return note;
});

server.get('/tags', async (request, reply) => {
  const tags = await getAllTags();
  return tags;
});

server.put('/tags/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const tag = request.body as Tag;
  tag.id = id;
  const result = await updateTag(tag);
  return result;
});

server.delete('/tags/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const tag = await deleteTag(id);
  return tag;
});

const start = async () => {
  try {
    await server.listen({ port: 3001 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
