interface ImportMetaEnv {
  readonly MY_ENV_VAR: string;
  // Add other environment variables here, like:
  // readonly API_URL: string;
}

interface ImportMetaEnv {
  readonly MODE: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}



