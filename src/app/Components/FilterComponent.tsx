'use client'
import { Checkbox, Flex, Select } from "@mantine/core";

interface FilterProps {
    raceFilter: string
    setRaceFilter: React.Dispatch<React.SetStateAction<string>>,
    hidePlugins: boolean,
    setHidePlugins: React.Dispatch<React.SetStateAction<boolean>>
    displayVariants: boolean,
    setDisplayVariants: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FilterComponent({ raceFilter, setRaceFilter, hidePlugins, setHidePlugins, displayVariants, setDisplayVariants }: FilterProps) {
    const racesLaw: string[] = ["Avian", "Demon God", "Divine", "Earth Element", "Entity", "Evil Demon", "Goddess", "Heavenly God", "Machine", "Raptor", "Seraph", "Vile", "Wild Bird", "Yoma"]
    const racesNeutral: string[] = ["Beast", "Demigod", "Dragon King", "Element", "Fairy", "Fiend", "Godly Beast", "Holy Beast", "Nocturne", "Reaper", "Wilder", "Sacred Soul"]
    const racesChaos: string[] = ["Brute", "Destroyer", "Dragon", "Earth Mother", "Evil Dragon", "Fallen", "Femme", "Foul", "Guardian", "Haunt", "Nation Ruler", "Tyrant"]
    const races: string[] = [...racesLaw, ...racesNeutral, ...racesChaos]

    return (
        <Flex justify='center' align={'flex-end'} gap={'xl'}>
            <Select
                size={"sm"}
                label="Filter by Race"
                value={raceFilter}
                onChange={(value) => setRaceFilter(value ?? '')}
                data={races}
                clearable
                searchable
            />
            <Checkbox
                checked={hidePlugins}
                label="Hide plugin demons"
                onChange={(event) => setHidePlugins(event.currentTarget.checked)}
            />
            <Checkbox
                checked={displayVariants}
                label="Show variant demons"
                onChange={(event) => setDisplayVariants(event.currentTarget.checked)}
            />
        </Flex>
    )
}