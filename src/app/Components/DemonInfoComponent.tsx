import { Flex, Table, Image } from "@mantine/core";

interface DemonInfoProps {
    demon: Demon
}

export default function DemonInfoComponent({ demon }: DemonInfoProps) {
    const subTypes = [
        'Inexperienced',
        'Illusion',
        'of Kuyo',
        'Wanderer',
        'Accomplished',
        'Vermillion Flame',
        'Godly Golden Winged Bird',
        'Hero of Akaeda',
        'Unmatched Steel',
        'Brave Red Capote',
        'Noble Demon King',
        'Blasted Road',
        'Agent of God',
        'Princess of Pure Madness',
        'Seven Stars of Death',
        'Agent of God',
        'Nimble',
        'Joyful',
        'Prideful',
        'Wrathful',
        'Lustful',
        'Magician',
        'Mystic',
        'Bringer of Aging',
        'Pleasure Bringer',
        'Huntress',
        'Heaven-Piercing',
        'Gojo Bridge',
        'of Assault',
        'Shana',
        'Hassou Tobi',
        'Horse',
        'Shining',
        'Premature',
        'Accomplished',
        'Deformed',
        'Lucky',
        'Lost',
        'Late Afternoon',
        'Mirror',
        'Traditional',
        'Kissy',
        'Leader',
        'Rainbow of Victory',
        'Stray',
        'Crisis',
        'Nightmare'
    ]

    function cleanString(str: string): string {
        let result = str;
        for (const subtype of subTypes) {
            result = result.replace(subtype, '');
        }
        return result.trim();
    }

    const imageName: string = cleanString(demon.Name)

    return (
        <Flex align={'center'} justify={'center'}>
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
                        <Table.Th w={150}><Flex justify={'center'}>Race</Flex></Table.Th>
                        <Table.Td><Flex justify={'center'}>{demon.Race}</Flex></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th w={150}><Flex justify={'center'}>Level</Flex></Table.Th>
                        <Table.Td><Flex justify={'center'}>{demon.Level}</Flex></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th w={150}><Flex justify={'center'}>Fusion Range</Flex></Table.Th>
                        <Table.Td><Flex justify={'center'}>
                            {demon.Range && demon.Range[0]}
                            {demon.Range && demon.Range[1]
                                ?
                                ` - ${demon.Range[1]}`
                                :
                                demon.Range && typeof (demon.Range[0]) === 'number' && '+'}
                            {!demon.Range && demon.Special && 'Special Fusion'}
                            {!demon.Range && !demon.Special && 'Can\'t be fused'}
                        </Flex>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table >
        </Flex>
    )
}