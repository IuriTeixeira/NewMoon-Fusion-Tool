import { Flex, Table } from "@mantine/core";
import raceCombinations from '../Data/race_combinations.json'
import demonsList from '../Data/demons.json'
import React from "react";

interface FusionProps {
    demon: Demon
}

interface FusionData {
    Race: string;
    Combinations: string[][] | null;
    Elements: string[] | null
}

type FusionCombination = {
    race1: string;
    race2: string;
}

interface DemonPair {
    demon1: Demon
    demon2: Demon
    demon3?: Demon
}

export default function FusionTableComponent({ demon }: FusionProps) {

    const filteredCombinations: FusionData[] = raceCombinations.filter(target => demon.Race === target.Race)
    const combinations: FusionCombination[] = filteredCombinations.flatMap(race =>
        race.Combinations?.map(combination => ({
            race1: combination[0],
            race2: combination[1]
        })) || []
    );

    function calculateFusions(): DemonPair[] {
        const allValidPairs: DemonPair[] = []

        if (demon.Special) {
            demon.Special.forEach((combination: string[]) => {
                const demon1: Demon = demonsList.find((d: Demon) => combination[0].includes(d.Name)) as Demon
                const demon2: Demon = demonsList.find((d: Demon) => combination[1].includes(d.Name)) as Demon

                if (demon1 && demon2) {
                    const variantDemon1: Demon = { ...demon1, Name: combination[0] }
                    const variantDemon2: Demon = { ...demon2, Name: combination[1] }

                    if (combination.length > 2) {
                        const demon3: Demon = demonsList.find((d: Demon) => combination[2].includes(d.Name)) as Demon
                        if (demon3) {
                            const variantDemon3: Demon = { ...demon3, Name: combination[2] }
                            allValidPairs.push({ demon1: variantDemon1, demon2: variantDemon2, demon3: variantDemon3 })
                        }
                    } else {
                        allValidPairs.push({ demon1: variantDemon1, demon2: variantDemon2 })
                    }
                }
            })
        } else {
            combinations.forEach((combination: FusionCombination) => {
                const allDemon1s = demonsList.filter((d: Demon) => d.Race === combination.race1)
                const allDemon2s = demonsList.filter((d: Demon) => d.Race === combination.race2)


                allDemon1s.forEach((demon1: Demon) => {
                    allDemon2s.forEach((demon2: Demon) => {
                        const levelRange = demon1.Level + demon2.Level
                        if (demon.Range && demon.Range[0] && typeof (demon.Range[0]) === 'number') {
                            if (levelRange >= demon.Range[0]) {
                                if (demon.Range[1] && typeof (demon.Range[1]) == 'number') {
                                    if (levelRange <= demon.Range[1]) {
                                        allValidPairs.push({ demon1, demon2 })
                                    }
                                } else {
                                    allValidPairs.push({ demon1, demon2 })
                                }
                            }
                        }
                    })
                })
            })
        }
        return allValidPairs
    }

    const fusionResults = calculateFusions()

    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    {demon.Special
                        ?
                        <React.Fragment>
                        <Table.Th rowSpan={fusionResults.length}><Flex justify={'center'}>Plugin?</Flex></Table.Th>
                            <Table.Th colSpan={2} w={'33%'}><Flex justify={'center'}>Material 1</Flex></Table.Th>
                            <Table.Th colSpan={2} w={'33%'}><Flex justify={'center'}>Material 2</Flex></Table.Th>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Table.Th colSpan={3} w={'50%'}><Flex justify={'center'}>Material 1</Flex></Table.Th>
                            <Table.Th colSpan={3} w={'50%'}><Flex justify={'center'}>Material 2</Flex></Table.Th>
                        </React.Fragment>
                    }
                    {demon.Special && fusionResults[0]?.demon3 && demon.Special && <Table.Th colSpan={2} w={'33%'}><Flex justify={'center'}>Material 3</Flex></Table.Th>}
                </Table.Tr>
                <Table.Tr>
                    <Table.Th><Flex justify={'center'}>Race</Flex></Table.Th>
                    <Table.Th><Flex justify={'center'}>Name</Flex></Table.Th>
                    {!demon.Special && <Table.Th><Flex justify={'center'}>Lv</Flex></Table.Th>}
                    <Table.Th><Flex justify={'center'}>Race</Flex></Table.Th>
                    <Table.Th><Flex justify={'center'}>Name</Flex></Table.Th>
                    {!demon.Special && <Table.Th><Flex justify={'center'}>Lv</Flex></Table.Th>}
                    {fusionResults[0]?.demon3 &&
                        <React.Fragment>
                            <Table.Th><Flex justify={'center'}>Race</Flex></Table.Th>
                            <Table.Th><Flex justify={'center'}>Name</Flex></Table.Th>
                            {!demon.Special && <Table.Th><Flex justify={'center'}>Lv</Flex></Table.Th>}
                        </React.Fragment>}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {fusionResults.length > 0
                    ?
                    fusionResults.map((combo, index) => (
                        demon.Special ?
                            <Table.Tr key={index}>
                                <Table.Td key={`plugin-${combo.demon2.Race}-${index}`}><Flex justify={'center'}>{demon.Plugin[index] ? "✔️" : "❌"}</Flex></Table.Td>
                                {combo.demon1 &&
                                    <React.Fragment key={`demon1-${index}`}>
                                        <Table.Td key={`race-${combo.demon1.Race}-${index}`}>{combo.demon1.Race}</Table.Td>
                                        <Table.Td key={`name-${combo.demon1.Race}-${index}`}>{combo.demon1.Name}</Table.Td>
                                    </React.Fragment>
                                }
                                {combo.demon2 &&
                                    <React.Fragment key={`demon2-${index}`}>
                                        <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon2.Race}</Table.Td>
                                        <Table.Td key={`name-${combo.demon2.Race}-${index}`}>{combo.demon2.Name}</Table.Td>
                                    </React.Fragment>
                                }
                                {combo.demon3 &&
                                    <React.Fragment key={`demon3-${index}`}>
                                        <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon3.Race}</Table.Td>
                                        <Table.Td key={`name-${combo.demon2.Race}-${index}`}>{combo.demon3.Name}</Table.Td>
                                    </React.Fragment>
                                }
                            </Table.Tr>
                            :
                            <Table.Tr key={index}>
                                <Table.Td key={`race-${combo.demon1.Race}-${index}`}>{combo.demon1.Race}</Table.Td>
                                <Table.Td key={`name-${combo.demon1.Race}-${index}`}>{combo.demon1.Name}</Table.Td>
                                <Table.Td key={`level-${combo.demon1.Race}-${index}`}>{combo.demon1.Level}</Table.Td>
                                <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon2.Race}</Table.Td>
                                <Table.Td key={`name-${combo.demon2.Race}-${index}`}>{combo.demon2.Name}</Table.Td>
                                <Table.Td key={`level-${combo.demon2.Race}-${index}`}>{combo.demon2.Level}</Table.Td>
                            </Table.Tr>
                    ))
                    : (
                        <Table.Tr>
                            <Table.Td colSpan={10}><Flex justify={'center'}>No valid fusions found</Flex></Table.Td>
                        </Table.Tr>
                    )
                }
            </Table.Tbody>
        </Table>
    )
}