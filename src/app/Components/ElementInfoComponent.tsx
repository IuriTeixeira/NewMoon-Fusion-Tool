import { IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import { Center, Table, useComputedColorScheme } from "@mantine/core";

interface ElementInfoProps {
    elements: string[]
}

export default function ElementInfoComponent({ elements }: ElementInfoProps) {
    const colors: string[] = elements.map((e: string) => e === 'Down' ? 'red' : 'green')
    const colorScheme = useComputedColorScheme()

    return (
        <Table align={'center'} withTableBorder withColumnBorders>
            <Table.Thead
                style={{
                    backgroundColor: `var(--mantine-color-${colorScheme === 'dark' ? 'dark-6' : 'gray-0'})`
                }}
            >
                <Table.Tr>
                    <Table.Th colSpan={4}><Center>Elemental Fusion</Center></Table.Th>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th><Center>Erthys</Center></Table.Th>
                    <Table.Th><Center>Aeros</Center></Table.Th>
                    <Table.Th><Center>Aquans</Center></Table.Th>
                    <Table.Th><Center>Flaemis</Center></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Td><Center>{elements[0] === 'Down' ? <IconArrowDown color={colors[0]} /> : <IconArrowUp color={colors[0]} />}</Center></Table.Td>
                    <Table.Td><Center>{elements[1] === 'Down' ? <IconArrowDown color={colors[1]} /> : <IconArrowUp color={colors[1]} />}</Center></Table.Td>
                    <Table.Td><Center>{elements[2] === 'Down' ? <IconArrowDown color={colors[2]} /> : <IconArrowUp color={colors[2]} />}</Center></Table.Td>
                    <Table.Td><Center>{elements[3] === 'Down' ? <IconArrowDown color={colors[3]} /> : <IconArrowUp color={colors[3]} />}</Center></Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    )
}