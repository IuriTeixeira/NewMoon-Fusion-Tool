'use client'
import { useEffect, useState } from "react";
import { Checkbox, Flex, Select } from "@mantine/core";
import { racesLaw, racesNeutral, racesChaos } from '@/utils/constants'
import { loadJSON, sortTable } from "@/utils/functionUtils";

interface FilterProps {
    nameFilter: string,
    setNameFilter: React.Dispatch<React.SetStateAction<string>>,
    raceFilter: string
    setRaceFilter: React.Dispatch<React.SetStateAction<string>>,
    hidePlugins?: boolean,
    setHidePlugins?: React.Dispatch<React.SetStateAction<boolean>>
    displayVariants?: boolean,
    setDisplayVariants?: React.Dispatch<React.SetStateAction<boolean>>
    contractPage?: boolean
    //displayContractOnly?: boolean,
    //setDisplayContractOnly?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FilterComponent({ nameFilter, setNameFilter, raceFilter, setRaceFilter, hidePlugins, setHidePlugins, displayVariants, setDisplayVariants, contractPage /*, displayContractOnly, setDisplayContractOnly */ }: FilterProps) {
    const races: string[] = [...racesLaw, ...racesNeutral, ...racesChaos]
    const [data, setData] = useState<Data | null>()
    const [filteredDemonList, setFilteredDemonList] = useState<Demon[]>([]);

    useEffect(() => {
        Promise.all([
            loadJSON('/Data/demons.json'),
            loadJSON('/Data/variant_demons.json'),
            loadJSON('/Data/contract_demons.json'),
        ]).then(([demonsList, variantDemonsList, contractDemonsList]) => {
            setData({ demonsList, variantDemonsList, contractDemonsList })
        })
    }, [])

    useEffect(() => {
        if (!data) return;

        const contractWorkerURL = new URL('../workers/filterContractDemons.worker.js', import.meta.url);
        const generalWorkerURL = new URL('../workers/filterDemons.worker.js', import.meta.url);
        
        const worker:Worker = new Worker(
            contractPage ? contractWorkerURL : generalWorkerURL,
            { type: 'module' }
        );
        worker.onmessage = (e) => {
            setFilteredDemonList(e.data);
            worker.terminate();
        };

        worker.postMessage({
            demonsList: data?.demonsList ?? [],
            variantDemonsList: data?.variantDemonsList ?? [],
            contractDemonsList: data?.contractDemonsList ?? [],
            hidePlugins,
            displayVariants,
            raceFilter,
            nameFilter
        });

    }, [data, hidePlugins, displayVariants, raceFilter, nameFilter, contractPage]);

    const sortedDemonsList:Demon[] = sortTable(filteredDemonList)
    const searchDemonList:string[] = sortedDemonsList.map((d:Demon) => d.Name)
    
    return (
        <Flex justify='center' align={'flex-end'} gap={'xl'}>
            <Select
                size={"sm"}
                label="Filter by Name"
                value={nameFilter}
                onChange={(value) => setNameFilter(value ?? '')}
                data={searchDemonList}
                clearable
                searchable
            />
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
            {/*setDisplayContractOnly && <Checkbox
                checked={displayContractOnly}
                label="Display only contractable demons"
                onChange={(event) => setDisplayContractOnly(event.currentTarget.checked)}
            />*/}
        </Flex>
    )
}