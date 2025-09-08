import { subTypes } from "./constants";
import { racesLaw, racesNeutral } from '@/utils/constants'

export function cleanString(str: string): string {
    if (str){
        let result = str;
        for (const subtype of subTypes) {
            result = result
                    .replace(subtype, '')                                           //Removes the subtype from the demon name
                    .replace('Asura','Void')                                        //exception for Asura Cerberus
                    .replace('Three-Headed','Void')                                 //exception for Three-Headed Cerberus
                    .replace('Amaterasu of Kuyo','Amaterasu (F)')                   //exception for Amaterasu of Kuyo
                    .replace('Manifestation of Lord Beelzebub','Beelzebub (Human)') //exception for Manifestation of Lord Beelzebub
                    .replace('Proud Lord Beelzebub','Beelzebub (Fly)')              //exception for Proud Lord Beelzebub
        }
        return result.trim();
    }
    return ''
}

export async function loadJSON(path: string) {
    const res = await fetch(path)
    const buffer = await res.arrayBuffer()
    const decoded = new TextDecoder().decode(buffer)
    return JSON.parse(decoded)
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
        const raceRanks: Demon[] = filteredDemonList
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