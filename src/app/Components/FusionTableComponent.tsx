'use client'
import { Image, Anchor, Center, Checkbox, Group, Table, LoadingOverlay } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconCheck, IconX } from "@tabler/icons-react";
import { cleanString, loadJSON } from "@/utils/functionUtils";

interface FusionProps {
    demon: Demon
}

export default function FusionTableComponent({ demon }: FusionProps) {
    const [data, setData] = useState<{
        demonsList: Demon[]
        variantDemonsList: Demon[]
        raceCombinations: FusionData[]
        contractDemonsList: DemonLocation[]
    } | null>(null)

    const [loading, setLoading] = useState<boolean>(true)
    const [fusionResults, setFusionResults] = useState<DemonPair[]>([])
    const [fusionDisplayVariants, setFusionDisplayVariants] = useState<boolean>(false)
    const [fusionHidePlugins, setFusionHidePlugins] = useState<boolean>(false)
    const [fusionHideFusionOnly, setFusionHideFusionOnly] = useState<boolean>(false)
    const [fusionDisplayPG, setFusionDisplayPG] = useState<boolean>(false)
    const contractDemonNamesSet: Set<string> = new Set(data?.contractDemonsList.map((demon: DemonLocation) => demon.Name));
    const filteredCombinations: FusionData[] | undefined = data?.raceCombinations.filter(target => demon.Race === target.Race)
    const combinations: FusionCombination[] = filteredCombinations ? filteredCombinations.flatMap(race =>
        race.Combinations?.map(combination => ({
            race1: combination[0],
            race2: combination[1]
        })) || []
    ) : []

    useEffect(() => {
        Promise.all([
            loadJSON('/Data/demons.json'),
            loadJSON('/Data/variant_demons.json'),
            loadJSON('/Data/race_combinations.json'),
            loadJSON('/Data/contract_demons.json'),
        ]).then(([demonsList, variantDemonsList, raceCombinations, contractDemonsList]) => {
            setData({ demonsList, variantDemonsList, raceCombinations, contractDemonsList })
        })

    }, [])

    useEffect(() => {
        console.log(loading)
    }, [loading])

    useEffect(() => {
        if (!data) return;

        const runFusion = async () => {
            setLoading(true);
            const start = Date.now();

            const results = await calculateFusionsAsync();
            const elapsed = Date.now() - start;

            setFusionResults(results);

            setTimeout(() => setLoading(false), Math.max(300 - elapsed, 0)); // Show for at least 300ms
        };

        runFusion();
    }, [data, fusionDisplayVariants, fusionHidePlugins, fusionHideFusionOnly, fusionDisplayPG]);

    /*useEffect(() => {
        setLoading(true);
        const worker = createFusionWorker();

        worker.postMessage({
            data,
            demon,
            fusionDisplayVariants,
            fusionHidePlugins,
            fusionHideFusionOnly,
            fusionDisplayPG,
        });

        worker.onmessage = (e) => {
            setFusionResults(e.data);
            setLoading(false);
        };

        return () => {
            worker.terminate();
        };
    }, [
        data,
        demon,
        fusionDisplayVariants,
        fusionHidePlugins,
        fusionHideFusionOnly,
        fusionDisplayPG,
    ]);*/

    function calculateFusionsAsync(): Promise<DemonPair[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = calculateFusions();
                resolve(result);
            }, 0); // Defer to next tick
        });
    }

    function calculateFusions(): DemonPair[] {
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
                        data?.demonsList.find((d: Demon) => d.Name === 'Erthys')!,
                        data?.demonsList.find((d: Demon) => d.Name === 'Aeros')!,
                        data?.demonsList.find((d: Demon) => d.Name === 'Aquans')!,
                        data?.demonsList.find((d: Demon) => d.Name === 'Flamies')!
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
                if (fusionDisplayPG) {
                    validElementFusions = validElementFusions.filter((d: DemonPair) => d.demon2.Range && d.demon2.Range[0] === "PG Only")
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
                    if (fusionDisplayPG) {
                        filteredDemon1s = filteredDemon1s.filter((d: Demon) => d.Range && d.Range[0] === "PG Only")
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
                    if (fusionDisplayPG) {
                        filteredDemon2s = filteredDemon2s.filter((d: Demon) => d.Range && d.Range[0] === "PG Only")
                    }
                    filteredDemon1s.forEach((demon1: Demon) => {
                        filteredDemon2s.forEach((demon2: Demon) => {
                            const levelRange = demon1.Level + demon2.Level
                            if (demon.Range && demon.Range[0] && typeof (demon.Range[0]) === 'number') {
                                if (levelRange >= demon.Range[0]) {
                                    if (demon.Range[1] && typeof (demon.Range[1]) == 'number') {
                                        if (levelRange <= demon.Range[1]) {
                                            allValidFusions.push({ demon1, demon2 })
                                        }
                                    } else {
                                        allValidFusions.push({ demon1, demon2 })
                                    }
                                }
                            }
                        })
                    })
                })
            }
        }
        return allValidFusions
    }

    let hasTriFusion: boolean = false

    for (let i = 0; i < fusionResults.length; i++) {
        if (fusionResults[i].demon3) {
            hasTriFusion = true
            break
        }
    }

    return (
        <React.Fragment>
            {!demon.Special &&
                <Group justify={'center'} gap={'lg'}>
                    <Checkbox
                        checked={fusionHidePlugins}
                        label="Hide plugin demons"
                        onChange={(event) => setFusionHidePlugins(event.currentTarget.checked)}
                    />
                    <Checkbox
                        checked={fusionDisplayVariants}
                        label="Show variant demons"
                        onChange={(event) => setFusionDisplayVariants(event.currentTarget.checked)}
                    />
                    <Checkbox
                        checked={fusionHideFusionOnly}
                        label="Hide fusion-only demons"
                        onChange={(event) => setFusionHideFusionOnly(event.currentTarget.checked)}
                    />
                    <Checkbox
                        checked={fusionDisplayPG}
                        label="Include only fusions with demons available from PG"
                        w={"200px"}
                        onChange={(event) => setFusionDisplayPG(event.currentTarget.checked)}
                    />
                </Group>
            }
            <Table.ScrollContainer minWidth={500}>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            {demon.Special
                                ?
                                <React.Fragment>
                                    <Table.Th rowSpan={2}><Center>Plugin?</Center></Table.Th>
                                    <Table.Th rowSpan={2}><Center>Allows Variants?</Center></Table.Th>
                                    <Table.Th colSpan={3}><Center>Material 1</Center></Table.Th>
                                    <Table.Th colSpan={3}><Center>Material 2</Center></Table.Th>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Table.Th colSpan={4}><Center>Material 1</Center></Table.Th>
                                    <Table.Th colSpan={4}><Center>Material 2</Center></Table.Th>
                                </React.Fragment>
                            }
                            {hasTriFusion && <Table.Th colSpan={3}><Center>Material 3</Center></Table.Th>}
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th><Center>Race</Center></Table.Th>
                            {!demon.Special && <Table.Th><Center>Lv</Center></Table.Th>}
                            <Table.Th><Center>Icon</Center></Table.Th>
                            <Table.Th><Center>Name</Center></Table.Th>
                            <Table.Th><Center>Race</Center></Table.Th>
                            {!demon.Special && <Table.Th><Center>Lv</Center></Table.Th>}
                            <Table.Th><Center>Icon</Center></Table.Th>
                            <Table.Th><Center>Name</Center></Table.Th>
                            {hasTriFusion &&
                                <React.Fragment>
                                    <Table.Th><Center>Race</Center></Table.Th>
                                    <Table.Th><Center>Icon</Center></Table.Th>
                                    <Table.Th><Center>Name</Center></Table.Th>
                                </React.Fragment>}
                        </Table.Tr>
                    </Table.Thead>
                    {!loading &&
                        <Table.Tbody>
                            {fusionResults.length > 0
                                ?
                                fusionResults.map((combo, index) => {
                                    const demon1Icon: string = cleanString(combo.demon1.Name)
                                    const demon2Icon: string = cleanString(combo.demon2.Name)
                                    const demon3Icon: string = combo.demon3 ? cleanString(combo.demon3.Name) : '-'
                                    return (demon.Special && demon.Race !== 'Element') ?
                                        <Table.Tr key={index}>
                                            <Table.Td key={`plugin-${combo.demon2.Race}-${index}`}>
                                                <Center>{demon.Plugin[index] ? <IconCheck size={16} /> : <IconX size={16} />}</Center>
                                            </Table.Td>
                                            <Table.Td key={`variant-${combo.demon2.Race}-${index}`}>
                                                <Center>{demon.AllowVariants !== false ? <IconCheck size={16} /> : <IconX size={16} />}</Center>
                                            </Table.Td>
                                            {combo.demon1 &&
                                                <React.Fragment key={`demon1-${index}`}>
                                                    <Table.Td key={`race-${combo.demon1.Race}-${index}`}>{combo.demon1.Race}</Table.Td>
                                                    <Table.Td key={`icon-${combo.demon1.Race}-${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon1Icon}.png`} alt={combo.demon1.Name} w={32} h={32} /></Center></Table.Td>
                                                    <Table.Td key={`name-${combo.demon1.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor><br key={`name-variant-estriction-${combo.demon1.Race}-${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][0] ? '* ' + demon.VariantRestrictions[index][0] : ''}</Table.Td>
                                                </React.Fragment>
                                            }
                                            {combo.demon2 &&
                                                <React.Fragment key={`demon2-${index}`}>
                                                    <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon2.Race}</Table.Td>
                                                    <Table.Td key={`icon-${combo.demon2.Race}-${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon2Icon}.png`} alt={combo.demon2.Name} w={32} h={32} /></Center></Table.Td>
                                                    <Table.Td key={`name-${combo.demon2.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor><br key={`name-variant-estriction-${combo.demon2.Race}-${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][1] ? '* ' + demon.VariantRestrictions[index][1] : ''}</Table.Td>
                                                </React.Fragment>
                                            }
                                            {combo.demon3 ?
                                                <React.Fragment key={`demon3-${index}`}>
                                                    <Table.Td key={`race-${combo.demon3.Race}-${index}`}>{combo.demon3?.Race}</Table.Td>
                                                    <Table.Td key={`icon-${combo.demon3.Race}-${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon3Icon}.png`} alt={combo.demon3?.Name} w={32} h={32} /></Center></Table.Td>
                                                    <Table.Td key={`name-${combo.demon3.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon3?.Name } }}>{combo.demon3?.Name}</Anchor><br key={`name-variant-estriction-${combo.demon3.Race}-${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][2] ? '* ' + demon.VariantRestrictions[index][2] : ''}</Table.Td>
                                                </React.Fragment>
                                                :
                                                hasTriFusion && <React.Fragment key={`demon3-${index}`}>
                                                    <Table.Td key={`race-demon3-${index}`}><Center key={`race-demon3-center-${index}`}>-</Center></Table.Td>
                                                    <Table.Td key={`icon-demon3-${index}`}><Center key={`icon-demon3-center-${index}`}>-</Center></Table.Td>
                                                    <Table.Td key={`name-demon3-${index}`}><Center key={`name-demon3-center-${index}`}>-</Center></Table.Td>
                                                </React.Fragment>
                                            }
                                        </Table.Tr>
                                        :
                                        <Table.Tr key={index}>
                                            <Table.Td key={`race-${combo.demon1.Name}-${index}`}>{combo.demon1.Race}</Table.Td>
                                            <Table.Td key={`level-${combo.demon1.Name}-${index}-`}>{combo.demon1.Level}</Table.Td>
                                            <Table.Td key={`icon-${combo.demon1.Name}-${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon1Icon}.png`} alt={combo.demon1.Name} w={32} h={32} /></Center></Table.Td>
                                            <Table.Td key={`name-${combo.demon1.Name}-${index}-`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor></Table.Td>
                                            <Table.Td key={`race-${combo.demon2.Name}-${index}`}>{combo.demon2.Race}</Table.Td>
                                            <Table.Td key={`level-${combo.demon2.Name}-${index}`}>{combo.demon2.Level}</Table.Td>
                                            <Table.Td key={`icon-${combo.demon2.Name}-${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon2Icon}.png`} alt={combo.demon2.Name} w={32} h={32} /></Center></Table.Td>
                                            <Table.Td key={`name-${combo.demon2.Name}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor></Table.Td>
                                        </Table.Tr>
                                })
                                :
                                (
                                    <Table.Tr>
                                        <Table.Td colSpan={10}>
                                            <Center>No valid fusions found.</Center>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            }
                        </Table.Tbody>
                    }
                </Table>
            </Table.ScrollContainer>
        </React.Fragment>
    )
}