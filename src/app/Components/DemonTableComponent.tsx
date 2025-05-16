'use client'
import { Flex, Text, Table, Image, Anchor } from '@mantine/core'
import demonList from '../Data/demons.json' assert {type: "json"}
import React, { ReactNode } from 'react'
import Link from 'next/link'

interface DemonTableProps {
    raceFilter: string,
}

export default function DemonTableComponent({ raceFilter }: DemonTableProps) {
    let filteredDemonList: Demon[]

    raceFilter !== ''
        ?
        filteredDemonList = demonList.filter((demon: Demon) => demon.Race === raceFilter)
        :
        filteredDemonList = demonList

    return (
        <Table withTableBorder withColumnBorders>
            <Table.Thead>
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
                        <Flex align='center' justify='center'>Fusion Range</Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex align='center' justify='center'>Plugin</Flex>
                    </Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {filteredDemonList.filter((d: Demon) => d.Display !== false).map((demon, index) => {
                    return (
                        <React.Fragment key={`fragment-row-${index}`}>
                            <Table.Tr key={`row-${index}`}>
                                {demon.Special && demon.Special.length > 0
                                    ?
                                    <React.Fragment key={`race-name-level-${index}`}>
                                        <Table.Td key={`race-${index}`} rowSpan={demon.Special.length}>{demon.Race}</Table.Td>
                                        <Table.Td key={`icon-${index}`} rowSpan={demon.Special.length}><Flex key={`icon-flex-${index}`} align='center' justify='center'><Image fallbackSrc='/Blank.png' key={`icon-${index}`} src={`/Icons/${demon.Name}.png`} alt={demon.Name} title={demon.Name} w={32} h={32} /></Flex></Table.Td>
                                        <Table.Td key={`name-${index}`} rowSpan={demon.Special.length}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Name } }}>{demon.Name}</Anchor></Table.Td>
                                        <Table.Td key={`level-${index}`} rowSpan={demon.Special.length}><Flex key={`level-flex-${index}`} align='center' justify='center'>{demon.Level}</Flex></Table.Td>
                                    </React.Fragment>
                                    :
                                    <React.Fragment key={`race-name-level-${index}`}>
                                        <Table.Td key={`race-${index}`}>{demon.Race}</Table.Td>
                                        <Table.Td key={`icon-${index}`}><Flex key={`icon-flex-${index}`} align='center' justify='center'><Image fallbackSrc='/Blank.png' key={`icon-${index}`} src={`/Icons/${demon.Name}.png`} alt={demon.Name} title={demon.Name} w={32} h={32} /></Flex></Table.Td>
                                        <Table.Td key={`name-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: demon.Name } }}>{demon.Name}</Anchor></Table.Td>
                                        <Table.Td key={`level-${index}`}><Flex key={`level-flex-${index}`} align='center' justify='center'>{demon.Level}</Flex></Table.Td>
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
                                            <Flex key={`plugin-flex-${index}`} align='center' justify='center'>
                                                {demon.Plugin[0] ? "✔️" : "❌"}
                                            </Flex>
                                        </Table.Td>

                                    </React.Fragment>
                                    :
                                    demon.Special &&
                                    <React.Fragment key={`special-row-${index}-0`}>
                                        <Table.Td key={`special-${index}-0`}>
                                            {demon.Special[0][0]}
                                            {demon.Special[0][1] && ` x ${demon.Special[0][1]}`}
                                            {demon.Special[0][2] && ` x ${demon.Special[0][2]}`}
                                        </Table.Td>
                                        <Table.Td key={`plugin-${index}-0`}>
                                            <Flex key={`plugin-flex-${index}`} align='center' justify='center'>
                                                {demon.Plugin[0] ? "✔️" : "❌"}
                                            </Flex>
                                        </Table.Td>
                                    </React.Fragment>
                                }
                            </Table.Tr >
                            {!demon.Range && demon.Special && demon.Special.length > 1 &&
                                demon.Special.slice(1).map((line, indexSpecial) => (
                                    <Table.Tr key={`special-row-${index}-${indexSpecial}`}>
                                        <Table.Td key={`special-${index}-${indexSpecial}`}>
                                            {line[0]}
                                            {line[1] && ` x ${line[1]}`}
                                            {line[2] && ` x ${line[2]}`}
                                        </Table.Td>
                                        <Table.Td key={`plugin-${index}-${indexSpecial}`}>
                                            <Flex key={`plugin-flex-${index}`} align='center' justify='center'>
                                                {demon.Plugin[indexSpecial + 1] ? "✔️" : "❌"}
                                            </Flex>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            }
                        </React.Fragment >
                    )
                })}
            </Table.Tbody>
        </Table>
    )
}