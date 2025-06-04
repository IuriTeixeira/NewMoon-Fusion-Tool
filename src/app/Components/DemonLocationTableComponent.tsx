'use client'
import { Center, Image, Anchor, Table, useComputedColorScheme } from '@mantine/core'
import { cleanString, sortTable } from '@/utils/functionUtils'
import { racesLaw, racesChaos } from '@/utils/constants'
import demonList from '../Data/demons.json' assert {type: "json"}
import variantDemonList from '../Data/variant_demons.json'
import demonLocList from '../Data/contract_demons.json'
import React, { JSX } from 'react'
import Link from 'next/link';

interface DemonLocationTableProps {
    raceFilter: string
}

export default function DemonLocationTableComponent({ raceFilter }: DemonLocationTableProps) {
    const colorScheme = useComputedColorScheme();

    const demonLocations: DemonLocation[] = demonLocList as DemonLocation[]

    const regularDemons: Demon[] = demonList.filter((demon: Demon) =>
        demonLocations.some((loc: DemonLocation) => loc.Name === demon.Name)
    );

    const variantDemons: Demon[] = variantDemonList.filter((demon: Demon) =>
        demonLocations.some((loc: DemonLocation) => loc.Name === demon.Name)
    );

    let filteredDemonList: Demon[] = []

    if (raceFilter !== '') {
        filteredDemonList = [...regularDemons, ...variantDemons].filter((demon: Demon) => demon.Race === raceFilter)
    } else {
        filteredDemonList = [...regularDemons, ...variantDemons]
    }

    const sortedDemonList = sortTable(filteredDemonList)

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
                    {sortedDemonList.length <= 0
                    ?
                    <Table.Tr>
                        <Table.Td colSpan={7}><Center>No demons of the {raceFilter} race are available to be contracted.</Center></Table.Td>
                    </Table.Tr>
                    :
                    sortedDemonList.map((demon: Demon, index: number) => {
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