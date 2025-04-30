'use client'
import { Flex, List, Table } from '@mantine/core'
import demonList from '../Data/demons.json'
import React from 'react'

export default function DemonTableComponent() {
    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>
                        <Flex align='center'>Race</Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex align='center'>Name</Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex align='center'>Level</Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex align='center'>Fusion Range</Flex>
                    </Table.Th>
                    <Table.Th>
                        <Flex align='center'>Plugin</Flex>
                    </Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {demonList.map((demon, index) => {
                    return (
                        <Table.Tr>
                            <Table.Td key={`race-${index}`}>{demon.Race}</Table.Td>
                            <Table.Td key={`name-${index}`}>{demon.Name}</Table.Td>
                            <Table.Td key={`level-${index}`}>{demon.Level}</Table.Td>
                            {demon.Range &&
                                <Table.Td key={`range-${index}`}>
                                    {demon.Range[0]}{demon.Range[1] && ` - ${demon.Range[1]}`}{!demon.Range[1] && '+'} 
                                </Table.Td>}
                            {!demon.Range &&
                                <Table.Td key={`special-${index}`}>
                                    {demon.Special.map((line, index2) => (
                                        <React.Fragment key={`fragment-${index}-${index2}`}>
                                            {line[0]} x {line[1]} {line[2] && `x ${line[2]}`}
                                            <br key={`br-${index}-${index2}`} />
                                        </React.Fragment>
                                    ))}
                                </Table.Td>}
                            {demon.Plugin && <Table.Td key={`plugin-${index}`}>Yes</Table.Td>}
                            {!demon.Plugin && <Table.Td key={`plugin-${index}`}>No</Table.Td>}
                        </Table.Tr>
                    )
                })}
            </Table.Tbody>
        </Table>
    )
}