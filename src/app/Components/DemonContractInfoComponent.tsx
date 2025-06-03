import { Accordion, Center, Text, Table, useComputedColorScheme } from "@mantine/core";

interface DemonInfoProps {
    demonLoc: DemonLocation
}

export default function DemonContractInfoComponent({ demonLoc }: DemonInfoProps) {
    const colorScheme = useComputedColorScheme()

    return (
        <Accordion>
            <Accordion.Item value="contracts">
                <Accordion.Control style={{ backgroundColor: `var(--mantine-color-${colorScheme === 'dark' ? 'dark-6' : 'gray-0'})` }}>
                    <Center>
                        <Text fz={'sm'} fw={700}>Demon Location Info</Text>
                    </Center>
                </Accordion.Control>
                <Accordion.Panel>
                    <Table align={'center'} variant="vertical" withTableBorder withColumnBorders>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th><Center>Zone</Center></Table.Th>
                                <Table.Th><Center>Location</Center></Table.Th>
                                <Table.Th><Center>Notes</Center></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {demonLoc.Zone.map((zone: string, zoneIndex: number) =>
                                <Table.Tr key={`row-${zoneIndex}`}>
                                    <Table.Td key={`zone-cell-${zoneIndex}`}>{zone}</Table.Td>
                                    <Table.Td key={`location-cell-${zoneIndex}`}>
                                        {demonLoc.Location
                                            ?
                                            (demonLoc.Location[zoneIndex] || <Center key={`location-center-${zoneIndex}`}>-</Center>)
                                            :
                                            <Center key={`location-center-${zoneIndex}`}>-</Center>
                                        }
                                    </Table.Td>
                                    <Table.Td key={`notes-cell-${zoneIndex}`}>
                                        {demonLoc.Notes
                                            ?
                                            (demonLoc.Notes[zoneIndex] || <Center key={`notes-center-${zoneIndex}`}>-</Center>)
                                            :
                                            <Center key={`notes-center-${zoneIndex}`}>-</Center>}
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table >
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}