'use  client'
import { Center, NumberInput, Stack, Title, Table, Flex } from "@mantine/core";
import FilterComponent from "./FilterComponent";
import raceCombinations from "@/../public/Data/race_combinations.json"
import demonsList from "@/../public/Data/demons.json"
import variantDemonsList from "@/../public/Data/variant_demons.json"
import { useEffect, useMemo, useRef, useState } from "react";
import DemonInfoComponent from "./DemonInfoComponent";
import React from "react";
import RaceCombinationsComponent from "./RaceCombinationsComponent";

export default function ForwardFusionComponent() {
    let result: Demon | undefined = undefined
    const allDemons: Demon[] = useMemo<Demon[]>(() => [...demonsList, ...variantDemonsList], [])
    const [nameDemon1, setNameDemon1] = useState<string>('')
    const [raceDemon1, setRaceDemon1] = useState<string>('')
    const [levelDemon1, setLevelDemon1] = useState<number | string>(1)
    const [nameDemon2, setNameDemon2] = useState<string>('')
    const [raceDemon2, setRaceDemon2] = useState<string>('')
    const [levelDemon2, setLevelDemon2] = useState<number | string>(1)
    let fusionResult: Demon | undefined = (nameDemon1 && nameDemon2)
        ?
        calculateFusion(nameDemon1, raceDemon1, levelDemon1, nameDemon2, raceDemon2, levelDemon2)
        :
        undefined
    const lastNameDemon1 = useRef<string | null>(null)
    const lastNameDemon2 = useRef<string | null>(null)


    useEffect(() => {
        const demon1 = allDemons.find((d) => d.Name === nameDemon1)
        const demon2 = allDemons.find((d) => d.Name === nameDemon2)

        // Only update Demon1 if name actually changed
        if (demon1) {
            if (lastNameDemon1.current !== nameDemon1) {
                setRaceDemon1(demon1.Race)
                setLevelDemon1(demon1.Level)
                lastNameDemon1.current = nameDemon1
            }
        } else {
            setLevelDemon1(1)
            fusionResult = undefined
        }

        // Only update Demon2 if name actually changed
        if (demon2) {
            if (lastNameDemon2.current !== nameDemon2) {
                setRaceDemon2(demon2.Race)
                setLevelDemon2(demon2.Level)
                lastNameDemon2.current = nameDemon2
            }
        } else {
            setLevelDemon2(1)
            fusionResult = undefined
        }
    }, [nameDemon1, nameDemon2, allDemons])


    function isPGOnly(range: string | number | null) {
        return Array.isArray(range) && range[0] === 'PG Only';
    }

    function calculateFusion(
        nameDemon1: string, raceDemon1: string, levelDemon1: string | number,
        nameDemon2: string, raceDemon2: string, levelDemon2: string | number
    ) {
        if (raceDemon1 === raceDemon2) {
            if (raceDemon1 === 'Element') {
                const mitamas = [
                    demonsList.find(d => d.Name === 'Ara Mitama'),
                    demonsList.find(d => d.Name === 'Nigi Mitama'),
                    demonsList.find(d => d.Name === 'Kusi Mitama'),
                    demonsList.find(d => d.Name === 'Saki Mitama')
                ];
                mitamas.forEach(mitama => {
                    mitama?.Special?.forEach(combo => {
                        if (
                            nameDemon1 === combo[0] && nameDemon2 === combo[1]
                            ||
                            nameDemon1 === combo[1] && nameDemon2 === combo[0]
                        ) {
                            result = mitama
                        }
                    }
                    )
                })
                return result
            } else {
                const elements = [
                    demonsList.find(d => d.Name === 'Erthys'),
                    demonsList.find(d => d.Name === 'Aeros'),
                    demonsList.find(d => d.Name === 'Aquans'),
                    demonsList.find(d => d.Name === 'Flamies')
                ];
                elements.forEach(element => {
                    element?.Special?.forEach(combo => {
                        if (combo.includes(raceDemon1) || combo.includes(raceDemon2)) {
                            result = element
                        }
                    }
                    )
                })
                return result
            }
        } else {
            if (raceDemon1 === 'Sacred Soul' || raceDemon2 === 'Sacred Soul') {
                const nonMitama: string = raceDemon1 === 'Sacred Soul' ? nameDemon2 : nameDemon1
                return allDemons.find((d: Demon) => d.Name === nonMitama) as Demon
            }
            if (raceDemon1 === 'Element' || raceDemon2 === 'Element') {
                const elements: string[] = ["Erthys", "Aeros", "Aquans", "Flamies"]
                const elementName: string = elements.includes(nameDemon1) ? nameDemon1 : nameDemon2
                const nonElementName: string = nameDemon1 !== elementName ? nameDemon1 : nameDemon2
                const elementType: number = elements.findIndex((element: string) => element === elementName)
                const nonElementRace: string = raceDemon1 !== 'Element' ? raceDemon1 : raceDemon2
                const resultComboData: FusionData = raceCombinations.find((combo: FusionData) => combo.Race === nonElementRace) as FusionData

                const raceRanks: Demon[] = demonsList
                    .filter((d: Demon) => d.Race === nonElementRace && !d.Variant && !d.Special && d.Range && d.Range[0] !== 'PG Only');

                const nonElementRank: number = raceRanks.findIndex(d => d.Name === nonElementName);
                if (resultComboData.Elements) {
                    let upOrDown: string = 'Down'
                    if (resultComboData.Elements[elementType] === 'Down') {
                        upOrDown = 'Down'
                    } else {
                        upOrDown = 'Up'
                    }
                    const nextDemon = upOrDown === 'Down' ? raceRanks[nonElementRank - 1] : raceRanks[nonElementRank + 1]
                    if (nextDemon) {
                        if ((nextDemon.Range && isPGOnly(nextDemon.Range[0])) || nextDemon.Special !== null) {
                            for (let j = 2; j < raceRanks.length - nonElementRank; j++) {
                                const next = upOrDown === 'Down' ? raceRanks[nonElementRank - j] : raceRanks[nonElementRank + j];
                                if (
                                    !next ||
                                    next.Special === null &&
                                    Array.isArray(next.Range) &&
                                    next.Range[0] !== 'PG Only'
                                ) {
                                    break;
                                }
                            }
                        } else {
                            return nextDemon
                        }
                    }
                }


            } else {
                if (raceDemon1 === undefined || raceDemon2 === undefined || nameDemon1 === undefined || nameDemon2 === undefined) {
                    return result
                }
                const normalize = (s: string) => s.trim().toLowerCase()

                const resultComboData = raceCombinations.find(
                    (combo: FusionData) =>
                        combo.Combinations?.some(
                            (combination: string[]) =>
                                (normalize(combination[0]) === normalize(raceDemon1) &&
                                    normalize(combination[1]) === normalize(raceDemon2)) ||
                                (normalize(combination[0]) === normalize(raceDemon2) &&
                                    normalize(combination[1]) === normalize(raceDemon1))
                        )
                ) as FusionData | undefined

                if (!resultComboData) return undefined

                const resultRace: Demon[] = demonsList.filter((d: Demon) => d.Race === resultComboData.Race)

                const numLevelDemon1 = typeof levelDemon1 === 'string' ? parseInt(levelDemon1) : levelDemon1
                const numLevelDemon2 = typeof levelDemon2 === 'string' ? parseInt(levelDemon2) : levelDemon2
                const resultTargetRange = numLevelDemon1 + numLevelDemon2

                const fusionResult = resultRace.find((demon: Demon) => {
                    if (demon.Range && typeof demon.Range[0] === 'number') {
                        if (typeof demon.Range[1] !== 'number') demon.Range[1] = 999
                        const [minValue, maxValue] = demon.Range as [number, number]
                        return resultTargetRange >= minValue && resultTargetRange <= maxValue
                    }
                    return false
                })

                return fusionResult

            }
        }

    }

    return (
        <Table horizontalSpacing={'md'} withRowBorders={false} w={'fit-content'} mx={'auto'}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th w={'50%'}>
                        <Center><Title>Demon 1</Title></Center>
                    </Table.Th>
                    <Table.Th w={'50%'}>
                        <Center><Title>Demon 2</Title></Center>
                    </Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td>
                        <Center>
                            <Stack gap={0} mx={'auto'}>
                                <Flex align={'flex-start'} justify={'flex-start'} gap={'xl'}>
                                    <NumberInput
                                        value={levelDemon1}
                                        label="Level"
                                        placeholder="1"
                                        min={1}
                                        max={99}
                                        onChange={setLevelDemon1}
                                        maw={'5em'}
                                        mb={'sm'}
                                    />
                                    <FilterComponent forward={true} nameFilter={nameDemon1} setNameFilter={setNameDemon1} raceFilter={raceDemon1} setRaceFilter={setRaceDemon1} />
                                </Flex>
                                <DemonInfoComponent demon={allDemons.find((d: Demon) => d.Name === nameDemon1) as Demon} />
                            </Stack>
                        </Center>
                    </Table.Td>
                    <Table.Td>
                        <Center>
                            <Stack gap={0}>
                                <Flex align={'flex-start'} justify={'flex-start'} gap={'xl'}>
                                    <NumberInput
                                        value={levelDemon2}
                                        label="Level"
                                        placeholder="1"
                                        min={1}
                                        max={99}
                                        onChange={setLevelDemon2}
                                        maw={'5em'}
                                        mb={'sm'}
                                    />
                                    <FilterComponent forward={true} nameFilter={nameDemon2} setNameFilter={setNameDemon2} raceFilter={raceDemon2} setRaceFilter={setRaceDemon2} />
                                </Flex>
                                <DemonInfoComponent demon={allDemons.find((d: Demon) => d.Name === nameDemon2) as Demon} />
                            </Stack>
                        </Center>
                    </Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th colSpan={2} pt={'xl'}>
                        <Center><Title>Fusion Result</Title></Center>
                    </Table.Th>
                </Table.Tr>
                <Table.Tr>
                    <Table.Td colSpan={2}>
                        <Center>
                            <Stack align="center">
                                {fusionResult && nameDemon1 && nameDemon2 ?
                                    <DemonInfoComponent demon={fusionResult} />
                                    :
                                    <DemonInfoComponent demon={undefined} />
                                }
                                {fusionResult && <RaceCombinationsComponent demon={fusionResult} />}
                            </Stack>
                        </Center>
                    </Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    )
}