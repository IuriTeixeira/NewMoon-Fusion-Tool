import { Anchor, Flex, Table } from "@mantine/core";
import raceCombinations from '../Data/race_combinations.json'
import demonsList from '../Data/demons.json'
import variantDemonsList from '../Data/variant_demons.json'
import React from "react";
import Link from "next/link";
import { IconCheck, IconX } from "@tabler/icons-react";

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
        const allValidFusions: DemonPair[] = []
        if (demon.Special) {
            demon.Special.forEach((combination: string[]) => {
                const findDemon1:Demon = demonsList.find((d: Demon) => combination[0] === d.Name) as Demon
                let demon1:Demon
                if(findDemon1) {
                    demon1 = findDemon1
                }else{
                    demon1 = variantDemonsList.find((d: Demon) => combination[0] === d.Name) as Demon
                }
                const findDemon2: Demon = demonsList.find((d: Demon) => combination[1] === d.Name) as Demon
                let demon2:Demon
                if(findDemon2) {
                    demon2 = findDemon2
                }else{
                    demon2 = variantDemonsList.find((d: Demon) => combination[1] === d.Name) as Demon
                }
                
                if (demon1 && demon2) {
                    if (combination.length > 2) {
                        const findDemon3: Demon = demonsList.find((d: Demon) => combination[2] === d.Name) as Demon
                        let demon3:Demon
                        if (findDemon3) {
                            demon3 = findDemon3
                        }else{
                            demon3 = variantDemonsList.find((d: Demon) => combination[2] === d.Name) as Demon
                        }
                        allValidFusions.push({ demon1, demon2, demon3 })
                    } else {
                        allValidFusions.push({ demon1, demon2 })
                    }
                }
            })
        } else {
            if (demon.Range && typeof(demon.Range![0]) !== 'string' && filteredCombinations[0].Elements) {
                const raceRanks: Demon[] = demonsList
                    .filter((d: Demon) => d.Race === demon.Race)
                    .filter((d: Demon) => d.Variant !== true)
                    .map((d: Demon) => d);
                let targetRank = -1
                const elements: Demon[] = [
                    demonsList.find((d: Demon) => d.Name === 'Erthys')!,
                    demonsList.find((d: Demon) => d.Name === 'Aeros')!,
                    demonsList.find((d: Demon) => d.Name === 'Aquans')!,
                    demonsList.find((d: Demon) => d.Name === 'Flamies')!
                ]
                for (let i = 0; i < raceRanks.length; i++) {
                    if (raceRanks[i].Name === demon.Name) {
                        targetRank = i
                    }
                }
                for (let i = 0; i < 4; i++) {
                    let checkNext: boolean = false
                    if (filteredCombinations[0].Elements[i] === 'Down') {
                        if (raceRanks[targetRank + 1]) {
                            allValidFusions.push({ demon1: elements[i], demon2: raceRanks[targetRank + 1] })
                            if (raceRanks[targetRank + 1].Special || raceRanks[targetRank + 1].Range![0] === "Can't be fused") {
                                checkNext = true
                            }
                            if (checkNext) {
                                for (let j = targetRank + 1; j <= raceRanks.length - targetRank; j++) {
                                    if (checkNext && raceRanks[j + 1]) {
                                        allValidFusions.push({ demon1: elements[i], demon2: raceRanks[j + 1] })
                                        checkNext = false
                                    } else {
                                        break
                                    }
                                }
                            }
                        }
                    } else {
                        if (raceRanks[targetRank - 1]) {
                            allValidFusions.push({ demon1: elements[i], demon2: raceRanks[targetRank - 1] })
                            if (raceRanks[targetRank + 1].Special || raceRanks[targetRank + 1].Range![0] === "Can't be fused") {
                                checkNext = true
                            }
                            if (checkNext) {
                                for (let j = targetRank - 1; j >= 0; j--) {
                                    if (checkNext && raceRanks[j - 1]) {
                                        allValidFusions.push({ demon1: elements[i], demon2: raceRanks[j - 1] })
                                        checkNext = false
                                    } else {
                                        break
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
                                        allValidFusions.push({ demon1, demon2 })
                                    }
                                } else {
                                    allValidFusions.push({ demon1, demon2 })
                                }
                            }
                        }
                    })
                })
            })
        }
        return allValidFusions
    }

    const fusionResults: DemonPair[] = calculateFusions()
    
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        {demon.Special
                            ?
                            <React.Fragment>
                                <Table.Th rowSpan={2}><Flex justify={'center'}>Plugin?</Flex></Table.Th>
                                <Table.Th colSpan={2}><Flex justify={'center'}>Material 1</Flex></Table.Th>
                                <Table.Th colSpan={2}><Flex justify={'center'}>Material 2</Flex></Table.Th>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Table.Th colSpan={3}><Flex justify={'center'}>Material 1</Flex></Table.Th>
                                <Table.Th colSpan={3}><Flex justify={'center'}>Material 2</Flex></Table.Th>
                            </React.Fragment>
                        }
                        {demon.Special && fusionResults[0]?.demon3 && demon.Special && <Table.Th colSpan={2}><Flex justify={'center'}>Material 3</Flex></Table.Th>}
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
                                    <Table.Td key={`plugin-${combo.demon2.Race}-${index}`}>
                                        <Flex justify={'center'}>{demon.Plugin[index] ? <IconCheck size={16}/> : <IconX size={16}/>}</Flex>
                                    </Table.Td>
                                    {combo.demon1 &&
                                        <React.Fragment key={`demon1-${index}`}>
                                            <Table.Td key={`race-${combo.demon1.Race}-${index}`}>{combo.demon1.Race}</Table.Td>
                                            <Table.Td key={`name-${combo.demon1.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor></Table.Td>
                                        </React.Fragment>
                                    }
                                    {combo.demon2 &&
                                        <React.Fragment key={`demon2-${index}`}>
                                            <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon2.Race}</Table.Td>
                                            <Table.Td key={`name-${combo.demon2.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor></Table.Td>
                                        </React.Fragment>
                                    }
                                    {combo.demon3 &&
                                        <React.Fragment key={`demon3-${index}`}>
                                            <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon3?.Race}</Table.Td>
                                            <Table.Td key={`name-${combo.demon2.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon3?.Name } }}>{combo.demon3?.Name}</Anchor></Table.Td>
                                        </React.Fragment>
                                    }
                                </Table.Tr>
                                :
                                <Table.Tr key={index}>
                                    <Table.Td key={`race-${combo.demon1.Race}-${index}`}>{combo.demon1.Race}</Table.Td>
                                    <Table.Td key={`name-${combo.demon1.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor></Table.Td>
                                    <Table.Td key={`level-${combo.demon1.Race}-${index}`}>{combo.demon1.Level}</Table.Td>
                                    <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon2.Race}</Table.Td>
                                    <Table.Td key={`name-${combo.demon2.Race}-${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor></Table.Td>
                                    <Table.Td key={`level-${combo.demon2.Race}-${index}`}>{combo.demon2.Level}</Table.Td>
                                </Table.Tr>
                        ))
                        : (
                            <Table.Tr>
                                <Table.Td colSpan={10}><Flex justify={'center'}>No valid fusions found.</Flex></Table.Td>
                            </Table.Tr>
                        )
                    }
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}