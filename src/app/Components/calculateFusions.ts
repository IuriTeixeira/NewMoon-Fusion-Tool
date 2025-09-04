/*export function calculateFusions({
    demon,
    data,
    fusionHidePlugins,
    fusionHideFusionOnly,
    fusionDisplayVariants,
    fusionDisplayPG,
}: {
    demon: Demon;
    data: Data
    fusionHidePlugins: boolean;
    fusionHideFusionOnly: boolean;
    fusionDisplayVariants: boolean;
    fusionDisplayPG: boolean;
}): DemonPair[] {
    const contractDemonNamesSet: Set<string> = new Set(data.contractDemonsList.map((demon: DemonLocation) => demon.Name))
    const filteredCombinations: FusionData[] | undefined = data.raceCombinations.filter(target => demon.Race === target.Race)
    const combinations: FusionCombination[] = filteredCombinations ? filteredCombinations.flatMap(race =>
        race.Combinations?.map(combination => ({
            race1: combination[0],
            race2: combination[1]
        })) || []
    ) : []
    const allValidFusions: DemonPair[] = []
    if (demon.Race === 'Element') {
        const elementFusions: DemonPair[] = []
        for (let k = 0; k < demon.Special!.length; k++) {
            const raceRanks: Demon[] = data ? data.demonsList
                .filter((d: Demon) => d.Race === demon.Special![k][0])
                .filter((d: Demon) => d.Variant !== true)
                .map((d: Demon) => d) : []
            for (let i = 0; i < raceRanks.length; i++) {
                for (let j = i + 1; j < raceRanks.length; j++) {
                    elementFusions.push({
                        demon1: raceRanks[i],
                        demon2: raceRanks[j]
                    })
                }
            }
        }
        allValidFusions.push(...elementFusions)
    } else {
        if (demon.Special) {
            demon.Special.forEach((combination: string[]) => {
                const findDemon1: Demon = data?.demonsList.find((d: Demon) => combination[0] === d.Name) as Demon
                let demon1: Demon
                if (findDemon1) {
                    demon1 = findDemon1
                } else {
                    demon1 = data?.variantDemonsList.find((d: Demon) => combination[0] === d.Name) as Demon
                }
                const findDemon2: Demon = data?.demonsList.find((d: Demon) => combination[1] === d.Name) as Demon
                let demon2: Demon
                if (findDemon2) {
                    demon2 = findDemon2
                } else {
                    demon2 = data?.variantDemonsList.find((d: Demon) => combination[1] === d.Name) as Demon
                }

                if (demon1 && demon2) {
                    if (combination.length > 2) {
                        const findDemon3: Demon = data?.demonsList.find((d: Demon) => combination[2] === d.Name) as Demon
                        let demon3: Demon
                        if (findDemon3) {
                            demon3 = findDemon3
                        } else {
                            demon3 = data?.variantDemonsList.find((d: Demon) => combination[2] === d.Name) as Demon
                        }
                        allValidFusions.push({ demon1, demon2, demon3 })
                    } else {
                        allValidFusions.push({ demon1, demon2 })
                    }
                }
            })
        } else {
            let validElementFusions: DemonPair[] = []
            if (demon.Range && typeof (demon.Range![0]) === 'number' && filteredCombinations && filteredCombinations[0].Elements) {
                const raceRanks: Demon[] = data ? data.demonsList
                    .filter((d: Demon) => d.Race === demon.Race)
                    .filter((d: Demon) => d.Variant !== true)
                    .filter((d: Demon) => !d.Special)
                    .filter((d: Demon) => d.Range && d.Range[0] !== 'PG Only')
                    .map((d: Demon) => d) : []
                let targetRank = -1
                const elements: Demon[] = [
                    data!.demonsList.find((d: Demon) => d.Name === 'Erthys')!,
                    data!.demonsList.find((d: Demon) => d.Name === 'Aeros')!,
                    data!.demonsList.find((d: Demon) => d.Name === 'Aquans')!,
                    data!.demonsList.find((d: Demon) => d.Name === 'Flamies')!
                ]
                for (let i = 0; i < raceRanks.length; i++) {
                    if (raceRanks[i].Name === demon.Name) {
                        targetRank = i
                    }
                }
                for (let i = 0; i < 4; i++) {
                    let checkNext: boolean = false
                    if (filteredCombinations && filteredCombinations[0].Elements[i] === 'Down') {
                        if (raceRanks[targetRank + 1]) {
                            validElementFusions.push({ demon1: elements[i], demon2: raceRanks[targetRank + 1] })
                            if (raceRanks[targetRank + 1].Special || raceRanks[targetRank + 1].Range![0] === "PG Only") {
                                checkNext = true
                            }
                            while (checkNext) {
                                for (let j = 2; j < raceRanks.length - targetRank; j++) {
                                    validElementFusions.push({ demon1: elements[i], demon2: raceRanks[targetRank + j] })
                                    if (!raceRanks[targetRank + j].Special && raceRanks[targetRank + j].Range![0] !== "PG Only") {
                                        break
                                    }
                                }
                                checkNext = false
                            }
                        }
                    } else {
                        if (raceRanks[targetRank - 1]) {
                            validElementFusions.push({ demon1: elements[i], demon2: raceRanks[targetRank - 1] })
                            if (raceRanks[targetRank - 1].Special || raceRanks[targetRank - 1].Range![0] === "PG Only") {
                                checkNext = true
                            }
                            while (checkNext) {
                                for (let j = targetRank - 1; j >= 0; j--) {
                                    if (!raceRanks[j].Special && raceRanks[j].Range![0] !== "PG Only") {
                                        break
                                    }
                                    allValidFusions.push({ demon1: elements[i], demon2: raceRanks[j - 1] })
                                    checkNext = false
                                }
                            }
                        }
                    }
                }
            }
            if (fusionHidePlugins) {
                validElementFusions = validElementFusions.filter((d: DemonPair) => !d.demon2.Plugin[0])
            }
            if (fusionHideFusionOnly) {
                validElementFusions = validElementFusions.filter((d: DemonPair) => contractDemonNamesSet.has(d.demon2.Name) || (d.demon2.Range && d.demon2.Range[0] === "PG Only"))
            }
            allValidFusions.push(...validElementFusions)
            combinations.forEach((combination: FusionCombination) => {
                const allDemon1s: Demon[] = data ? data.demonsList.filter((d: Demon) => d.Race === combination.race1) : []
                const allVariantDemon1s: Demon[] = data ? data.variantDemonsList.filter((d: Demon) => d.Race === combination.race1) : []
                let filteredDemon1s: Demon[]
                if (fusionHidePlugins) {
                    if (fusionDisplayVariants) {
                        if (fusionHideFusionOnly) {
                            filteredDemon1s = [...allDemon1s, ...allVariantDemon1s]
                                .filter((d: Demon) => d.Plugin[0] === false)
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon1s = [...allDemon1s, ...allVariantDemon1s]
                                .filter((d: Demon) => d.Plugin[0] === false)
                        }
                    } else {
                        if (fusionHideFusionOnly) {
                            filteredDemon1s = allDemon1s
                                .filter((d: Demon) => d.Plugin[0] === false)
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon1s = allDemon1s.filter((d: Demon) => d.Plugin[0] === false)
                        }
                    }
                } else {
                    if (fusionDisplayVariants) {
                        if (fusionHideFusionOnly) {
                            filteredDemon1s = [...allDemon1s, ...allVariantDemon1s]
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon1s = [...allDemon1s, ...allVariantDemon1s]
                        }
                    } else {
                        if (fusionHideFusionOnly) {
                            filteredDemon1s = allDemon1s
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon1s = allDemon1s
                        }
                    }
                }

                const allDemon2s: Demon[] = data ? data.demonsList.filter((d: Demon) => d.Race === combination.race2) : []
                const allVariantDemon2s: Demon[] = data ? data.variantDemonsList.filter((d: Demon) => d.Race === combination.race2) : []
                let filteredDemon2s: Demon[]
                if (fusionHidePlugins) {
                    if (fusionDisplayVariants) {
                        if (fusionHideFusionOnly) {
                            filteredDemon2s = [...allDemon2s, ...allVariantDemon2s]
                                .filter((d: Demon) => d.Plugin[0] === false)
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon2s = [...allDemon2s, ...allVariantDemon2s]
                                .filter((d: Demon) => d.Plugin[0] === false)
                        }
                    } else {
                        if (fusionHideFusionOnly) {
                            filteredDemon2s = allDemon2s
                                .filter((d: Demon) => d.Plugin[0] === false)
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon2s = allDemon2s.filter((d: Demon) => d.Plugin[0] === false)
                        }
                    }
                } else {
                    if (fusionDisplayVariants) {
                        if (fusionHideFusionOnly) {
                            filteredDemon2s = [...allDemon2s, ...allVariantDemon2s]
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon2s = [...allDemon2s, ...allVariantDemon2s]
                        }
                    } else {
                        if (fusionHideFusionOnly) {
                            filteredDemon2s = allDemon2s
                                .filter((d: Demon) => contractDemonNamesSet.has(d.Name) || (d.Range && d.Range[0] === "PG Only"))
                        } else {
                            filteredDemon2s = allDemon2s
                        }
                    }
                }
                filteredDemon1s.forEach((demon1: Demon) => {
                    filteredDemon2s.forEach((demon2: Demon) => {
                        const levelRange = demon1.Level + demon2.Level
                        if (demon.Range && demon.Range[0] && typeof (demon.Range[0]) === 'number') {
                            if (levelRange >= demon.Range[0]) {
                                if (demon.Range[1] && typeof (demon.Range[1]) == 'number') {
                                    if (levelRange <= demon.Range[1]) {
                                        if (fusionDisplayPG) {
                                            if ((demon2.Range && demon2.Range[0] === 'PG Only')) {
                                                allValidFusions.push({ demon1, demon2 })
                                            }
                                        } else {
                                            allValidFusions.push({ demon1, demon2 })
                                        }
                                    }
                                } else {
                                    if (fusionDisplayPG) {
                                        if (demon1.Range && demon1.Range[0] === 'PG Only') {
                                            allValidFusions.push({ demon1, demon2 })
                                        }
                                    } else {
                                        allValidFusions.push({ demon1, demon2 })
                                    }
                                }
                            }
                        }
                    })
                })
            })
        }
    }
    return allValidFusions
}*/