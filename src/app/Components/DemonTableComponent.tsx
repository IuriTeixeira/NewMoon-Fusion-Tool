'use client'
import { Flex, Text, Table } from '@mantine/core'
import demonList from '../Data/demons.json'
import React from 'react'

export default function DemonTableComponent() {
    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>
                        <Flex align='center' justify='center'>Race</Flex>
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
                {demonList.map((demon, index) => {
                    return (
                        <Table.Tr key={`row-${index}`}>
                            <Table.Td key={`race-${index}`}>{demon.Race}</Table.Td>
                            <Table.Td key={`name-${index}`}>{demon.Name}</Table.Td>
                            <Table.Td key={`level-${index}`}><Flex key={`level-flex-${index}`} align='center' justify='center'>{demon.Level}</Flex></Table.Td>
                            {demon.Range && typeof(demon.Range[0]) === 'number' &&
                                <Table.Td key={`range-${index}`}>
                                    {demon.Range[0]}{demon.Range[1] && ` - ${demon.Range[1]}`}{!demon.Range[1] && '+'}
                                </Table.Td>}
                            {demon.Range && typeof(demon.Range[0]) !== 'number' &&
                                <Table.Td key={`range-${index}`}>
                                    {<Text key={`no-fusion-range-text-${index}`} c='red' size='sm'>{demon.Range[0]}</Text>}
                                </Table.Td>}
                            {!demon.Range && demon.Special &&
                                <Table.Td key={`special-${index}`}>
                                    {demon.Special.map((line, indexSpecial) => (
                                        <React.Fragment key={`fragment-${index}-${indexSpecial}`}>
                                            {line[0]}
                                            {line[1] && ` x ${line[1]}`}
                                            {line[2] && ` x ${line[2]}`}
                                            <br key={`br-${index}-${indexSpecial}`} />
                                        </React.Fragment>
                                    ))}
                                </Table.Td>}
                            {demon.Plugin && <Table.Td key={`plugin-${index}`}><Flex key={`plugin-flex-${index}`} align='center' justify='center'>Yes</Flex></Table.Td>}
                            {!demon.Plugin && <Table.Td key={`plugin-${index}`}><Flex key={`plugin-flex-${index}`} align='center' justify='center'>No</Flex></Table.Td>}
                        </Table.Tr>
                    )
                })}
            </Table.Tbody>
        </Table>
    )
}