'use client'
import { Image, Anchor, Center, Checkbox, Group, Table, LoadingOverlay } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IconCheck, IconX } from "@tabler/icons-react";
import { cleanString, loadJSON } from "@/utils/functionUtils";

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
    ]);


    let hasTriFusion: boolean = false

    for (let i = 0; i < fusionResults.length; i++) {
        if (fusionResults[i].demon3) {
            hasTriFusion = true
            break
        }
    }

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
                            <Table.Th><Center>Race</Center></Table.Th>
                            {!demon.Special && <Table.Th><Center>Lv</Center></Table.Th>}
                            <Table.Th><Center>Icon</Center></Table.Th>
                            <Table.Th><Center>Name</Center></Table.Th>
                            <Table.Th><Center>Race</Center></Table.Th>
                            {!demon.Special && <Table.Th><Center>Lv</Center></Table.Th>}
                            <Table.Th><Center>Icon</Center></Table.Th>
                            <Table.Th><Center>Name</Center></Table.Th>
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
                                fusionResults.map((combo, index) => {
                                    const demon1Icon: string = cleanString(combo.demon1.Name)
                                    const demon2Icon: string = cleanString(combo.demon2.Name)
                                    const demon3Icon: string = combo.demon3 ? cleanString(combo.demon3.Name) : '-'
                                    return (demon.Special && demon.Race !== 'Element') ?
                                        <Table.Tr key={index}>
                                            <Table.Td key={`plugin-${combo.demon2.Race} -${index}`}>
                                                <Center>{demon.Plugin[index] ? <IconCheck size={16} /> : <IconX size={16} />}</Center>
                                            </Table.Td>
                                            <Table.Td key={`variant-${combo.demon2.Race} -${index}`}>
                                                <Center>{demon.AllowVariants !== false ? <IconCheck size={16} /> : <IconX size={16} />}</Center>
                                            </Table.Td>
                                            {combo.demon1 &&
                                                <React.Fragment key={`demon1-${index}`}>
                                                    <Table.Td key={`race-${combo.demon1.Race} -${index}`}>{combo.demon1.Race}</Table.Td>
                                                    <Table.Td key={`icon-${combo.demon1.Race} -${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon1Icon}.png`} alt={combo.demon1.Name} w={32} h={32} /></Center></Table.Td>
                                                    <Table.Td key={`name-${combo.demon1.Race} -${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor><br key={`name-variant-estriction-${combo.demon1.Race} -${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][0] ? '* ' + demon.VariantRestrictions[index][0] : ''}</Table.Td>
                                                </React.Fragment>
                                            }
                                            {combo.demon2 &&
                                                <React.Fragment key={`demon2-${index}`}>
                                                    <Table.Td key={`race-${combo.demon2.Race} -${index}`}>{combo.demon2.Race}</Table.Td>
                                                    <Table.Td key={`icon-${combo.demon2.Race} -${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon2Icon}.png`} alt={combo.demon2.Name} w={32} h={32} /></Center></Table.Td>
                                                    <Table.Td key={`name-${combo.demon2.Race} -${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor><br key={`name-variant-estriction-${combo.demon2.Race} -${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][1] ? '* ' + demon.VariantRestrictions[index][1] : ''}</Table.Td>
                                                </React.Fragment>
                                            }
                                            {combo.demon3 ?
                                                <React.Fragment key={`demon3-${index}`}>
                                                    <Table.Td key={`race-${combo.demon3.Race} -${index}`}>{combo.demon3?.Race}</Table.Td>
                                                    <Table.Td key={`icon-${combo.demon3.Race} -${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon3Icon}.png`} alt={combo.demon3?.Name} w={32} h={32} /></Center></Table.Td>
                                                    <Table.Td key={`name-${combo.demon3.Race} -${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon3?.Name } }}>{combo.demon3?.Name}</Anchor><br key={`name-variant-estriction-${combo.demon3.Race} -${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][2] ? '* ' + demon.VariantRestrictions[index][2] : ''}</Table.Td>
                                                </React.Fragment>
                                                :
                                                hasTriFusion && <React.Fragment key={`demon3-${index}`}>
                                                    <Table.Td key={`race-demon3-${index}`}><Center key={`race-demon3-center-${index}`}>-</Center></Table.Td>
                                                    <Table.Td key={`icon-demon3-${index}`}><Center key={`icon-demon3-center-${index}`}>-</Center></Table.Td>
                                                    <Table.Td key={`name-demon3-${index}`}><Center key={`name-demon3-center-${index}`}>-</Center></Table.Td>
                                                </React.Fragment>
                                            }
                                        </Table.Tr>
                                        :
                                        <Table.Tr key={index}>
                                            <Table.Td key={`race-${combo.demon1.Name} -${index}`}>{combo.demon1.Race}</Table.Td>
                                            <Table.Td key={`level-${combo.demon1.Name} -${index} -`}>{combo.demon1.Level}</Table.Td>
                                            <Table.Td key={`icon-${combo.demon1.Name} -${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon1Icon}.png`} alt={combo.demon1.Name} w={32} h={32} /></Center></Table.Td>
                                            <Table.Td key={`name-${combo.demon1.Name} -${index} -`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor></Table.Td>
                                            <Table.Td key={`race-${combo.demon2.Name} -${index}`}>{combo.demon2.Race}</Table.Td>
                                            <Table.Td key={`level-${combo.demon2.Name} -${index}`}>{combo.demon2.Level}</Table.Td>
                                            <Table.Td key={`icon-${combo.demon2.Name} -${index}`}><Center><Image fallbackSrc='/Blank.png' src={`/Icons/${demon2Icon}.png`} alt={combo.demon2.Name} w={32} h={32} /></Center></Table.Td>
                                            <Table.Td key={`name-${combo.demon2.Name} -${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor></Table.Td>
                                        </Table.Tr>
                                })
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