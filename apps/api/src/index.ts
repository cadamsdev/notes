import Fastify, { FastifyInstance } from 'fastify';
import * as dotenv from 'dotenv';
dotenv.config();
import { createNote, deleteNote, deleteTag, getAllTags, getNoteForId, getNotes, getTagsForNote, getTagSort, saveTags, updateNote, updateSettings, updateTag } from './db';
import { Note } from './models/note';
import { Tag } from './models/tag';
import cors from '@fastify/cors';
import { join } from 'path';
import archiver from 'archiver';

const { PORT = '3001', ADDRESS = 'localhost' } = process.env;

const server: FastifyInstance = Fastify({
  logger: true,
});

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

server.get('/health-check', async (request, reply) => {
  return { status: 'ok' };
});

server.get('/notes', async (request, reply) => {
  const notes = await getNotes();
  return notes;
});

server.get('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const note = await getNoteForId(id);
  const tags = await getTagsForNote(id);
  if (note) {
    note.tags = tags;
  }
  return note;
});

server.post('/notes', async (request, reply) => {
  if (!request.body) {
    reply.code(400).send({ error: 'Request body is missing' });
    return;
  }

  const { title, content } = request.body as {
    title: string;
    content: string;
  };
  const note = await createNote(title, content);
  return note;
});

server.put('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };

  if (!id) {
    reply.code(400).send({ error: 'Invalid note id' });
    return;
  }

  if (!request.body) {
    reply.code(400).send({ error: 'Request body is missing' });
    return;
  }

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
  tag.id = +id;
  const result = await updateTag(tag);
  return result;
});

server.delete('/tags/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  if (!id) {
    reply.code(400).send({ error: 'Invalid tag id' });
    return;
  }

  const tag = await deleteTag(id);
  return tag;
});

server.post('/notes/:id/tags', async (request, reply) => {
  const { id } = request.params as { id: number };

  if (!id) {
    reply.code(400).send({ error: 'Invalid note id' });
    return;
  }

  if (!request.body) {
    reply.code(400).send({ error: 'Request body is missing' });
    return;
  }

  const tags = request.body as Tag[];
  await saveTags(id, tags);
  const updatedNote = await getNoteForId(id);
  return updatedNote;
});

server.get('/tag-sort', async (request, reply) => {
  const tagSort = await getTagSort();
  return { tagSort };
});

server.put('/settings/:name', async (request, reply) => {
  const { name } = request.params as { name: string };
  if (!name) {
    reply.code(400).send({ error: 'Invalid name param' });
    return;
  }

  if (!request.body) {
    reply.code(400).send({ error: 'Request body is missing' });
    return;
  }

  const data = request.body as { value: number };
  const result = await updateSettings(name, data.value);
  return result;
});

server.get('/export/data', async (req, reply) => {
  const workspaceDir = process.cwd();
  const databaseFileNames = [
    'database.sqlite',
    'database.sqlite-shm',
    'database.sqlite-wal',
  ];

  const files = databaseFileNames.map((fileName) => {
    return {
      path: join(workspaceDir, 'data', fileName),
      name: fileName,
    }
  });

  reply.header('Content-Type', 'application/zip');
  reply.header('Content-Disposition', 'attachment; filename=database.zip');

  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level
  });

  archive.on('error', (err) => {
    reply.log.error(err);
    reply.code(500).send({ error: 'Failed to create archive' });
  });

  // Pipe archive data to the reply
  archive.pipe(reply.raw);

  // Add files to the archive
  for (const file of files) {
    archive.file(file.path, { name: file.name });
  }

  // Finalize the archive (ie we are done appending files but streams have to finish yet)
  await archive.finalize();
});

const start = async () => {
  try {
    await server.listen({ host: ADDRESS, port: +PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
