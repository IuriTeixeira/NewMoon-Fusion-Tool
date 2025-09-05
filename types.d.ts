interface Demon {
    Race: string;
    Name: string;
    Level: number;
    Range: (number | null)[] | string[] | null;
    Special: string[][] | null;
    Plugin: boolean[]
    Variant?: boolean
    AllowVariants?: boolean
    VariantRestrictions?: string[][] | null[[]]
    hasPG?: boolean
}

interface Data {
    demonsList?: Demon[]
    variantDemonsList?: Demon[]
    raceCombinations?: FusionData[]
    contractDemonsList?: DemonLocation[]
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

interface DemonPair {
    demon1: Demon
    demon2: Demon
    demon3?: Demon
}

type FusionCombination = {
    race1: string;
    race2: string;
}