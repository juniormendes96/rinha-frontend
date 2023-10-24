export interface ValidatorWorker extends Omit<Worker, 'postMessage'> {
  postMessage(data: ValidatorWorkerData): void;
}

export interface ValidatorWorkerData {
  file: File;
}

export type ValidatorWorkerResult = boolean;
