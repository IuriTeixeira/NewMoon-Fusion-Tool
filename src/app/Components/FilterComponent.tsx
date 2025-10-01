'use client'
import { useEffect, useState } from "react";
import { Checkbox, Flex, Select, Stack } from "@mantine/core";
import { racesLaw, racesNeutral, racesChaos } from '@/utils/constants'
import { loadJSON } from "@/utils/functionUtils";
import { DemonSearchBarComponent } from "./DemonSearchBarComponent";
import React from "react";

interface FilterProps {
    nameFilter: string,
    setNameFilter: React.Dispatch<React.SetStateAction<string>>,
    raceFilter: string
    setRaceFilter: React.Dispatch<React.SetStateAction<string>>,
    hidePlugins?: boolean,
    setHidePlugins?: React.Dispatch<React.SetStateAction<boolean>>
    displayVariants?: boolean,
    setDisplayVariants?: React.Dispatch<React.SetStateAction<boolean>>
    fusionHideFusionOnly?: boolean,
    setFusionHideFusionOnly?: React.Dispatch<React.SetStateAction<boolean>>
    fusionDisplayPG?: boolean,
    setFusionDisplayPG?: React.Dispatch<React.SetStateAction<boolean>>
    contractPage?: boolean
    forward?: boolean
    //displayContractOnly?: boolean,
    //setDisplayContractOnly?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function FilterComponent({
    nameFilter, setNameFilter,
    raceFilter, setRaceFilter,
    hidePlugins, setHidePlugins,
    displayVariants, setDisplayVariants,
    fusionHideFusionOnly, setFusionHideFusionOnly,
    fusionDisplayPG, setFusionDisplayPG,
    contractPage, forward
    /*, displayContractOnly, setDisplayContractOnly */
}: FilterProps) {
    const races: string[] = [...racesLaw, ...racesNeutral, ...racesChaos]
    const [data, setData] = useState<Data | null>()
    const [filteredDemonList, setFilteredDemonList] = useState<Demon[]>([]);
    if(displayVariants === undefined){
        displayVariants = true
    }

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

        const worker: Worker = new Worker(
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

    return (
        <Stack gap={'lg'} maw={forward ? '25vw' : ''}>
            <Flex justify='center' align={'flex-start'} gap={'xl'} miw={'40%'}>
                <Select
                    w={'10vw'}
                    size={"sm"}
                    label="Filter by Race"
                    placeholder="e.g. Fairy"
                    value={raceFilter}
                    onChange={(value) => { setRaceFilter(value ?? ''); setNameFilter('') }}
                    data={races}
                    clearable
                    searchable />
                <DemonSearchBarComponent forward={forward} demonsList={filteredDemonList} setNameFilter={setNameFilter} raceFilter={raceFilter} />
            </Flex>
            {!contractPage &&
                <Flex justify='center' align={'flex-start'} gap={'xl'} miw={'40vw'}>
                    {setHidePlugins &&
                        <Checkbox
                            miw={'10vw'}
                            checked={hidePlugins}
                            label="Hide plugin demons"
                            onChange={(event) => setHidePlugins(event.currentTarget.checked)} />}
                    {setDisplayVariants &&
                        <Checkbox
                            miw={'10vw'}
                            checked={displayVariants}
                            label="Show variant demons"
                            onChange={(event) => setDisplayVariants(event.currentTarget.checked)} />}
                    {setFusionHideFusionOnly !== undefined && fusionHideFusionOnly !== undefined &&
                        <Checkbox
                            miw={'10vw'}
                            checked={fusionHideFusionOnly}
                            label="Hide fusion-only demons"
                            onChange={(event) => setFusionHideFusionOnly(event.currentTarget.checked)} />}
                    {setFusionDisplayPG !== undefined && fusionDisplayPG !== undefined &&
                        <Checkbox
                            miw={'20vw'}
                            checked={fusionDisplayPG}
                            label="Include only fusions with demons available from PG"
                            onChange={(event) => setFusionDisplayPG(event.currentTarget.checked)}
                            description="* Element fusions ignore this condition" />}
                    {/*setDisplayContractOnly && <Checkbox
        checked={displayContractOnly}
        label="Display only contractable demons"
        onChange={(event) => setDisplayContractOnly(event.currentTarget.checked)}
    />*/}
                </Flex>
            }
        </Stack>
    )
}