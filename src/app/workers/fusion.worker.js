/// <reference lib="webworker" />

export { }

self.onmessage = (e) => {
    const {
        demon,
        data,
        fusionNameFilter,
        fusionRaceFilter,
        fusionHidePlugins,
        fusionHideFusionOnly,
        fusionDisplayVariants,
        fusionDisplayPG,
    } = e.data;

    const demonsList = data.demonsList ?? [];
    const variantDemonsList = data.variantDemonsList ?? [];
    const raceCombinations = data.raceCombinations ?? [];
    const contractDemonsList = data.contractDemonsList ?? [];

    const contractDemonNamesSet = new Set(contractDemonsList.map(d => d.Name));
    const filteredCombinations = raceCombinations.filter(target => demon.Race === target.Race);
    const combinations = filteredCombinations
        ? filteredCombinations.flatMap(race =>
            race.Combinations?.map(comb => ({ race1: comb[0], race2: comb[1] })) || []
        )
        : [];
    const allValidFusions = [];

    function isPGOnly(range) {
        return Array.isArray(range) && range[0] === 'PG Only';
    }

    if (demon.Race === 'Element') {
        const elementFusions = [];
        if (demon.Special) {
            const specialCombos = demon.Special
            for (let k = 0; k < specialCombos.length; k++) {
                const raceRanks = demonsList
                    .filter(d => d.Race === specialCombos[k][0] && !d.Variant);

                for (let i = 0; i < raceRanks.length; i++) {
                    for (let j = i + 1; j < raceRanks.length; j++) {
                        elementFusions.push({ demon1: raceRanks[i], demon2: raceRanks[j] });
                    }
                }
            }
        }
        allValidFusions.push(...elementFusions);
    } else {
        if (demon.Special) {
            demon.Special.forEach(combination => {
                const demon1 = demonsList.find(d => d.Name === combination[0]) || variantDemonsList.find(d => d.Name === combination[0]);
                const demon2 = demonsList.find(d => d.Name === combination[1]) || variantDemonsList.find(d => d.Name === combination[1]);
                if (demon1 && demon2) {
                    if (combination.length > 2) {
                        const demon3 = demonsList.find(d => d.Name === combination[2]) || variantDemonsList.find(d => d.Name === combination[2]);
                        allValidFusions.push({ demon1, demon2, demon3 });
                    } else {
                        allValidFusions.push({ demon1, demon2 });
                    }
                }
            });
        } else {
            let validElementFusions = [];
            if (demon.Range && typeof demon.Range[0] === 'number' && filteredCombinations && filteredCombinations[0].Elements) {
                const raceRanks = demonsList
                    .filter(d => d.Race === demon.Race && !d.Variant && !d.Special && d.Range && d.Range[0] !== 'PG Only');
                const targetRank = raceRanks.findIndex(d => d.Name === demon.Name);
                const elements = [
                    demonsList.find(d => d.Name === 'Erthys'),
                    demonsList.find(d => d.Name === 'Aeros'),
                    demonsList.find(d => d.Name === 'Aquans'),
                    demonsList.find(d => d.Name === 'Flamies')
                ];
                for (let i = 0; i < 4; i++) {
                    if (filteredCombinations[0].Elements[i] === 'Down') {
                        const nextDemon = raceRanks[targetRank + 1]
                        if (nextDemon) {
                            if (isPGOnly(nextDemon.Range) || nextDemon.Special !== null) {
                                for (let j = 2; j < raceRanks.length - targetRank; j++) {
                                    const next = raceRanks[targetRank + j];
                                    if (!next) break;

                                    validElementFusions.push({ demon1: elements[i], demon2: next });

                                    const isNormal =
                                        next.Special === null &&
                                        Array.isArray(next.Range) &&
                                        next.Range[0] !== 'PG Only';

                                    if (isNormal) break;
                                }
                            } else {
                                validElementFusions.push({ demon1: elements[i], demon2: nextDemon });
                            }
                        }
                    } else {
                        const nextDemon = raceRanks[targetRank - 1]
                        if (nextDemon) {
                            if (isPGOnly(nextDemon.Range) || nextDemon.Special !== null) {
                                for (let j = 2; j < raceRanks.length - targetRank; j++) {
                                    const next = raceRanks[targetRank - j];
                                    if (!next) break;

                                    validElementFusions.push({ demon1: elements[i], demon2: next });

                                    const isNormal =
                                        next.Special === null &&
                                        Array.isArray(next.Range) &&
                                        next.Range[0] !== 'PG Only';

                                    if (isNormal) break;
                                }
                            } else {
                                validElementFusions.push({ demon1: elements[i], demon2: nextDemon });
                            }
                        }
                    }
                }
            }
            if (fusionHidePlugins) {
                validElementFusions = validElementFusions.filter(d => !d.demon2.Plugin[0]);
            }
            if (fusionHideFusionOnly) {
                validElementFusions = validElementFusions.filter(d => contractDemonNamesSet.has(d.demon2.Name) || (d.demon2.Range && d.demon2.Range[0] === 'PG Only'));
            }
            allValidFusions.push(...validElementFusions);

            combinations.forEach(comb => {
                const allDemon1s = demonsList.filter(d => d.Race === comb.race1);
                const allVariantDemon1s = variantDemonsList.filter(d => d.Race === comb.race1);
                let filteredDemon1s = fusionDisplayVariants ? [...allDemon1s, ...allVariantDemon1s] : [...allDemon1s]

                if (fusionHidePlugins) {
                    filteredDemon1s = filteredDemon1s
                        .filter(d => d.Plugin[0] === false)
                }

                if (fusionHideFusionOnly) {
                    filteredDemon1s = filteredDemon1s
                        .filter(d => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === 'PG Only') || d.hasPG);
                }

                const allDemon2s = demonsList.filter(d => d.Race === comb.race2);
                const allVariantDemon2s = variantDemonsList.filter(d => d.Race === comb.race2);
                let filteredDemon2s = fusionDisplayVariants ? [...allDemon2s, ...allVariantDemon2s] : [...allDemon2s]

                if (fusionHidePlugins) {
                    filteredDemon2s = filteredDemon2s
                        .filter(d => d.Plugin[0] === false)
                }

                if (fusionHideFusionOnly) {
                    filteredDemon2s = filteredDemon2s
                        .filter(d => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === 'PG Only') || d.hasPG);
                }
                let hide = false

                filteredDemon1s.forEach(d1 => {
                    filteredDemon2s.forEach(d2 => {
                        if (
                            fusionNameFilter &&
                            fusionNameFilter !== '' &&
                            (!d1.Name.toLowerCase().includes(fusionNameFilter.toLowerCase()) &&
                            !d2.Name.toLowerCase().includes(fusionNameFilter.toLowerCase()))
                        ) {
                            hide = true
                        }
                        if (
                            fusionRaceFilter &&
                            fusionRaceFilter !== '' &&
                            (!d1.Race.toLowerCase().includes(fusionRaceFilter.toLowerCase()) &&
                            !d2.Race.toLowerCase().includes(fusionRaceFilter.toLowerCase()))
                        ) {
                            hide = true
                        }
                        const levelRange = d1.Level + d2.Level;
                        if (
                            Array.isArray(demon.Range) &&
                            typeof demon.Range[0] === 'number' &&
                            (demon.Range[1] === null ||
                                demon.Range[1] === undefined ||
                                typeof demon.Range[1] === 'number'
                            )
                            && !hide
                        ) {
                            if (levelRange >= demon.Range[0] && (!demon.Range[1] || levelRange <= demon.Range[1])) {
                                if (fusionDisplayPG) {
                                    if ((d2.Range && d2.Range[0] === 'PG Only') || d2.hasPG) {
                                        allValidFusions.push({ demon1: d1, demon2: d2 });
                                    }
                                } else {
                                    allValidFusions.push({ demon1: d1, demon2: d2 });
                                }
                            }
                        }
                        hide = false
                    })
                })
            })
        }
    }

    self.postMessage(allValidFusions);
};