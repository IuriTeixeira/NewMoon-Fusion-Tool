'use client'
import { Text, Center, Checkbox, Group, Table, LoadingOverlay } from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";
import { loadJSON } from "@/utils/functionUtils";
import { FusionRow } from "./FusionTableRowComponent"

interface FusionProps {
    demon: Demon
}

export default function FusionTableComponent({ demon }: FusionProps) {
    const [data, setData] = useState<{
        demonsList: Demon[]
        variantDemonsList: Demon[]
        raceCombinations: FusionData[]
        contractDemonsList: DemonLocation[]
    } | null>(null)

    const [fusionResults, setFusionResults] = useState<DemonPair[]>([])
    const [fusionDisplayVariants, setFusionDisplayVariants] = useState<boolean>(false)
    const [fusionHidePlugins, setFusionHidePlugins] = useState<boolean>(false)
    const [fusionHideFusionOnly, setFusionHideFusionOnly] = useState<boolean>(false)
    const [fusionDisplayPG, setFusionDisplayPG] = useState<boolean>(false)
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState<string | null>(null)
    const [reverseSort, setReverseSort] = useState<boolean>(false)

    useEffect(() => {
        Promise.all([
            loadJSON('/Data/demons.json'),
            loadJSON('/Data/variant_demons.json'),
            loadJSON('/Data/race_combinations.json'),
            loadJSON('/Data/contract_demons.json'),
        ]).then(([demonsList, variantDemonsList, raceCombinations, contractDemonsList]) => {
            setData({ demonsList, variantDemonsList, raceCombinations, contractDemonsList })
        })

    }, [])

    useEffect(() => {
        if (!data) return;
        setLoading(true);

        const worker = new Worker(new URL('@/app/workers/fusion.worker.ts', import.meta.url), {
            type: 'module',
        });

        worker.onmessage = (e) => {
            setFusionResults(e.data);
            setTimeout(() => setLoading(false), 0);
            worker.terminate();
        };

        worker.postMessage({
            demon,
            data,
            fusionHidePlugins,
            fusionHideFusionOnly,
            fusionDisplayVariants,
            fusionDisplayPG,
        });

        return () => worker.terminate(); // cleanup
    }, [
        demon,
        data,
        fusionHidePlugins,
        fusionHideFusionOnly,
        fusionDisplayVariants,
        fusionDisplayPG,
        sortBy,
        reverseSort
    ]);

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setReverseSort(!reverseSort)
        } else {
            setSortBy(field)
            setReverseSort(false)
        }
    }

    let hasTriFusion: boolean = false

    for (let i = 0; i < fusionResults.length; i++) {
        if (fusionResults[i].demon3) {
            hasTriFusion = true
            break
        }
    }

    const sortedResults = useMemo(() => {
        return [...fusionResults].sort((a, b) => {
            if (!sortBy) return 0

            const getValue = (combo: typeof fusionResults[0]) => {
                switch (sortBy) {
                    case 'demon1Name': return combo.demon1.Name
                    case 'demon1Level': return combo.demon1.Level
                    case 'demon1Race': return combo.demon1.Race
                    case 'demon2Name': return combo.demon2.Name
                    case 'demon2Level': return combo.demon2.Level
                    case 'demon2Race': return combo.demon2.Race
                    default: return ''
                }
            }

            const aVal = getValue(a)
            const bVal = getValue(b)

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return reverseSort ? bVal - aVal : aVal - bVal
            }

            return reverseSort
                ? String(bVal).localeCompare(String(aVal))
                : String(aVal).localeCompare(String(bVal))
        })
    }, [fusionResults, sortBy, reverseSort])

    return (
        <React.Fragment>
            {!demon.Special &&
                <Group align={'flex-start'} justify={'center'} gap={'lg'}>
                    <Checkbox
                        checked={fusionHidePlugins}
                        label="Hide plugin demons"
                        onChange={(event) => setFusionHidePlugins(event.currentTarget.checked)}
                    />
                    <Checkbox
                        checked={fusionDisplayVariants}
                        label="Show variant demons"
                        onChange={(event) => setFusionDisplayVariants(event.currentTarget.checked)}
                    />
                    <Checkbox
                        checked={fusionHideFusionOnly}
                        label="Hide fusion-only demons"
                        onChange={(event) => setFusionHideFusionOnly(event.currentTarget.checked)}
                    />
                    <Checkbox
                        checked={fusionDisplayPG}
                        label="Include only fusions with demons available from PG"
                        onChange={(event) => setFusionDisplayPG(event.currentTarget.checked)}
                        description="* Element fusions ignore this condition"
                    />
                </Group>
            }
            {loading
                ?
                <Text c={'dimmed'}>
                    Calculating...
                </Text>
                :
                fusionResults ?
                    <Text c={'dimmed'}>
                        {fusionResults.length} fusions found.
                    </Text>
                    :
                    <Text>No results found</Text>
            }
            <Table.ScrollContainer minWidth={500}>
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            {demon.Special
                                ?
                                <React.Fragment>
                                    <Table.Th rowSpan={2}><Center>Plugin?</Center></Table.Th>
                                    <Table.Th rowSpan={2}><Center>Allows Variants?</Center></Table.Th>
                                    <Table.Th colSpan={3}><Center>Material 1</Center></Table.Th>
                                    <Table.Th colSpan={3}><Center>Material 2</Center></Table.Th>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Table.Th colSpan={4}><Center>Material 1</Center></Table.Th>
                                    <Table.Th colSpan={4}><Center>Material 2</Center></Table.Th>
                                </React.Fragment>
                            }
                            {hasTriFusion && <Table.Th colSpan={3}><Center>Material 3</Center></Table.Th>}
                        </Table.Tr>
                        <Table.Tr>
                            {!demon.Special ?
                                <Table.Th onClick={() => handleSort('demon1Race')} style={{ cursor: 'pointer' }}>
                                    <Center>Race {sortBy === 'demon1Race' && (reverseSort ? '↓' : '↑')}</Center>
                                </Table.Th>
                                :
                                <Table.Th><Center>Race</Center></Table.Th>
                            }
                            {!demon.Special &&
                                <Table.Th onClick={() => handleSort('demon1Level')} style={{ cursor: 'pointer' }}>
                                    <Center>Lv {sortBy === 'demon1Level' && (reverseSort ? '↓' : '↑')}</Center>
                                </Table.Th>
                            }
                            <Table.Th><Center>Icon</Center></Table.Th>
                            {!demon.Special ?
                                <Table.Th onClick={() => handleSort('demon1Name')} style={{ cursor: 'pointer' }}>
                                    <Center>Name {sortBy === 'demon1Name' && (reverseSort ? '↓' : '↑')}</Center>
                                </Table.Th>
                                :
                                <Table.Th>
                                    <Center>Name</Center>
                                </Table.Th>
                            }
                            <Table.Th onClick={() => handleSort('demon2Race')} style={{ cursor: 'pointer' }}>
                                <Center>Race {sortBy === 'demon2Race' && (reverseSort ? '↓' : '↑')}</Center>
                            </Table.Th>
                            {!demon.Special &&
                                <Table.Th onClick={() => handleSort('demon2Level')} style={{ cursor: 'pointer' }}>
                                    <Center>Lv {sortBy === 'demon2Level' && (reverseSort ? '↓' : '↑')}</Center>
                                </Table.Th>
                            }
                            <Table.Th><Center>Icon</Center></Table.Th>
                            {!demon.Special ?
                                <Table.Th onClick={() => handleSort('demon2Name')} style={{ cursor: 'pointer' }}>
                                    <Center>Name {sortBy === 'demon2Name' && (reverseSort ? '↓' : '↑')}</Center>
                                </Table.Th>
                                :
                                <Table.Th>
                                    <Center>Name</Center>
                                </Table.Th>
                            }
                            {hasTriFusion &&
                                <React.Fragment>
                                    <Table.Th><Center>Race</Center></Table.Th>
                                    <Table.Th><Center>Icon</Center></Table.Th>
                                    <Table.Th><Center>Name</Center></Table.Th>
                                </React.Fragment>}
                        </Table.Tr>
                    </Table.Thead>
                    <React.Fragment>
                        <Table.Tbody>
                            {loading && (
                                <Table.Tr style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                    <Table.Td colSpan={6} style={{ padding: 0 }}>
                                        <LoadingOverlay visible zIndex={1000} overlayProps={{ blur: 2 }} />
                                    </Table.Td>
                                </Table.Tr>
                            )}
                            {fusionResults.length > 0
                                ?
                                sortedResults.map((combo, index) =>
                                    <FusionRow
                                        key={index}
                                        combo={combo}
                                        index={index}
                                        demon={demon}
                                        hasTriFusion={hasTriFusion}
                                    />
                                )
                                :
                                (
                                    <Table.Tr>
                                        <Table.Td colSpan={10}>
                                            <Center>No valid fusions found.</Center>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            }
                        </Table.Tbody>
                    </React.Fragment>
                </Table>
            </Table.ScrollContainer>
        </React.Fragment>
    )
}