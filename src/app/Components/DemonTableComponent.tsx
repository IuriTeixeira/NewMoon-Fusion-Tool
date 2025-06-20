'use client'
import { IconCheck, IconX } from '@tabler/icons-react'
import { Text, Table, Image, Anchor, useComputedColorScheme, Center } from '@mantine/core'
import { racesLaw, racesChaos } from '@/utils/constants'
import { cleanString, sortTable } from '@/utils/functionUtils'
import demonList from '../Data/demons.json' assert {type: "json"}
import variantDemonList from '../Data/variant_demons.json' assert {type: "json"}
import React from 'react'
import Link from 'next/link'

interface DemonTableProps {
    raceFilter: string,
    hidePlugins: boolean,
    displayVariants: boolean,
}

export default function DemonTableComponent({ raceFilter, hidePlugins, displayVariants }: DemonTableProps) {
    const colorScheme = useComputedColorScheme();

    let filteredDemonList: Demon[]

    if (raceFilter !== '') {
        if (hidePlugins) {
            if (displayVariants) {
                filteredDemonList = [...demonList, ...variantDemonList].filter((d: Demon) => d.Plugin[0] === false && d.Race === raceFilter)
            } else {
                filteredDemonList = demonList.filter((d: Demon) => d.Plugin[0] === false && d.Race === raceFilter)
            }
        } else {
            if (displayVariants) {
                filteredDemonList = [...demonList, ...variantDemonList].filter((demon: Demon) => demon.Race === raceFilter)
            } else {
                filteredDemonList = demonList.filter((demon: Demon) => demon.Race === raceFilter)
            }
        }
    } else {
        if (hidePlugins) {
            if (displayVariants) {
                filteredDemonList = [...demonList, ...variantDemonList].filter((d: Demon) => d.Plugin[0] === false)
            } else {
                filteredDemonList = demonList.filter((d: Demon) => d.Plugin[0] === false)
            }
        } else {
            if (displayVariants) {
                filteredDemonList = [...demonList, ...variantDemonList]
            } else {
                filteredDemonList = demonList
            }
        }
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
                            <Center>Fusion Range</Center>
                        </Table.Th>
                        <Table.Th>
                            <Center>Plugin</Center>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {sortedDemonList.filter((d: Demon) => d.Variant !== true).map((demon, index) => {
                        const imageName: string = cleanString(demon.Name)
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
                        return (
                            <React.Fragment key={`fragment-row-${index}`}>
                                <Table.Tr key={`row-${index}`}>
                                    {demon.Special && demon.Special.length > 0
                                        ?
                                        <React.Fragment key={`race-name-level-${index}`}>
                                            <Table.Th key={`race-${index}`} rowSpan={demon.Special.length} bg={bgColor}><Center key={`race-center-${index}`}>{demon.Race}</Center></Table.Th>
                                            <Table.Td key={`level-${index}`} rowSpan={demon.Special.length}><Center key={`level-center-${index}`}>{demon.Level}</Center></Table.Td>
                                            <Table.Td key={`icon-${index}`} rowSpan={demon.Special.length}><Center key={`icon-center-${index}`}><Image fallbackSrc='/Blank.png' key={`icon-${index}`} src={`/Icons/${imageName}.png`} alt={demon.Name} title={demon.Name} w={32} h={32} /></Center></Table.Td>
                                            <Table.Td key={`name-${index}`} rowSpan={demon.Special.length}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Name } }}>{demon.Name}</Anchor></Table.Td>
                                        </React.Fragment>
                                        :
                                        <React.Fragment key={`race-name-level-${index}`}>
                                            <Table.Th key={`race-${index}`} bg={bgColor}><Center key={`race-center-${index}`}>{demon.Race}</Center></Table.Th>
                                            <Table.Td key={`level-${index}`}><Center key={`icon-center-${index}`}>{demon.Level}</Center></Table.Td>
                                            <Table.Td key={`icon-${index}`}><Center key={`icon-center-${index}`}><Image fallbackSrc='/Blank.png' key={`icon-${index}`} src={`/Icons/${imageName}.png`} alt={demon.Name} title={demon.Name} w={32} h={32} /></Center></Table.Td>
                                            <Table.Td key={`name-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Name } }}>{demon.Name}</Anchor></Table.Td>
                                        </React.Fragment>
                                    }
                                    {demon.Range
                                        ?
                                        <React.Fragment key={`range-fragment-${index}`}>
                                            {typeof (demon.Range[0]) === 'number' ?
                                                <Table.Td key={`range-${index}`}>
                                                    {demon.Range[0]}{demon.Range[1] && ` - ${demon.Range[1]}`}{!demon.Range[1] && '+'}
                                                </Table.Td>
                                                :
                                                <Table.Td key={`range-${index}`}>
                                                    <Text key={`no-fusion-range-text-${index}`} c='red' size='sm'>{demon.Range[0]}</Text>
                                                </Table.Td>
                                            }
                                            <Table.Td key={`plugin-${index}-${0}`}>
                                                <Center key={`plugin-center-${index}`}>
                                                    {demon.Plugin[0] ? <IconCheck size={16} /> : <IconX size={16} />}
                                                </Center>
                                            </Table.Td>

                                        </React.Fragment>
                                        :
                                        demon.Special &&
                                        <React.Fragment key={`special-row-${index}-0`}>
                                            <Table.Td key={`special-${index}-0`}>
                                                <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Special[0][0] } }}>{demon.Special[0][0]}</Anchor>
                                                {demon.Special[0][1] && ' x '}
                                                {demon.Special[0][1] && <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Special[0][1] } }}>{demon.Special[0][1]}</Anchor>}
                                                {demon.Special[0][2] && ' x '}
                                                {demon.Special[0][2] && <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Special[0][2] } }}>{demon.Special[0][2]}</Anchor>}
                                            </Table.Td>
                                            <Table.Td key={`plugin-${index}-0`}>
                                                <Center key={`plugin-center-${index}`}>
                                                    {demon.Plugin[0] ? <IconCheck size={16} /> : <IconX size={16} />}
                                                </Center>
                                            </Table.Td>
                                        </React.Fragment>
                                    }
                                </Table.Tr >
                                {!demon.Range && demon.Special && demon.Special.length > 1 &&
                                    demon.Special.slice(1).map((line, indexSpecial) => (
                                        <Table.Tr key={`special-row-${index}-${indexSpecial}`}>
                                            <Table.Td key={`special-${index}-${indexSpecial}`}>
                                                <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: line[0] } }}>{line[0]}</Anchor>
                                                {line[1] && ' x '}
                                                {line[1] && <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: line[1] } }}>{line[1]}</Anchor>}
                                                {line[2] && ' x '}
                                                {line[2] && <Anchor component={Link} href={{ pathname: '/fusions', query: { demon: line[2] } }}>{line[2]}</Anchor>}
                                            </Table.Td>
                                            <Table.Td key={`plugin-${index}-${indexSpecial}`}>
                                                <Center key={`plugin-center-${index}`}>
                                                    {demon.Plugin[indexSpecial + 1] ? <IconCheck size={16} /> : <IconX size={16} />}
                                                </Center>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                }
                            </React.Fragment >
                        )
                    })}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}
