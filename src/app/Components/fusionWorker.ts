import { calculateFusions } from "./FusionTableComponent";

// src/fusionWorker.js
self.onmessage = function (e) {
  const {
    data,
    demon,
    fusionDisplayVariants,
    fusionHidePlugins,
    fusionHideFusionOnly,
    fusionDisplayPG,
  } = e.data;

  // Paste calculateFusions logic here or import it if it's pure
  const result = calculateFusions(
    data,
    demon,
    fusionDisplayVariants,
    fusionHidePlugins,
    fusionHideFusionOnly,
    fusionDisplayPG
  );

  postMessage(result);
};
