import { Center, Flex, Table, useComputedColorScheme } from "@mantine/core";
import demonLocations from '../Data/contract_demons.json'

interface DemonInfoProps {
    demon: Demon
}

interface DemonLocation {
    Race: string
    Name: string
    Zone: string[]
    Location?: (string | null)[]
    Notes?: (string | null)[]
}

export default function DemonContractInfoComponent({ demon }: DemonInfoProps) {
    const demonLoc: DemonLocation = demonLocations.find((d: DemonLocation) => d.Name === demon.Name) as DemonLocation
    const colorScheme = useComputedColorScheme()

    return (
        <Flex align={'center'} justify={'center'}>
            <Table align={'center'} variant="vertical" withTableBorder withColumnBorders>
                <Table.Thead
                    style={{
                        backgroundColor: `var(--mantine-color-${colorScheme === 'dark' ? 'dark-6' : 'gray-0'})`
                    }}
                >
                    <Table.Tr>
                        <Table.Th colSpan={10}>
                            <Center>
                                Contract Info
                            </Center>
                        </Table.Th>
                    </Table.Tr>
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
        </Flex>
    )
}