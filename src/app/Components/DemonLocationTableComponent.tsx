'use client'
import { Center, Image, Anchor, Table, useComputedColorScheme } from '@mantine/core'
import demonList from '../Data/demons.json' assert {type: "json"}
import variantDemonList from '../Data/variant_demons.json'
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

    const racesLaw: string[] = ["Avian", "Demon God", "Divine", "Earth Element", "Entity", "Evil Demon", "Goddess", "Heavenly God", "Machine", "Raptor", "Seraph", "Vile", "Wild Bird", "Yoma"]
    const racesNeutral: string[] = ["Beast", "Demigod", "Dragon King", "Element", "Fairy", "Fiend", "Godly Beast", "Holy Beast", "Nocturne", "Reaper", "Wilder", "Sacred Soul"]
    const racesChaos: string[] = ["Brute", "Destroyer", "Dragon", "Earth Mother", "Evil Dragon", "Fallen", "Femme", "Foul", "Guardian", "Haunt", "Nation Ruler", "Tyrant"]

    const demonLocations: DemonLocation[] = demonLocList as DemonLocation[]
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

    const regularDemons: Demon[] = demonList.filter((demon: Demon) =>
        demonLocations.some((loc: DemonLocation) => loc.Name === demon.Name)
    );

    const variantDemons: Demon[] = variantDemonList.filter((demon: Demon) =>
        demonLocations.some((loc: DemonLocation) => loc.Name === demon.Name)
    );

    const filteredDemonList: Demon[] = [...regularDemons, ...variantDemons]
    const sortedDemonList = [...filteredDemonList].sort((a, b) => {
        // 1st: Sort by alignment priority (Law > Neutral > Chaos)
        const aAlignment =
            racesLaw.includes(a.Race) ? 0 :
                racesNeutral.includes(a.Race) ? 1 : 2;
        const bAlignment =
            racesLaw.includes(b.Race) ? 0 :
                racesNeutral.includes(b.Race) ? 1 : 2;

        if (aAlignment !== bAlignment) {
            return aAlignment - bAlignment;
        }

        // 2nd: If same alignment, sort by Race (A-Z)
        if (a.Race < b.Race) return -1;
        if (a.Race > b.Race) return 1;

        // 3rd: If same Race, sort by Level (ascending)
        if (a.Level < b.Level) return -1;
        if (a.Level > b.Level) return 1;

        // 4th: If same Level, sort by Name (A-Z)
        return a.Name.localeCompare(b.Name);
    });

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
                            <Center>Level</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Icon</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Name</Center>
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
                    {sortedDemonList.map((demon: Demon, index: number) => {
                        const imageName: string = cleanString(demon.Name)
                        const demonLocation: DemonLocation = demonLocations.find((d: DemonLocation) => d.Name === demon.Name) as DemonLocation
                        const locPlusNotes: (JSX.Element | null)[] = []
                        let bgColor: string = ''
                        if (racesLaw.includes(demon.Race)) {
                            bgColor = 'cyan'
                        } else {
                            if (racesChaos.includes(demon.Race)) {
                                bgColor = 'red'
                            } else {
                                bgColor = 'green'
                            }
                        }
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

                        return (
                            <React.Fragment key={`row-fragment-${index}-${demon.Name}`}>
                                <Table.Tr key={`row-${index}-${demon.Name}`}>
                                    <Table.Th key={`race-${index}`} rowSpan={demonLocation.Zone.length || 1} bg={bgColor}>
                                        <Center>{demon.Race}</Center>
                                    </Table.Th>
                                    <Table.Td key={`level-${index}`} rowSpan={demonLocation.Zone.length || 1}>
                                        <Center>{demon.Level}</Center>
                                    </Table.Td>
                                    <Table.Td key={`icon-${index}`} rowSpan={demonLocation.Zone.length || 1}>
                                        <Center><Image fallbackSrc='/Blank.png' src={`/Icons/${imageName}.png`} alt={demon.Name} w={32} h={32} /></Center>
                                    </Table.Td>
                                    <Table.Td key={`name-${index}`} rowSpan={demonLocation.Zone.length || 1}>
                                        <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Name } }}>
                                            {demon.Name}
                                        </Anchor>
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