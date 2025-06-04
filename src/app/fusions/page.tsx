'use client'
import { useSearchParams } from "next/navigation";
import FusionTableComponent from "../Components/FusionTableComponent";
import { cleanString } from "@/utils/functionUtils";
import demons from '../Data/demons.json'
import demonLocations from '../Data/contract_demons.json'
import variantDemons from '../Data/variant_demons.json'
import DemonInfoComponent from "../Components/DemonInfoComponent";
import ElementInfoComponent from "../Components/ElementInfoComponent";
import DemonContractInfoComponent from "../Components/DemonContractInfoComponent";
import RaceCombinationsComponent from "../Components/RaceCombinationsComponent";
import RaceListComponent from "../Components/RaceListComponent";
import racesData from '../Data/race_combinations.json'
import { Button, Flex, LoadingOverlay, Space, Stack } from "@mantine/core";
import { Suspense } from "react";
import { IconArrowBack } from "@tabler/icons-react";

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

    const demonLoc:DemonLocation = demonLocations.find((d:DemonLocation) => d.Name === demon.Name) as DemonLocation

    let originalDemon = null
    if (demon.Name === 'Amaterasu of Kuyo') {
        originalDemon = demons.find((d: Demon) => d.Name === 'Amaterasu (F)') as Demon
    } else {
        originalDemon = demons.find((d: Demon) => d.Name === cleanString(demon.Name)) as Demon
    }

    return (
        <Flex align='center' justify='center' m={'lg'}>
            <Stack justify="center">
                <Button fullWidth component="a" href="/">
                    <IconArrowBack /><Space w={3} />
                    Back to List
                </Button>
                <DemonInfoComponent demon={demon} />
                <RaceListComponent demon={demon} />
                {(!demon.Special && (demon.Range && typeof(demon.Range[0]) === 'number')) && <RaceCombinationsComponent demon={demon} />}
                {demonLoc && <DemonContractInfoComponent demonLoc={demonLoc}/>}
                {elementCombinations.Elements
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