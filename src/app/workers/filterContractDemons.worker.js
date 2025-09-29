/// <reference lib="webworker" />

self.onmessage = (e) => {
    const { demonsList, variantDemonsList, contractDemonsList, raceFilter, nameFilter } = e.data;

    const combinedList = [...demonsList, ...variantDemonsList];

    // only demons that can be contracted
    let filteredDemonList = (contractDemonsList && contractDemonsList.length > 0)
        ? combinedList.filter((demon) =>
            contractDemonsList.some((loc) => loc.Name === demon.Name)
        )
        : combinedList;

    // Optional name filter
    if (nameFilter) {
        filteredDemonList = filteredDemonList.filter(demon =>
            demon.Name.toLowerCase().includes(nameFilter.toLowerCase())
        );
    }

    // Optional race filter
    if (raceFilter) {
        filteredDemonList = filteredDemonList.filter(demon => demon.Race === raceFilter);
    }

    self.postMessage(filteredDemonList);
};
