export default function createFusionWorker() {
  return new Worker(new URL('./fusionWorker.ts', import.meta.url));
}
