interface Demon {
    Race: string;
    Name: string;
    Level: number;
    Range: (number | null)[] | string[] | null;
    Special: string[][] | null;
    Plugin: boolean[]
    Variant?: boolean
}

interface FusionData {
    Race: string;
    Combinations: string[][] | null;
    Elements: string[] | null
}

interface DemonLocation {
    Race: string
    Name: string
    Zone: string[]
    Location?: (string | null)[]
    Notes?: (string | null)[]
}