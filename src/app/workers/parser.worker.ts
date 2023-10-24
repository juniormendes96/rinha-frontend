/// <reference lib="webworker" />

import untruncateJson from 'untruncate-json';
import { ParserWorkerData, ParserWorkerResult } from './parser.worker.types';

const bracketsAndCurlyBraces = ['[', ']', '{', '}'];

const removeQuotesAndColon = (value: string) => value.slice(1, -2);

const addHtmlTags = (jsonString: string) => {
  /* Negative lookahead to match only values outside quotes */
  const keyOrBracketsOrCurlyBracesPattern = /(\{|\}|\[|\]|("[^"]+":))(?=(?:(?:[^"]*"){2})*[^"]*$)/g;

  return jsonString.replace(keyOrBracketsOrCurlyBracesPattern, match => {
    if (bracketsAndCurlyBraces.includes(match)) {
      return `<span class="text-[#F2CAB8]">${match}</span>`;
    }
    return `<span class="text-[#4E9590]">${removeQuotesAndColon(match)}</span>:`;
  });
};

addEventListener('message', ({ data: { file, chunkSizeInBytes } }: MessageEvent<ParserWorkerData>) => {
  const fileReader = new FileReader();
  fileReader.readAsText(file.slice(0, chunkSizeInBytes));
  fileReader.onload = event => {
    const result = event.target!.result as string;
    const json = untruncateJson(result);
    const parsed = JSON.parse(json);
    const stringified = JSON.stringify(parsed, null, 3);
    const rows = addHtmlTags(stringified).split('\n');
    const message: ParserWorkerResult = { status: 'success', rows };
    postMessage(message);
  };
  fileReader.onerror = () => {
    const message: ParserWorkerResult = { status: 'error', rows: [] };
    postMessage(message);
  };
});
