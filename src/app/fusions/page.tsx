'use client'
import { useSearchParams } from "next/navigation";
import FusionTableComponent from "../Components/FusionTableComponent";
import demons from '../Data/demons.json'
import DemonInfoComponent from "../Components/DemonInfoComponent";
import { Flex, SimpleGrid } from "@mantine/core";

export default function Fusions() {
    const searchParams = useSearchParams()
    const demonName: string = searchParams.get('demon') as string
    const demon: Demon = demons.find((targetDemon) => targetDemon.Name.toLowerCase() === demonName.toLowerCase()) as Demon

    return (
        <Flex align='center' justify='center'>
            <SimpleGrid cols={1} w='80%'>
                <DemonInfoComponent demon={demon} />
                <FusionTableComponent demon={demon} />
            </SimpleGrid>
        </Flex >
    )
}