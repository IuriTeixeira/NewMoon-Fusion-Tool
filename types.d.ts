interface Demon {
    Race: string;
    Name: string;
    Level: number;
    Range: (number | null)[] | string[] | null;
    Special: string[][] | null;
    Plugin: boolean[]
    Variant?: boolean
    Unfusable?: boolean
}

interface FusionData {
    Race: string;
    Combinations: string[][] | null;
    Elements: string[] | null
}