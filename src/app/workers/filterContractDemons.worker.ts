/// <reference lib="webworker" />

interface FilterData {
  demonsList: Demon[];
  variantDemonsList: Demon[];
  contractDemonsList: DemonLocation[];
  raceFilter: string;
}

self.onmessage = (e: MessageEvent<FilterData>) => {
  const { demonsList, variantDemonsList, contractDemonsList, raceFilter } = e.data;

  const combinedList = [...demonsList, ...variantDemonsList];

  // Only demons that appear in the contract list
  let filteredDemonList = combinedList.filter((demon) =>
    contractDemonsList.some((loc) => loc.Name === demon.Name)
  );

  // Optional race filter
  if (raceFilter) {
    filteredDemonList = filteredDemonList.filter((demon) => demon.Race === raceFilter);
  }

  self.postMessage(filteredDemonList);
};