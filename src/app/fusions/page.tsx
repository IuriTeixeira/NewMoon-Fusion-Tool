'use client'
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FusionTableComponent from "../Components/FusionTableComponent";
import { cleanString, loadJSON } from "@/utils/functionUtils";
import { Button, Flex, LoadingOverlay, Space, Stack } from "@mantine/core";
import { Suspense } from "react";
import { IconArrowBack } from "@tabler/icons-react";
import DemonInfoComponent from "../Components/DemonInfoComponent";
import RaceListComponent from "../Components/RaceListComponent";
import RaceCombinationsComponent from "../Components/RaceCombinationsComponent";
import DemonContractInfoComponent from "../Components/DemonContractInfoComponent";
import ElementInfoComponent from "../Components/ElementInfoComponent";

function FusionsContent() {
    const searchParams = useSearchParams()

    const [data, setData] = useState<Data | null>(null)

    useEffect(() => {
        Promise.all([
            loadJSON('/Data/demons.json'),
            loadJSON('/Data/variant_demons.json'),
            loadJSON('/Data/race_combinations.json'),
            loadJSON('/Data/contract_demons.json'),
        ]).then(([demonsList, variantDemonsList, raceCombinations, contractDemonsList]) => {
            setData({ demonsList, variantDemonsList, raceCombinations, contractDemonsList })
        })
    }, [])

    if (!data) return

    const demonName: string = searchParams.get('demon') as string
    let demon: Demon = data.demonsList?.find((targetDemon) => targetDemon.Name.toLowerCase() === demonName.toLowerCase()) as Demon
    if (!demon) {
        demon = data.variantDemonsList?.find((targetDemon) => targetDemon.Name.toLowerCase() === demonName.toLowerCase()) as Demon
    }

    const elementCombinations: FusionData = data.raceCombinations?.find((targetRace) => targetRace.Race === demon.Race) as FusionData

    const demonLoc: DemonLocation = data.contractDemonsList?.find((d: DemonLocation) => d.Name === demon.Name) as DemonLocation

    const originalDemon: Demon = data.demonsList?.find((d: Demon) => d.Name === cleanString(demon.Name)) as Demon


    return (
        <Flex align='center' justify='center' m={'lg'}>
            <Stack justify="center">
                <Button fullWidth component="a" href="/">
                    <IconArrowBack /><Space w={3} />
                    Back to List
                </Button>
                <DemonInfoComponent demon={demon} />
                <RaceListComponent demon={demon} />
                {
                    (
                        (!demon.Special && (demon.Range && typeof (demon.Range[0]) === 'number'))
                        ||
                        demon.Race === 'Element'
                    )
                    &&
                    <RaceCombinationsComponent demon={demon} />
                }
                {demonLoc && <DemonContractInfoComponent demonLoc={demonLoc} />}
                {elementCombinations && elementCombinations.Elements
                    &&
                    (
                        !demon.Special
                        ||
                        !originalDemon.Special
                    )
                    &&
                    <ElementInfoComponent elements={elementCombinations.Elements!} />}
                <FusionTableComponent demon={demon} />
            </Stack>
        </Flex >
    )
}

export default function Fusions() {
    return (
        <Suspense fallback={<LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}>
            <FusionsContent />
        </Suspense>
    )
}