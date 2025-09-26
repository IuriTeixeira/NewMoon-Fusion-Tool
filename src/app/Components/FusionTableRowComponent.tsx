import { cleanString } from '@/utils/functionUtils';
import { Table, Center, Anchor, Image } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

interface FusionRowProps {
    combo: DemonPair,
    index: number,
    demon: Demon,
    hasTriFusion: boolean
}


export const FusionRow = React.memo(function FusionRow({ combo, index, demon, hasTriFusion }: FusionRowProps) {
    const demon1Icon = cleanString(combo.demon1.Name);
    const demon2Icon = cleanString(combo.demon2.Name);
    const demon3Icon = combo.demon3 ? cleanString(combo.demon3.Name) : '-';

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
                    <Table.Td key={`icon-${combo.demon1.Race} -${index}`}><Center><Image loading="lazy" fallbackSrc='/Blank.png' src={`/Icons/${demon1Icon}.png`} alt={combo.demon1.Name} w={32} h={32} /></Center></Table.Td>
                    <Table.Td key={`name-${combo.demon1.Race} -${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor><br key={`name-variant-estriction-${combo.demon1.Race} -${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][0] ? '* ' + demon.VariantRestrictions[index][0] : ''}</Table.Td>
                </React.Fragment>
            }
            {combo.demon2 &&
                <React.Fragment key={`demon2-${index}`}>
                    <Table.Td key={`race-${combo.demon2.Race} -${index}`}>{combo.demon2.Race}</Table.Td>
                    <Table.Td key={`icon-${combo.demon2.Race} -${index}`}><Center><Image loading="lazy" fallbackSrc='/Blank.png' src={`/Icons/${demon2Icon}.png`} alt={combo.demon2.Name} w={32} h={32} /></Center></Table.Td>
                    <Table.Td key={`name-${combo.demon2.Race} -${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor><br key={`name-variant-estriction-${combo.demon2.Race} -${index}`} />{demon.VariantRestrictions && demon.VariantRestrictions[index][1] ? '* ' + demon.VariantRestrictions[index][1] : ''}</Table.Td>
                </React.Fragment>
            }
            {combo.demon3 ?
                <React.Fragment key={`demon3-${index}`}>
                    <Table.Td key={`race-${combo.demon3.Race} -${index}`}>{combo.demon3?.Race}</Table.Td>
                    <Table.Td key={`icon-${combo.demon3.Race} -${index}`}><Center><Image loading="lazy" fallbackSrc='/Blank.png' src={`/Icons/${demon3Icon}.png`} alt={combo.demon3?.Name} w={32} h={32} /></Center></Table.Td>
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
            <Table.Td key={`icon-${combo.demon1.Name} -${index}`}><Center><Image loading="lazy" fallbackSrc='/Blank.png' src={`/Icons/${demon1Icon}.png`} alt={combo.demon1.Name} w={32} h={32} /></Center></Table.Td>
            <Table.Td key={`name-${combo.demon1.Name} -${index} -`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon1.Name } }}>{combo.demon1.Name}</Anchor></Table.Td>
            <Table.Td key={`race-${combo.demon2.Name} -${index}`}>{combo.demon2.Race}</Table.Td>
            <Table.Td key={`level-${combo.demon2.Name} -${index}`}>{combo.demon2.Level}</Table.Td>
            <Table.Td key={`icon-${combo.demon2.Name} -${index}`}><Center><Image loading="lazy" fallbackSrc='/Blank.png' src={`/Icons/${demon2Icon}.png`} alt={combo.demon2.Name} w={32} h={32} /></Center></Table.Td>
            <Table.Td key={`name-${combo.demon2.Name} -${index}`}><Anchor component={Link} href={{ pathname: '/fusions', query: { demon: combo.demon2.Name } }}>{combo.demon2.Name}</Anchor></Table.Td>
        </Table.Tr>
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.combo) === JSON.stringify(nextProps.combo)
});