export function createPdfGenerator() {
  const worker = new Worker(new URL('../worker/pdf.worker.js', import.meta.url), { type: 'module' });
  let pending = null;

  worker.onmessage = ({ data: { blob } }) => {
    if (!pending) {
      return;
    }

    const { resolve, startTime } = pending;
    pending = null;
    resolve({ blob, duration: Date.now() - startTime });
  };

  return {
    generate(message) {
      return new Promise((resolve) => {
        pending = { resolve, startTime: Date.now() };
        worker.postMessage(message);
      });
    },
  };
}
