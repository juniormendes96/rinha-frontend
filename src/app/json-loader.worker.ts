/// <reference lib="webworker" />

import untruncateJson from 'untruncate-json';

addEventListener('message', ({ data: { file, chunkSizeInBytes } }) => {
  const fileReader = new FileReader();
  fileReader.readAsText(file.slice(0, chunkSizeInBytes));
  fileReader.onload = event => {
    const result = event.target?.result as string;
    const json = untruncateJson(result);
    postMessage(JSON.parse(json));
  };
});
