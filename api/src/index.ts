import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as dotenv from 'dotenv';
dotenv.config();
import { createNote, deleteNote, deleteTag, getAllTags, getNoteForId, getNotes, getTagsForNote, getTagSort, saveTags, updateNote, updateSettings, updateTag } from './db';
import { Note } from './models/note';
import { Tag } from './models/tag';
import { join } from 'path';
import archiver from 'archiver';

const { PORT = '3001', ADDRESS = 'localhost' } = process.env;

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get('/health-check', async (c) => {
  return c.json({ status: 'ok' });
});

app.get('/notes', async (c) => {
  const notes = await getNotes();
  return c.json(notes);
});

app.get('/notes/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const note = await getNoteForId(id);
  const tags = await getTagsForNote(id);
  if (note) {
    note.tags = tags;
  }
  return c.json(note);
});

app.post('/notes', async (c) => {
  const body = await c.req.json();
  if (!body) {
    return c.json({ error: 'Request body is missing' }, 400);
  }

  const { title, content } = body as {
    title: string;
    content: string;
  };
  const note = await createNote(title, content);
  return c.json(note);
});

app.put('/notes/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  if (!id) {
    return c.json({ error: 'Invalid note id' }, 400);
  }

  const body = await c.req.json();
  if (!body) {
    return c.json({ error: 'Request body is missing' }, 400);
  }

  const newNote = body as Note;
  newNote.id = id;
  const note = await updateNote(newNote);
  return c.json(note);
});

app.delete('/notes/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const note = await deleteNote(id);
  return c.json(note);
});

app.get('/tags', async (c) => {
  const tags = await getAllTags();
  return c.json(tags);
});

app.put('/tags/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const tag = body as Tag;
  tag.id = id;
  const result = await updateTag(tag);
  return c.json(result);
});

app.delete('/tags/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  if (!id) {
    return c.json({ error: 'Invalid tag id' }, 400);
  }

  const tag = await deleteTag(id);
  return c.json(tag);
});

app.post('/notes/:id/tags', async (c) => {
  const id = parseInt(c.req.param('id'));

  if (!id) {
    return c.json({ error: 'Invalid note id' }, 400);
  }

  const body = await c.req.json();
  if (!body) {
    return c.json({ error: 'Request body is missing' }, 400);
  }

  const tags = body as Tag[];
  await saveTags(id, tags);
  const updatedNote = await getNoteForId(id);
  return c.json(updatedNote);
});

app.get('/tag-sort', async (c) => {
  const tagSort = await getTagSort();
  return c.json({ tagSort });
});

app.put('/settings/:name', async (c) => {
  const name = c.req.param('name');
  if (!name) {
    return c.json({ error: 'Invalid name param' }, 400);
  }

  const body = await c.req.json();
  if (!body) {
    return c.json({ error: 'Request body is missing' }, 400);
  }

  const data = body as { value: number };
  const result = await updateSettings(name, data.value);
  return c.json(result);
});

app.get('/export/data', async (c) => {
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

  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level
  });

  // Collect archive data in a buffer
  const chunks: Uint8Array[] = [];
  
  archive.on('data', (chunk: Buffer) => {
    chunks.push(new Uint8Array(chunk));
  });

  archive.on('error', (err) => {
    console.error(err);
    throw new Error('Failed to create archive');
  });

  // Add files to the archive
  for (const file of files) {
    archive.file(file.path, { name: file.name });
  }

  // Finalize the archive
  archive.finalize();

  // Wait for archive to finish
  await new Promise((resolve, reject) => {
    archive.on('end', resolve);
    archive.on('error', reject);
  });

  // Concatenate chunks
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  // Return the archive as a response
  c.header('Content-Type', 'application/zip');
  c.header('Content-Disposition', 'attachment; filename=database.zip');
  
  return c.body(result);
});

const start = async () => {
  try {
    console.log(`Server starting on http://${ADDRESS}:${PORT}`);
    
    // Use Bun.serve for optimal performance with Bun
    Bun.serve({
      port: +PORT,
      hostname: ADDRESS,
      fetch: app.fetch,
    });
    
    console.log(`Server running on http://${ADDRESS}:${PORT}`);
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
};

start();
