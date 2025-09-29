'use client'
import { Center, Image, Anchor, Table, useComputedColorScheme, LoadingOverlay } from '@mantine/core'
import { cleanString, loadJSON, sortTable } from '@/utils/functionUtils'
import { racesLaw, racesChaos } from '@/utils/constants'
import React, { JSX, useEffect, useState } from 'react'
import Link from 'next/link';

interface DemonLocationTableProps {
    nameFilter: string,
    raceFilter: string
}

export default function DemonLocationTableComponent({ nameFilter, raceFilter }: DemonLocationTableProps) {
    const colorScheme = useComputedColorScheme();

    const [data, setData] = useState<Data | null>()
    const [loading, setLoading] = useState(false);
    const [filteredDemonList, setfilteredDemonList] = useState<Demon[]>([]);

    useEffect(() => {
        Promise.all([
            loadJSON('/Data/demons.json'),
            loadJSON('/Data/variant_demons.json'),
            loadJSON('/Data/contract_demons.json'),
        ]).then(([demonsList, variantDemonsList, contractDemonsList]) => {
            setData({ demonsList, variantDemonsList, contractDemonsList })
        })

    }, [])

    useEffect(() => {
        if (!data) return;

        setLoading(true);

        const worker = new Worker(
            new URL('@/app/workers/filterContractDemons.worker.js', import.meta.url),
            { type: 'module' }
        );

        worker.onmessage = (e) => {
            setfilteredDemonList(e.data);
            setTimeout(() => setLoading(false), 0);
            worker.terminate();
        };

        worker.postMessage({
            demonsList: data?.demonsList ?? [],
            variantDemonsList: data?.variantDemonsList ?? [],
            contractDemonsList: data?.contractDemonsList ?? [],
            raceFilter,
            nameFilter
        });
    }, [data, raceFilter, nameFilter]);

    const sortedDemonsList = sortTable(filteredDemonList)

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
                    {loading && (
                        <Table.Tr style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                            <Table.Td colSpan={6} style={{ padding: 0 }}>
                                <LoadingOverlay visible zIndex={1000} overlayProps={{ blur: 2 }} />
                            </Table.Td>
                        </Table.Tr>
                    )}
                    {sortedDemonsList.length <= 0
                        ?
                        <Table.Tr>
                            <Table.Td colSpan={7}><Center>No demons of the {raceFilter} race are available to be contracted.</Center></Table.Td>
                        </Table.Tr>
                        :
                        sortedDemonsList.map((demon: Demon, index: number) => {
                            const imageName: string = cleanString(demon.Name)
                            const demonLocation: DemonLocation = data?.contractDemonsList?.find((d: DemonLocation) => d.Name === demon.Name) as DemonLocation
                            if (demonLocation) {
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
                                                <Center><Image loading="lazy" fallbackSrc='/Blank.png' src={`/Icons/${imageName}.png`} alt={demon.Name} w={32} h={32} /></Center>
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
                            }

                        })}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}