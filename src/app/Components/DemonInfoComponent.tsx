import { Flex, Table, Image } from "@mantine/core";
import demonsList from '../Data/demons.json'

interface DemonInfoProps {
    demon: Demon
}

export default function DemonInfoComponent({ demon }: DemonInfoProps) {
    return (
        <Flex align={'center'} justify={'center'}>
            <Table align={'center'} variant="vertical" withTableBorder withColumnBorders w={'400'}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th colSpan={2}>
                            <Flex align={'center'} justify={'center'} gap={'sm'}>
                                <Image fallbackSrc='/Blank.png' src={`/Icons/${demon.Name}.png`} alt={demon.Name} title={demon.Name} w={32} h={32} />
                                {demon.Race.toUpperCase()} {demon.Name}
                            </Flex>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead >
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th w={'40%'}><Flex justify={'center'}>Level</Flex></Table.Th>
                        <Table.Td><Flex justify={'center'}>{demon.Level}</Flex></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th><Flex justify={'center'}>Fusion Range</Flex></Table.Th>
                        <Table.Td><Flex justify={'center'}>
                            {demon.Range && demon.Range[0]}
                            {demon.Range && demon.Range[1] ? `- ${demon.Range[1]}`
                                :
                                demon.Range && typeof (demon.Range[0]) === 'number' && '+'}
                            {!demon.Range && 'Special Fusion'}
                        </Flex>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table >
        </Flex>
    )
}