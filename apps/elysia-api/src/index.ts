import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createNote, deleteNote, deleteTag, getAllTags, getNoteForId, getNotes, getTagsForNote, getTagSort, saveTags, updateNote, updateSettings, updateTag } from './db';
import { Note } from './models/note';
import { Tag } from './models/tag';
import { join } from 'path';
import archiver from 'archiver';

const { PORT = '3001', ADDRESS = 'localhost' } = process.env;

const app = new Elysia()
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }))
  
  // Health check endpoint
  .get('/health-check', () => ({ status: 'ok' }))
  
  // Notes endpoints
  .get('/notes', async () => {
    const notes = await getNotes();
    return notes;
  })
  
  .get('/notes/:id', async ({ params: { id } }) => {
    const noteId = parseInt(id);
    const note = await getNoteForId(noteId);
    const tags = await getTagsForNote(noteId);
    if (note) {
      note.tags = tags;
    }
    return note;
  })
  
  .post('/notes', async ({ body, set }) => {
    if (!body) {
      set.status = 400;
      return { error: 'Request body is missing' };
    }

    const { title, content } = body as {
      title: string;
      content: string;
    };
    const note = await createNote(title, content);
    return note;
  })
  
  .put('/notes/:id', async ({ params: { id }, body, set }) => {
    const noteId = parseInt(id);

    if (!noteId) {
      set.status = 400;
      return { error: 'Invalid note id' };
    }

    if (!body) {
      set.status = 400;
      return { error: 'Request body is missing' };
    }

    const newNote = body as Note;
    newNote.id = noteId;
    const note = await updateNote(newNote);
    return note;
  })
  
  .delete('/notes/:id', async ({ params: { id } }) => {
    const noteId = parseInt(id);
    const note = await deleteNote(noteId);
    return note;
  })
  
  // Tags endpoints
  .get('/tags', async () => {
    const tags = await getAllTags();
    return tags;
  })
  
  .put('/tags/:id', async ({ params: { id }, body }) => {
    const tagId = parseInt(id);
    const tag = body as Tag;
    tag.id = tagId;
    const result = await updateTag(tag);
    return result;
  })
  
  .delete('/tags/:id', async ({ params: { id }, set }) => {
    const tagId = parseInt(id);
    if (!tagId) {
      set.status = 400;
      return { error: 'Invalid tag id' };
    }

    const tag = await deleteTag(tagId);
    return tag;
  })
  
  // Note tags endpoints
  .post('/notes/:id/tags', async ({ params: { id }, body, set }) => {
    const noteId = parseInt(id);

    if (!noteId) {
      set.status = 400;
      return { error: 'Invalid note id' };
    }

    if (!body) {
      set.status = 400;
      return { error: 'Request body is missing' };
    }

    const tags = body as Tag[];
    await saveTags(noteId, tags);
    const updatedNote = await getNoteForId(noteId);
    return updatedNote;
  })
  
  // Tag sort endpoint
  .get('/tag-sort', async () => {
    const tagSort = await getTagSort();
    return { tagSort };
  })
  
  // Settings endpoints
  .put('/settings/:name', async ({ params: { name }, body, set }) => {
    if (!name) {
      set.status = 400;
      return { error: 'Invalid name param' };
    }

    if (!body) {
      set.status = 400;
      return { error: 'Request body is missing' };
    }

    const data = body as { value: number };
    const result = await updateSettings(name, data.value);
    return result;
  })
  
  // Export endpoint
  .get('/export/data', async ({ set }) => {
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

    archive.on('error', (err) => {
      console.error(err);
      set.status = 500;
      return { error: 'Failed to create archive' };
    });

    // Add files to the archive
    for (const file of files) {
      archive.file(file.path, { name: file.name });
    }

    // Finalize the archive
    await archive.finalize();
    
    set.headers['Content-Type'] = 'application/zip';
    set.headers['Content-Disposition'] = 'attachment; filename=database.zip';
    
    return new Response(archive as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=database.zip'
      }
    });
  })
  
  .listen({
    hostname: ADDRESS,
    port: +PORT
  });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
