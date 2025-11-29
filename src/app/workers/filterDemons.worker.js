/// <reference lib="webworker" />

self.onmessage = (e) => {
    const { nameFilter, demonsList, variantDemonsList, hidePlugins, specialFilter, displayVariants, raceFilter, altNames } = e.data;

    let combinedList = [...demonsList];
    if (displayVariants) combinedList = combinedList.concat(variantDemonsList);

    let filteredDemonList = combinedList;

    if (raceFilter) {
        filteredDemonList = combinedList.filter(demon => demon.Race === raceFilter);
    }

    if(specialFilter){
        filteredDemonList = combinedList.filter(demon => demon.Special !== null)
    }

    if (nameFilter) {
        const lowerSearch = nameFilter.toLowerCase().trim();

        filteredDemonList = filteredDemonList.filter((demon) => {
            const lowerDemon = demon.Name.toLowerCase();

            // Direct match for the main name
            if (lowerDemon.includes(lowerSearch)) {
                return true;
            }

            // If no direct match, check altNames
            if (altNames) {
                const matchingAlts = altNames.filter((altName) => {
                    const lowerAlt = altName.Alt.toLowerCase();
                    const lowerAltName = altName.Name.toLowerCase();
                    
                    return (
                        altName.Type === 'Demon' &&
                        lowerAlt.includes(lowerSearch) &&
                        lowerAltName === lowerDemon
                    );
                });

                if (matchingAlts.length > 0) {
                    return true;
                }
            }

            return false;
        });
    }

    if (hidePlugins) {
        filteredDemonList = filteredDemonList.filter(d => !d.Plugin[0]);
    }

    self.postMessage(filteredDemonList);
};
