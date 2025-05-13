'use client'
import { useSearchParams } from "next/navigation";
import FusionTableComponent from "../Components/FusionTableComponent";
import demons from '../Data/demons.json'

interface Demon {
    Race: string;
    Name: string;
    Level: number;
    Range: (number | null)[] | string[] | null;
    Special: string[][] | null;
    Plugin: boolean[]
}


export default function Fusions(){
    const searchParams = useSearchParams()
    const demonName:string = searchParams.get('demon') as string
    const demon:Demon = demons.find((targetDemon) => targetDemon.Name.toLowerCase() === demonName.toLowerCase()) as Demon
    
    return (
        <FusionTableComponent demon={demon}/>
    )
}