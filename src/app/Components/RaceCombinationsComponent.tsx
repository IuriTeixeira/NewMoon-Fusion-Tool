import { Accordion, Center, Table, useComputedColorScheme, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { loadJSON } from "@/utils/functionUtils";

interface CombinationInfoProps {
    demon: Demon
}

export default function RaceCombinationsComponent({ demon }: CombinationInfoProps) {
    const [data, setData] = useState<{
        raceCombinations: FusionData[]
    } | null>(null)

    useEffect(() => {
        Promise.all([
            loadJSON('/Data/race_combinations.json'),
        ]).then(([raceCombinations]) => {
            setData({ raceCombinations })
        })
    }, [])

    const colorScheme = useComputedColorScheme()
    const filteredCombinations: FusionData[] = data ? data.raceCombinations.filter(target => demon.Race === target.Race) : []
    const combinations: FusionCombination[] = filteredCombinations.flatMap(race =>
        race.Combinations?.map(combination => ({
            race1: combination[0],
            race2: combination[1]
        })) || []
    );

    return (
        <Accordion>
            <Accordion.Item value="combinations">
                <Accordion.Control style={{ backgroundColor: `var(--mantine-color-${colorScheme === 'dark' ? 'dark-6' : 'gray-0'})` }}>
                    <Center>
                        <Text fz={'sm'} fw={700}>Race Combinations</Text>
                    </Center>
                </Accordion.Control>
                <Accordion.Panel>
                    <Table align={'center'} withTableBorder withColumnBorders>
                        <Table.Thead
                            style={{
                                backgroundColor: `var(--mantine-color-${colorScheme === 'dark' ? 'dark-6' : 'gray-0'})`
                            }}
                        >
                            <Table.Tr>
                                <Table.Th><Center>Race 1</Center></Table.Th>
                                <Table.Th><Center>Race 2</Center></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {combinations.map((combination: FusionCombination, index: number) => (
                                <Table.Tr key={`race-combinations-row-${index}`}>
                                    <Table.Td key={`race-combinations-cell-1-${index}`}>
                                        <Center key={`race-combinations-center-1-${index}`}>
                                            {combination.race1}
                                        </Center>
                                    </Table.Td>
                                    <Table.Td key={`race-combinations-cell-2-${index}`}>
                                        <Center key={`race-combinations-center-2-${index}`}>
                                            {combination.race2}
                                        </Center>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}