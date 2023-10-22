/// <reference lib="webworker" />

import untruncateJson from 'untruncate-json';

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

addEventListener('message', ({ data: { file, chunkSizeInBytes } }) => {
  const fileReader = new FileReader();
  fileReader.readAsText(file.slice(0, chunkSizeInBytes));
  fileReader.onload = event => {
    const result = event.target!.result as string;
    const json = untruncateJson(result);
    const parsed = JSON.parse(json);
    const stringified = JSON.stringify(parsed, null, 3);
    const lines = addHtmlTags(stringified).split('\n');
    postMessage(lines);
  };
});
