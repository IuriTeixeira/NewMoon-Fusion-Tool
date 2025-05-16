'use client'
import { Flex, Select } from "@mantine/core";

interface SearchProps {
    raceFilter: string
    setRaceFilter: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchComponent({ raceFilter, setRaceFilter }: SearchProps) {
    const racesLaw: string[] = ["Avian", "Demon God", "Divine", "Earth Element", "Entity", "Evil Demon", "Goddess", "Heavenly God", "Machine", "Raptor", "Seraphim", "Vile", "Wild Bird", "Yoma"]
    const racesNeutral: string[] = ["Beast", "Demigod", "Dragon King", "Elemental", "Fairy", "Fiend", "Godly Beast", "Holy Beast", "Nocturne", "Reaper", "Wilder", "Sacred Soul"]
    const racesChaos: string[] = ["Brute", "Destroyer", "Dragon", "Earth Mother", "Evil Dragon", "Fallen Angel", "Femme", "Foul", "Gaian", "Guardian", "Haunt", "Nation Ruler", "Tyrant"]
    const races: string[] = [...racesLaw, ...racesNeutral, ...racesChaos]

    return (
        <Flex justify='center' align={'flex-end'} gap={'xl'}>
            <Select
                label="Filter by Race"
                value={raceFilter}
                onChange={(value) => setRaceFilter(value ?? '')}
                data={races}
                clearable
                searchable
            />
        </Flex>
    )
}