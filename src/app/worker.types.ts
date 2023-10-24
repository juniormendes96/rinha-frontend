export interface ParserWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: ParserWorkerData): void;
}

export interface ParserWorkerData {
  file: File;
  chunkSizeInBytes: number;
}

export interface ParserWorkerResult {
  status: 'success' | 'error';
  rows: string[];
}

export interface ValidatorWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: ValidatorWorkerData): void;
}

export interface ValidatorWorkerData {
  file: File;
}

export type ValidatorWorkerResult = boolean;
