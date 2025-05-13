import { Flex, Table } from "@mantine/core";
import raceCombinations from '../Data/race_combinations.json'
import demonsList from '../Data/demons.json'

interface FusionProps {
    demon: Demon
}

interface Demon {
    Race: string;
    Name: string;
    Level: number;
    Range: (number | null)[] | string[] | null;
    Special: string[][] | null;
    Plugin: boolean[]
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

        combinations.forEach((combination: FusionCombination) => {
            const allDemon1s = demonsList.filter((d: Demon) => d.Race === combination.race1)
            const allDemon2s = demonsList.filter((d: Demon) => d.Race === combination.race2)

            allDemon1s.forEach((demon1: Demon) => {
                allDemon2s.forEach((demon2: Demon) => {
                    const levelRange = demon1.Level + demon2.Level
                    if (demon.Range && demon.Range[0] && typeof (demon.Range[0]) === 'number') {
                        if (levelRange >= demon.Range[0]) {
                            if (demon.Range[1] && typeof (demon.Range[1]) == 'number') {
                                if(demon1.Name === 'Shikigami' || demon2.Name === 'Shikigami') console.log(demon1.Name, demon2.Name, levelRange)
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
        return allValidPairs
    }

    const fusionResults = calculateFusions()

    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th colSpan={3}><Flex justify={'center'}>Material 1</Flex></Table.Th>
                    <Table.Th colSpan={3}><Flex justify={'center'}>Material 2</Flex></Table.Th>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th><Flex justify={'center'}>Race</Flex></Table.Th>
                    <Table.Th><Flex justify={'center'}>Lv</Flex></Table.Th>
                    <Table.Th><Flex justify={'center'}>Name</Flex></Table.Th>
                    <Table.Th><Flex justify={'center'}>Race</Flex></Table.Th>
                    <Table.Th><Flex justify={'center'}>Lv</Flex></Table.Th>
                    <Table.Th><Flex justify={'center'}>Name</Flex></Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {fusionResults.length > 0
                    ?
                    fusionResults.map((combo, index) => (
                        <Table.Tr key={index}>
                            <Table.Td key={`race-${combo.demon1.Race}-${index}`}>{combo.demon1.Race}</Table.Td>
                            <Table.Td key={`level-${combo.demon1.Race}-${index}`}>{combo.demon1.Level}</Table.Td>
                            <Table.Td key={`name-${combo.demon1.Race}-${index}`}>{combo.demon1.Name}</Table.Td>
                            <Table.Td key={`race-${combo.demon2.Race}-${index}`}>{combo.demon2.Race}</Table.Td>
                            <Table.Td key={`level-${combo.demon2.Race}-${index}`}>{combo.demon2.Level}</Table.Td>
                            <Table.Td key={`name-${combo.demon2.Race}-${index}`}>{combo.demon2.Name}</Table.Td>
                        </Table.Tr>
                    ))
                    : (
                        <Table.Tr>
                            <Table.Td>No valid fusions found</Table.Td>
                        </Table.Tr>
                    )
                }
            </Table.Tbody>
        </Table>
    )
}