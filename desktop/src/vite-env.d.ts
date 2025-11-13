/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_TEST_DB: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
