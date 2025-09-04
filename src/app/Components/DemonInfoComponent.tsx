import { Flex, Table, Image, Center } from "@mantine/core";
import { cleanString } from "@/utils/functionUtils"

interface DemonInfoProps {
    demon: Demon
}

export default function DemonInfoComponent({ demon }: DemonInfoProps) {
    const imageName: string = cleanString(demon.Name)
    return (
        <Center>
            <Table align={'center'} variant="vertical" withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th colSpan={2}>
                            <Flex align={'center'} justify={'center'} gap={'sm'}>
                                <Image fallbackSrc='/Blank.png' src={`/Icons/${imageName}.png`} alt={demon.Name} title={demon.Name} w={32} h={32} />
                                {demon.Name}
                            </Flex>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead >
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th w={150}><Center>Race</Center></Table.Th>
                        <Table.Td><Center>{demon.Race}</Center></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th w={150}><Center>Level</Center></Table.Th>
                        <Table.Td><Center>{demon.Level}</Center></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th w={150}><Center>Fusion Range</Center></Table.Th>
                        <Table.Td>
                            <Center>
                                {demon.Range
                                    ?
                                    `${demon.Range[0]}${demon.Range[1]
                                        ?
                                        ` - ${demon.Range[1]}`
                                        :
                                        typeof (demon.Range[0]) === "number" ? '+' : ''}`
                                    :
                                    'Special Fusion'}
                            </Center>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </Center>
    )
}