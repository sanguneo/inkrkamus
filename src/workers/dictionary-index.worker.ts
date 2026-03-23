import { DictionaryDb, ensureDictionaryData, type DictionaryPayload } from '../lib/dictionary-db';

type BuildMessage = {
  type: 'build-index';
  payload: DictionaryPayload;
};

type WorkerResponse =
  | { type: 'index-ready'; h2r: Record<string, string> }
  | { type: 'index-error'; message: string };

const db = new DictionaryDb();

self.onmessage = async (event: MessageEvent<BuildMessage>) => {
  if (event.data?.type !== 'build-index') {
    return;
  }

  try {
    const result = await ensureDictionaryData(db, event.data.payload);
    const response: WorkerResponse = { type: 'index-ready', h2r: result.h2r };
    self.postMessage(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Index build failed';
    const response: WorkerResponse = { type: 'index-error', message };
    self.postMessage(response);
  }
};
