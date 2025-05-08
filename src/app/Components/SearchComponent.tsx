'use client'
import { Select, SimpleGrid } from "@mantine/core";
import demonList from '../Data/demons.json' assert {type: "json"}

interface SearchProps {
    setFilter: React.Dispatch<React.SetStateAction<string>>
    setDemon: React.Dispatch<React.SetStateAction<string>>
}

interface Demon {
    Race: string;
    Name: string;
    Level: number;
    Range: (number | null)[] | string[] | null;
    Special: string[][] | null;
    Plugin: boolean[]
}


export default function SearchComponent({ setFilter, setDemon }: SearchProps) {
    const racesLaw: string[] = ["Avian", "Demon God", "Divine", "Earth Element", "Entity", "Evil Demon", "Goddess", "Heavenly God", "Machine", "Raptor", "Seraphim", "Vile", "Wild Bird", "Yoma"]
    const racesNeutral: string[] = ["Beast", "Demigod", "Dragon King", "Elemental", "Fairy", "Fiend", "Godly Beast", "Holy Beast", "Nocturne", "Reaper", "Wilder", "Sacred Soul"]
    const racesChaos: string[] = ["Brute", "Destroyer", "Dragon", "Earth Mother", "Evil Dragon", "Fallen Angel", "Femme", "Foul", "Gaian", "Guardian", "Haunt", "Nation Ruler", "Tyrant"]
    const races: string[] = [...racesLaw, ...racesNeutral, ...racesChaos]
    const displayDemons: string[] = demonList.map((demon) => demon.Name)

    return (
        <SimpleGrid cols={2}>
            <Select
                radius="xl"
                label="Race"
                placeholder="Select Race"
                onChange={(value) => setFilter(value ?? '')}
                data={races}
                clearable
                searchable
            />
            <Select
                radius="xl"
                label="Demon"
                placeholder="Search Demon"
                //onChange={}
                data={displayDemons}
                clearable
                searchable
            />
        </SimpleGrid>
    )
}