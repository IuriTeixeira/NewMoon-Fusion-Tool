import { subTypes } from "./constants";
import { racesLaw, racesNeutral } from '@/utils/constants'
import demonList from "@/app/Data/demons.json"

export function cleanString(str: string): string {
    let result = str;
    for (const subtype of subTypes) {
        result = result.replace(subtype, '');
    }
    return result.trim();
}

export function sortTable(filteredDemonList: Demon[]): Demon[] {
    return [...filteredDemonList].sort((a, b) => {
        // 1st: Sort by alignment priority (Law > Neutral > Chaos)
        const aAlignment =
            racesLaw.includes(a.Race) ? 0 :
                racesNeutral.includes(a.Race) ? 1 : 2;
        const bAlignment =
            racesLaw.includes(b.Race) ? 0 :
                racesNeutral.includes(b.Race) ? 1 : 2;

        if (aAlignment !== bAlignment) {
            return aAlignment - bAlignment;
        }

        // 2nd: If same alignment, sort by Race (A-Z)
        if (a.Race < b.Race) return -1;
        if (a.Race > b.Race) return 1;

        // 3rd: if same Race, sort by Race Rank
        const raceRanks: Demon[] = demonList
            .filter((d: Demon) => d.Race === a.Race)
            .map((d: Demon) => d);

        const aBaseName: string = cleanString(a.Name)
        const bBaseName: string = cleanString(b.Name)

        const aRank: number = raceRanks.findIndex((d: Demon) => d.Name === aBaseName)
        const bRank: number = raceRanks.findIndex((d: Demon) => d.Name === bBaseName)

        if (aRank < bRank) return -1;
        if (aRank > bRank) return 1;

        // 4th: if same Rank, sort by base Name

        if (aBaseName < bBaseName) return -1;
        if (aBaseName > bBaseName) return 1;

        // 4th: If same base Name, sort by Level (ascending)
        if (a.Level < b.Level) return -1;
        if (a.Level > b.Level) return 1;

        // 5th: If same Level, sort by Name (A-Z)
        return a.Name.localeCompare(b.Name);
    });
}