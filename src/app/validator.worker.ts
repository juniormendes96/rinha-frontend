/// <reference lib="webworker" />

addEventListener('message', ({ data: { file } }) => {
  if (file.type !== 'application/json') {
    return postMessage(false);
  }

  const fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = event => {
    try {
      JSON.parse(event.target?.result as string);
      postMessage(true);
    } catch (error) {
      postMessage(false);
    }
  };
  fileReader.onerror = () => postMessage(false);
});
