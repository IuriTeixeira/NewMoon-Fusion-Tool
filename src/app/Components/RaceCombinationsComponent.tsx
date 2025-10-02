import { Accordion, Center, Table, useComputedColorScheme, Text, Image, Flex } from "@mantine/core";
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
    const combinations: FusionCombination[] =
        demon.Race === 'Element'
            ?
            demon.Special?.map(combination => ({
                race1: combination[0],
                race2: combination[1]
            })) || []
            :
            filteredCombinations.flatMap(race =>
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
                    <Table align={'center'} withTableBorder withColumnBorders w={'auto'} mx={'auto'}>
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
                                        <Flex key={`race-combinations-center-1-${index}`} align={'center'} gap={'sm'}>
                                            <Image key={`race-combinations-icon-1-${index}`} loading='lazy' fallbackSrc='/Icons/LNC Godly Spirit.png' src={`/Icons/LNC ${combination.race1}.png`} alt={combination.race1} title={combination.race1} w={48} h={48} />
                                            {combination.race1}
                                        </Flex>
                                    </Table.Td>
                                    <Table.Td key={`race-combinations-cell-2-${index}`}>
                                        <Flex key={`race-combinations-center-2-${index}`} align={'center'} gap={'sm'}>
                                            <Image key={`race-combinations-icon-2-${index}`} loading='lazy' fallbackSrc='/Icons/LNC Godly Spirit.png' src={`/Icons/LNC ${combination.race2}.png`} alt={combination.race2} title={combination.race2} w={48} h={48} />
                                            {combination.race2}
                                        </Flex>
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