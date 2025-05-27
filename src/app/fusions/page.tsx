'use client'
import { useSearchParams } from "next/navigation";
import FusionTableComponent from "../Components/FusionTableComponent";
import demons from '../Data/demons.json'
import variantDemons from '../Data/variant_demons.json'
import DemonInfoComponent from "../Components/DemonInfoComponent";
import ElementInfoComponent from "../Components/ElementInfoComponent";
import RaceCombinationsComponent from "../Components/RaceCombinationsComponent";
import RaceListComponent from "../Components/RaceListComponent";
import racesData from '../Data/race_combinations.json'
import { Button, Flex, LoadingOverlay, Stack } from "@mantine/core";
import { Suspense } from "react";

function FusionsContent() {
    const searchParams = useSearchParams()
    const demonName: string = searchParams.get('demon') as string
    const findDemon: Demon = demons.find((targetDemon) => targetDemon.Name.toLowerCase() === demonName.toLowerCase()) as Demon
    let demon: Demon
    if (findDemon) {
        demon = findDemon
    } else {
        demon = variantDemons.find((targetDemon) => targetDemon.Name.toLowerCase() === demonName.toLowerCase()) as Demon
    }

    const elementCombinations: FusionData = racesData.find((targetRace) => targetRace.Race === demon.Race) as FusionData

    return (
        <Flex align='center' justify='center' m={'lg'}>
            <Stack justify="center">
                <Button fullWidth component="a" href="/">
                    Back to List
                </Button>
                <DemonInfoComponent demon={demon} />
                <RaceListComponent demon={demon} />
                {!demon.Special && <RaceCombinationsComponent demon={demon} />}
                {elementCombinations.Elements && <ElementInfoComponent elements={elementCombinations.Elements!} />}
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