'use client'
import { Flex, Table, Image, Center, Anchor, Text } from "@mantine/core";
import { cleanString } from "@/utils/functionUtils"
import { raceGems } from "@/utils/constants";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface DemonInfoProps {
    demon: Demon | undefined
}

function DemonInfoComponentInner({ demon }: DemonInfoProps) {
    if (!demon) {
        demon = {
            Race: '-',
            Level: 0,
            Name: 'Demon not found',
            Range: ['-'],
            Special: null,
            Plugin: [false]
        }
        raceGems[demon.Race] = '-'
    }

    const imageName: string = cleanString(demon.Name)

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const targetPath = "/fusions";
    const targetDemon = demon.Name;

    const isActive =
        pathname === targetPath && searchParams.get("demon") === targetDemon;

    return (
        <Center maw={'85vw'}>
            <Table align={'center'} variant="vertical" withTableBorder withColumnBorders miw={'25vw'}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th colSpan={4}>
                            <Flex align={'center'} justify={'center'} gap={'sm'}>
                                <Image fallbackSrc='/Blank.png' src={`/Icons/${imageName}.png`} alt={demon.Name} title={demon.Name} w={32} h={32} />
                                {isActive || demon.Race === '-'
                                    ?
                                    <Text fw={700}>{demon.Name}</Text>
                                    :
                                    <Anchor component={Link} href={{ pathname: targetPath, query: { demon: targetDemon } }}>
                                        {demon.Name}
                                    </Anchor>
                                }
                            </Flex>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead >
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th w={150}><Center>Race</Center></Table.Th>
                        <Table.Td><Center>{demon.Race}</Center></Table.Td>
                        <Table.Th w={150}><Center>Base Level</Center></Table.Th>
                        <Table.Td><Center>{demon.Level}</Center></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Th w={150}><Center>Synthesis Gem</Center></Table.Th>
                        <Table.Td>
                            <Center>
                                {raceGems[demon.Race]}
                            </Center>
                        </Table.Td>
                        <Table.Th w={150}><Center>Fusion Range</Center></Table.Th>
                        <Table.Td>
                            <Center>
                                {demon.Range
                                    ?
                                    `${demon.Range[0]}${demon.Range[1]
                                        ?
                                        ` - ${demon.Range[1]}`
                                        :
                                        typeof (demon.Range[0]) === "number" ? '+' : ''}`
                                    :
                                    'Special Fusion'}
                            </Center>
                        </Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </Center>
    )
}

export default function DemonInfoComponent({ demon }: DemonInfoProps) {
    return (
        <Suspense>
            <DemonInfoComponentInner demon={demon} />
        </Suspense>
    );
}