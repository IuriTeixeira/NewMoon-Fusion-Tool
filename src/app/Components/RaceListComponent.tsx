import { Image, Accordion, Center, Table, useComputedColorScheme, Text, Anchor } from "@mantine/core";
import Link from "next/link";
import { cleanString, loadJSON } from "@/utils/functionUtils";
import { useEffect, useState } from "react";

interface RaceListProps {
    demon: Demon
}

export default function RaceListComponent({ demon }: RaceListProps) {
    const [data, setData] = useState<{
        demonsList: Demon[]
    } | null>(null)

    useEffect(() => {
        Promise.all([
            loadJSON('/Data/demons.json'),
        ]).then(([demonsList]) => {
            setData({ demonsList })
        })
    }, [])
    const colorScheme = useComputedColorScheme()

    const raceRanks: Demon[] = data ? data.demonsList
        .filter((d: Demon) => d.Race === demon.Race)
        .map((d: Demon) => d) : []

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
                                <Table.Th><Center>Icon</Center></Table.Th>
                                <Table.Th><Center>Name</Center></Table.Th>
                                <Table.Th><Center>Fusion Range</Center></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {raceRanks.map((d: Demon, index: number) => {
                                const imageName: string = cleanString(d.Name)
                                return (
                                    <Table.Tr key={`race-list-row-${index}`}>
                                        <Table.Td key={`race-list-level-${index}`}>
                                            <Center key={`race-list-center-level-${index}`}>
                                                {d.Level}
                                            </Center>
                                        </Table.Td>
                                        <Table.Td key={`race-list-icon-${index}`}>
                                            <Center key={`race-list-center-icon-${index}`}>
                                                <Image loading="lazy" fallbackSrc='/Blank.png' src={`/Icons/${imageName}.png`} alt={d.Name} w={32} h={32} />
                                            </Center>
                                        </Table.Td>
                                        <Table.Td key={`race-list-name-${index}`}>
                                            <Center key={`race-list-center-name-${index}`}>
                                                {d.Name === demon.Name
                                                    ?
                                                    <Text fw={700}>{d.Name}</Text>
                                                    :
                                                    <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: d.Name } }}>{d.Name}</Anchor>
                                                }
                                            </Center>
                                        </Table.Td>
                                        {d.Range ?
                                            <Table.Td key={`race-list-range-${index}`}>
                                                <Center key={`race-list-center-range-${index}`}>
                                                    {d.Range[0]}
                                                    {d.Range[1]
                                                        ?
                                                        ` - ${d.Range[1]}`
                                                        :
                                                        typeof (d.Range[0]) === "number" && '+'}
                                                </Center>
                                            </Table.Td>
                                            :
                                            <Table.Td key={`race-list-range-${index}`}>
                                                <Center key={`race-list-center-range-${index}`}>
                                                    Special Fusion
                                                </Center>
                                            </Table.Td>}
                                    </Table.Tr>
                                )
                            })}
                        </Table.Tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}