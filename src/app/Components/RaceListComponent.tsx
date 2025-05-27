import { Accordion, Center, Table, useComputedColorScheme, Text, Anchor } from "@mantine/core";
import demonsList from '../Data/demons.json'
import Link from "next/link";

interface RaceListProps {
    demon: Demon
}

export default function RaceListComponent({ demon }: RaceListProps) {
    const colorScheme = useComputedColorScheme()

    const raceRanks: Demon[] = demonsList
        .filter((d: Demon) => d.Race === demon.Race)
        .map((d: Demon) => d);

    return (
        <Accordion>
            <Accordion.Item value="race-list">
                <Accordion.Control style={{ backgroundColor: `var(--mantine-color-${colorScheme === 'dark' ? 'dark-6' : 'gray-0'})` }}>
                    <Center>
                        <Text fz={'sm'} fw={700}>Race Demons</Text>
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
                                <Table.Th><Center>Level</Center></Table.Th>
                                <Table.Th><Center>Name</Center></Table.Th>
                                <Table.Th><Center>Fusion Range</Center></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {raceRanks.map((demon: Demon, index: number) => (
                                <Table.Tr key={`race-list-row-${index}`}>
                                    <Table.Td key={`race-list-level-${index}`}>
                                        <Center key={`race-list-center-level-${index}`}>
                                            {demon.Level}
                                        </Center>
                                    </Table.Td>
                                    <Table.Td key={`race-list-name-${index}`}>
                                        <Center key={`race-list-center-name-${index}`}>
                                            <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Name } }}>{demon.Name}</Anchor>
                                        </Center>
                                    </Table.Td>
                                    {demon.Range ?
                                        <Table.Td key={`race-list-range-${index}`}>
                                            <Center key={`race-list-center-range-${index}`}>
                                                {demon.Range[0]}
                                                {demon.Range[1]
                                                ?
                                                ` - ${demon.Range[1]}`
                                                :
                                                typeof(demon.Range[0]) === "number" && '+'}
                                            </Center>
                                        </Table.Td>
                                        :
                                        <Table.Td key={`race-list-range-${index}`}>
                                            <Center key={`race-list-center-range-${index}`}>
                                                Special Fusion
                                            </Center>
                                        </Table.Td>}
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}