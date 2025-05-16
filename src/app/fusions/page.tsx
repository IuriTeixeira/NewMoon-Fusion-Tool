'use client'
import { useSearchParams } from "next/navigation";
import FusionTableComponent from "../Components/FusionTableComponent";
import demons from '../Data/demons.json'
import DemonInfoComponent from "../Components/DemonInfoComponent";
import { Button, Flex, LoadingOverlay, SimpleGrid } from "@mantine/core";
import { Suspense } from "react";

function FusionsContent() {
    const searchParams = useSearchParams()
    const demonName: string = searchParams.get('demon') as string
    const demon: Demon = demons.find((targetDemon) => targetDemon.Name.toLowerCase() === demonName.toLowerCase()) as Demon

    return (
        <Flex align='center' justify='center'>
            <SimpleGrid cols={1} spacing={'lg'}>
                <Button fullWidth component="a" href="/">
                    Back to List
                </Button>
                <DemonInfoComponent demon={demon} />
                <FusionTableComponent demon={demon} />
            </SimpleGrid>
        </Flex >
    )
}

export default function Fusions(){
    return(
        <Suspense fallback={<LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />}>
            <FusionsContent />
        </Suspense>
    )
}