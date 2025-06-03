'use client'
import { useSearchParams } from "next/navigation";
import FusionTableComponent from "../Components/FusionTableComponent";
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

    const subTypes = [
        'Inexperienced ',
        'Illusion ',
        ' of Kuyo',
        'Wanderer ',
        'Accomplished ',
        'Vermillion Flame ',
        'Godly Golden Winged Bird ',
        'Hero of Akaeda ',
        'Unmatched Steel ',
        'Brave Red Capote ',
        'Noble Demon King ',
        'Blasted Road ',
        'Agent of God ',
        'Princess of Pure Madness ',
        'Seven Stars of Death ',
        'Agent of God ',
        'Nimble ',
        'Joyful ',
        'Prideful ',
        'Wrathful ',
        'Lustful ',
        'Magician ',
        'Mystic ',
        'Bringer of Aging ',
        'Pleasure Bringer ',
        'Huntress ',
        'Heaven-Piercing ',
        'Gojo Bridge ',
        ' of Assault',
        'Shana ',
        'Hassou Tobi ',
        'Horse '
    ]

    function cleanString(str: string): string {
        let result = str;
        for (const subtype of subTypes) {
            result = result.replace(subtype, '');
        }
        return result.trim();
    }

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
                {!demon.Special && <RaceCombinationsComponent demon={demon} />}
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