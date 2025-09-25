/// <reference lib="webworker" />

self.onmessage = (e) => {
  const { demonsList, variantDemonsList, hidePlugins, displayVariants, raceFilter } = e.data;

  let combinedList = [...demonsList];
  if (displayVariants) combinedList = combinedList.concat(variantDemonsList);

  let filteredDemonList = combinedList;
  if (raceFilter) {
    filteredDemonList = combinedList.filter(demon => demon.Race === raceFilter);
  }

  if (hidePlugins) {
    filteredDemonList = filteredDemonList.filter(d => !d.Plugin[0]);
  }

  self.postMessage(filteredDemonList);
};
