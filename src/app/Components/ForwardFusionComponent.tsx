'use  client'
import { Center, NumberInput, Stack, Title, Table, Flex } from "@mantine/core";
import FilterComponent from "./FilterComponent";
import demonsList from "@/../public/Data/demons.json"
import raceCombinations from "@/../public/Data/race_combinations.json"
import variantDemonsList from "@/../public/Data/variant_demons.json"
import { useEffect, useMemo, useRef, useState } from "react";
import DemonInfoComponent from "./DemonInfoComponent";
import React from "react";
import RaceCombinationsComponent from "./RaceCombinationsComponent";
import { calculateForwardFusion } from "@/utils/functionUtils";

export default function ForwardFusionComponent() {
    const result: Demon | undefined = undefined
    const allDemons: Demon[] = useMemo<Demon[]>(() => [...demonsList, ...variantDemonsList], [])
    const [nameDemon1, setNameDemon1] = useState<string>('')
    const [raceDemon1, setRaceDemon1] = useState<string>('')
    const [levelDemon1, setLevelDemon1] = useState<number | string>(1)
    const [nameDemon2, setNameDemon2] = useState<string>('')
    const [raceDemon2, setRaceDemon2] = useState<string>('')
    const [levelDemon2, setLevelDemon2] = useState<number | string>(1)
    const fusionResult: Demon | undefined = useMemo(() => {
        const demon1 = allDemons.find(d => d.Name === nameDemon1)
        const demon2 = allDemons.find(d => d.Name === nameDemon2)
        if (!demon1 || !demon2) return undefined

        return calculateForwardFusion(nameDemon1, raceDemon1, levelDemon1, nameDemon2, raceDemon2, levelDemon2, demonsList, allDemons, raceCombinations, result)
    }, [nameDemon1, raceDemon1, levelDemon1, nameDemon2, raceDemon2, levelDemon2, allDemons, result])
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
        }
    }, [nameDemon1, nameDemon2, allDemons])

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