'use client'
import { Center, Image, Anchor, Table, useComputedColorScheme } from '@mantine/core'
import demonList from '../Data/demons.json' assert {type: "json"}
import demonLocList from '../Data/contract_demons.json'
import React, { JSX } from 'react'
import Link from 'next/link';

interface DemonLocation {
    Race: string
    Name: string
    Zone: string[]
    Location?: (string | null)[]
    Notes?: (string | null)[]
}

export default function DemonLocationTableComponent() {
    const colorScheme = useComputedColorScheme();

    const demonLocations: DemonLocation[] = demonLocList as DemonLocation[]
    const subTypes = [
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

    const filteredDemonList: Demon[] = demonList.filter((demon: Demon) =>
        demonLocations.some((loc: DemonLocation) => loc.Name === demon.Name)
    );

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
                            <Center>Race</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Icon</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Name</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Level</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Zone</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Location</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Notes</Center>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {filteredDemonList.map((demon: Demon, index: number) => {
                        const imageName: string = cleanString(demon.Name)
                        const demonLocation: DemonLocation = demonLocations.find((d: DemonLocation) => d.Name === demon.Name) as DemonLocation
                        let locPlusNotes: (JSX.Element | null)[] = []
                        if (demonLocation.Location) {
                            if (demonLocation.Notes) {
                                demonLocation.Location.map((location, locIndex) => (
                                    locPlusNotes.push(
                                        <React.Fragment key={`row-location-notes-${index}-${locIndex}`}>
                                            <Table.Td key={`location-${index}-${locIndex}`}>
                                                {location || <Center key={`location-center-${index}-${locIndex}`}>-</Center>}
                                            </Table.Td>
                                            <Table.Td key={`notes-${index}-${locIndex}`}>
                                                {demonLocation.Notes![locIndex] || <Center key={`notes-center-${index}-${locIndex}`}>-</Center>}
                                            </Table.Td>
                                        </React.Fragment>
                                    )
                                ))
                            } else {
                                demonLocation.Location.map((location, locIndex) => (
                                    locPlusNotes.push(
                                        <React.Fragment>
                                            <Table.Td key={`location-${index}-${locIndex}`}>
                                                {location || <Center key={`location-center-${index}-${locIndex}`}>-</Center>}
                                            </Table.Td>
                                            <Table.Td key={`notes-${index}-${locIndex}`}>
                                                <Center key={`notes-center-${index}-${locIndex}`}>-</Center>
                                            </Table.Td>
                                        </React.Fragment>
                                    )
                                ))
                            }
                        } else {
                            if (demonLocation.Notes) {
                                demonLocation.Notes.map((note, noteIndex) => (
                                    locPlusNotes.push(
                                        <React.Fragment>
                                            <Table.Td key={`location-${index}-${noteIndex}`}>
                                                <Center key={`notes-center-${noteIndex}`}>-</Center>
                                            </Table.Td>
                                            <Table.Td key={`notes-${index}-${noteIndex}`}>
                                                {note || <Center key={`notes-center-${noteIndex}`}>-</Center>}
                                            </Table.Td>
                                        </React.Fragment>
                                    )))
                            } else {
                                demonLocation.Zone.map((zone, zoneIndex) => (
                                    locPlusNotes.push(
                                        <React.Fragment key={`location-note-fragment-${index}-${zone}-${zoneIndex}`}>
                                            <Table.Td key={`location-${index}-${zoneIndex}`}>
                                                <Center key={`location-center-${index}-${zoneIndex}`}>-</Center>
                                            </Table.Td>
                                            <Table.Td key={`notes-${index}-${zoneIndex}`}>
                                                <Center key={`notes-center-${index}-${zoneIndex}`}>-</Center>
                                            </Table.Td>
                                        </React.Fragment>
                                    )
                                ))
                            }
                        }

                        const rows: number = demonLocation.Zone.length

                        return (
                            <React.Fragment key={`row-fragment-${index}-${demon.Name}`}>
                                <Table.Tr key={`row-${index}-${demon.Name}`}>
                                    <Table.Td key={`race-${index}`} rowSpan={demonLocation.Zone.length || 1}>
                                        {demon.Race}
                                    </Table.Td>
                                    <Table.Td key={`icon-${index}`} rowSpan={demonLocation.Zone.length || 1}>
                                        <Center><Image fallbackSrc='/Blank.png' src={`/Icons/${imageName}.png`} alt={demon.Name} w={32} h={32} /></Center>
                                    </Table.Td>
                                    <Table.Td key={`name-${index}`} rowSpan={demonLocation.Zone.length || 1}>
                                        <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Name } }}>
                                            {demon.Name}
                                        </Anchor>
                                    </Table.Td>
                                    <Table.Td key={`level-${index}`} rowSpan={demonLocation.Zone.length || 1}>
                                        <Center>{demon.Level}</Center>
                                    </Table.Td>
                                    <Table.Td key={`zone-${index}-0`}>
                                        {demonLocation.Zone[0]}
                                    </Table.Td>
                                    {locPlusNotes[0]}
                                </Table.Tr>

                                {
                                    demonLocation.Zone.slice(1).map((zone, zoneIndex) => (
                                        <Table.Tr key={`zone-row-${index}-${zoneIndex + 1}`}>
                                            <Table.Td key={`zone-${index}-${zoneIndex + 1}`}>
                                                {zone}
                                            </Table.Td>
                                            {locPlusNotes[zoneIndex + 1]}
                                        </Table.Tr>
                                    ))
                                }
                            </React.Fragment>
                        )
                    })}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}