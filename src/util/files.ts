export const textDownload = (filename: string, text: string): void => {
  const blob = new Blob([text], { type: "text/plain" });
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const el = window.document.createElement("a");
    el.href = window.URL.createObjectURL(blob);
    el.download = filename;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }
};

export const readText = (f: File): Promise<string> => {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => {
      const text = r.result;
      res(text);
    };
    r.readAsText(f);
  });
};
