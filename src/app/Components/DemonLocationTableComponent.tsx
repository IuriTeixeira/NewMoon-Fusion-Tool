'use client'
import { Flex, Table, useComputedColorScheme } from '@mantine/core'
import demonList from '../Data/demons.json' assert {type: "json"}
import React from 'react'

export default function DemonLocationTableComponent() {
    const colorScheme = useComputedColorScheme();

    /*const subTypes = [
        'Inexperienced ',
        'Illusion ',
        ' of Kuyo',
        'Wanderer ',
        'Accomplished ',
        'Vermillion Flame ',
        'Godly Golden Winged Bird ',
        'Hero of Akaeda ',
        'Unmatched Steel ',
        'Brave Red Capote ',
        'Noble Demon King ',
        'Blasted Road ',
        'Agent of God ',
        'Princess of Pure Madness ',
        'Seven Stars of Death ',
        'Agent of God ',
        'Nimble ',
        'Joyful ',
        'Prideful ',
        'Wrathful ',
        'Lustful ',
        'Magician ',
        'Mystic ',
        'Bringer of Aging ',
        'Pleasure Bringer ',
        'Huntress ',
        'Heaven-Piercing ',
        'Gojo Bridge ',
        ' of Assault',
        'Shana ',
        'Hassou Tobi ',
        'Horse '
    ]

    function cleanString(str: string): string {
        let result = str;
        for (const subtype of subTypes) {
            result = result.replace(subtype, '');
        }
        return result.trim();
    }

    let filteredDemonList: Demon[]

    if (raceFilter !== '') {
        filteredDemonList = demonList.filter((demon: Demon) => demon.Race === raceFilter)
    } else {
        filteredDemonList = demonList
    }*/

    return (
        <Table.ScrollContainer minWidth={500}>
            <Table withTableBorder withColumnBorders>
                <Table.Thead
                    style={{
                        backgroundColor: `var(--mantine-color-${colorScheme === 'dark' ? 'dark-6' : 'gray-0'})`
                    }}
                >
                    <Table.Tr>
                        <Table.Th>
                            <Flex align='center' justify='center'>Race</Flex>
                        </Table.Th>
                        <Table.Th>
                            <Flex align='center' justify='center'>Icon</Flex>
                        </Table.Th>
                        <Table.Th>
                            <Flex align='center' justify='center'>Name</Flex>
                        </Table.Th>
                        <Table.Th>
                            <Flex align='center' justify='center'>Level</Flex>
                        </Table.Th>
                        <Table.Th>
                            <Flex align='center' justify='center'>Locations</Flex>
                        </Table.Th>
                        <Table.Th>
                            <Flex align='center' justify='center'>Restrictions</Flex>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {//filteredDemonList.map((demon:Demon, index:number) => {
                    demonList.map((demon:Demon, index:number) => {
                        return (
                            <Table.Tr key={`row-${index}-${demon.Name}`}>
                                <Table.Td key={`name-${index}`}>{demon.Name}</Table.Td>
                            </Table.Tr>
                        )
                    })}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}