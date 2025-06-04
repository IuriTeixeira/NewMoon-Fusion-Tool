'use client'
import { Checkbox, Flex, Select } from "@mantine/core";
import { racesLaw, racesNeutral, racesChaos } from '@/utils/constants'

interface FilterProps {
    raceFilter: string
    setRaceFilter: React.Dispatch<React.SetStateAction<string>>,
    hidePlugins?: boolean,
    setHidePlugins?: React.Dispatch<React.SetStateAction<boolean>>
    displayVariants?: boolean,
    setDisplayVariants?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FilterComponent({ raceFilter, setRaceFilter, hidePlugins, setHidePlugins, displayVariants, setDisplayVariants }: FilterProps) {
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
            {setHidePlugins && <Checkbox
                checked={hidePlugins}
                label="Hide plugin demons"
                onChange={(event) => setHidePlugins(event.currentTarget.checked)}
            />}
            {setDisplayVariants && <Checkbox
                checked={displayVariants}
                label="Show variant demons"
                onChange={(event) => setDisplayVariants(event.currentTarget.checked)}
            />}
        </Flex>
    )
}