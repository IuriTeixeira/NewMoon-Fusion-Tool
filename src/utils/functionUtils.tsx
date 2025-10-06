import { subTypes } from "./constants";
import { racesLaw, racesNeutral } from '@/utils/constants'

export function cleanString(str: string): string {
    if (str) {
        let result = str;
        for (const subtype of subTypes) {
            result = result
                .replace(subtype, '')                                           //Removes the subtype from the demon name
                .replace('Asura', 'Void')                                        //exception for Asura Cerberus
                .replace('Three-Headed', 'Void')                                 //exception for Three-Headed Cerberus
                .replace('Amaterasu of Kuyo', 'Amaterasu (F)')                   //exception for Amaterasu of Kuyo
                .replace('Manifestation of Lord Beelzebub', 'Beelzebub (Human)') //exception for Manifestation of Lord Beelzebub
                .replace('Proud Lord Beelzebub', 'Beelzebub (Fly)')              //exception for Proud Lord Beelzebub
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

export function isPGOnly(range: string | number | null) {
    return Array.isArray(range) && range[0] === 'PG Only';
}

export function calculateForwardFusion(
    nameDemon1: string, raceDemon1: string, levelDemon1: string | number,
    nameDemon2: string, raceDemon2: string, levelDemon2: string | number,
    demonsList: Demon[], allDemons: Demon[],
    raceCombinations: FusionData[],
    result: Demon | undefined,
) {
    if (raceDemon1 === raceDemon2) {
        if (raceDemon1 === 'Element') {
            const mitamas = [
                demonsList.find(d => d.Name === 'Ara Mitama'),
                demonsList.find(d => d.Name === 'Nigi Mitama'),
                demonsList.find(d => d.Name === 'Kusi Mitama'),
                demonsList.find(d => d.Name === 'Saki Mitama')
            ];
            mitamas.forEach(mitama => {
                mitama?.Special?.forEach(combo => {
                    if (
                        nameDemon1 === combo[0] && nameDemon2 === combo[1]
                        ||
                        nameDemon1 === combo[1] && nameDemon2 === combo[0]
                    ) {
                        result = mitama
                    }
                }
                )
            })
            return result
        } else {
            const elements = [
                demonsList.find(d => d.Name === 'Erthys'),
                demonsList.find(d => d.Name === 'Aeros'),
                demonsList.find(d => d.Name === 'Aquans'),
                demonsList.find(d => d.Name === 'Flamies')
            ];
            elements.forEach(element => {
                element?.Special?.forEach(combo => {
                    if (combo.includes(raceDemon1) || combo.includes(raceDemon2)) {
                        result = element
                    }
                }
                )
            })
            return result
        }
    } else {
        if (raceDemon1 === 'Sacred Soul' || raceDemon2 === 'Sacred Soul') {
            const nonMitama: string = raceDemon1 === 'Sacred Soul' ? nameDemon2 : nameDemon1
            return allDemons.find((d: Demon) => d.Name === nonMitama) as Demon
        }
        if (raceDemon1 === 'Element' || raceDemon2 === 'Element') {
            const elements: string[] = ["Erthys", "Aeros", "Aquans", "Flamies"]
            const elementName: string = elements.includes(nameDemon1) ? nameDemon1 : nameDemon2
            const nonElementName: string = nameDemon1 !== elementName ? nameDemon1 : nameDemon2
            const elementType: number = elements.findIndex((element: string) => element === elementName)
            const nonElementRace: string = raceDemon1 !== 'Element' ? raceDemon1 : raceDemon2
            const resultComboData: FusionData = raceCombinations.find((combo: FusionData) => combo.Race === nonElementRace) as FusionData

            const raceRanks: Demon[] = demonsList
                .filter((d: Demon) => d.Race === nonElementRace && !d.Variant && !d.Special && d.Range && d.Range[0] !== 'PG Only');

            const nonElementRank: number = raceRanks.findIndex(d => d.Name === nonElementName);
            if (resultComboData.Elements) {
                let upOrDown: string = 'Down'
                if (resultComboData.Elements[elementType] === 'Down') {
                    upOrDown = 'Down'
                } else {
                    upOrDown = 'Up'
                }
                const nextDemon = upOrDown === 'Down' ? raceRanks[nonElementRank - 1] : raceRanks[nonElementRank + 1]
                if (nextDemon) {
                    if ((nextDemon.Range && isPGOnly(nextDemon.Range[0])) || nextDemon.Special !== null) {
                        for (let j = 2; j < raceRanks.length - nonElementRank; j++) {
                            const next = upOrDown === 'Down' ? raceRanks[nonElementRank - j] : raceRanks[nonElementRank + j];
                            if (
                                !next ||
                                next.Special === null &&
                                Array.isArray(next.Range) &&
                                next.Range[0] !== 'PG Only'
                            ) {
                                break;
                            }
                        }
                    } else {
                        return nextDemon
                    }
                }
            }


        } else {
            if (raceDemon1 === undefined || raceDemon2 === undefined || nameDemon1 === undefined || nameDemon2 === undefined) {
                return result
            }
            const normalize = (s: string) => s.trim().toLowerCase()

            const resultComboData = raceCombinations.find(
                (combo: FusionData) =>
                    combo.Combinations?.some(
                        (combination: string[]) =>
                            (normalize(combination[0]) === normalize(raceDemon1) &&
                                normalize(combination[1]) === normalize(raceDemon2)) ||
                            (normalize(combination[0]) === normalize(raceDemon2) &&
                                normalize(combination[1]) === normalize(raceDemon1))
                    )
            ) as FusionData | undefined

            if (!resultComboData) return undefined

            const resultRace: Demon[] = demonsList.filter((d: Demon) => d.Race === resultComboData.Race)

            const numLevelDemon1 = typeof levelDemon1 === 'string' ? parseInt(levelDemon1) : levelDemon1
            const numLevelDemon2 = typeof levelDemon2 === 'string' ? parseInt(levelDemon2) : levelDemon2
            const resultTargetRange = numLevelDemon1 + numLevelDemon2

            const fusionResult = resultRace.find((demon: Demon) => {
                if (demon.Range && typeof demon.Range[0] === 'number') {
                    if (typeof demon.Range[1] !== 'number') demon.Range[1] = 999
                    const [minValue, maxValue] = demon.Range as [number, number]
                    return resultTargetRange >= minValue && resultTargetRange <= maxValue
                }
                return false
            })

            return fusionResult

        }
    }

}