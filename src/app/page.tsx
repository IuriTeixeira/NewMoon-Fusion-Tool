'use client'

import React, { useState } from "react";
import DemonTableComponent from "./Components/DemonTableComponent";
import FilterComponent from "./Components/FilterComponent";
import { Flex, SimpleGrid } from "@mantine/core";

export default function Home() {
    const [raceFilter, setRaceFilter] = useState<string>('')
    const [hidePlugins, setHidePlugins] = useState<boolean>(false)
    const [displayVariants, setDisplayVariants] = useState<boolean>(false)

    return (
        <Flex align='center' justify='center'>
            <SimpleGrid cols={1}>
                <FilterComponent raceFilter={raceFilter} setRaceFilter={setRaceFilter} hidePlugins={hidePlugins} setHidePlugins={setHidePlugins} displayVariants={displayVariants} setDisplayVariants={setDisplayVariants} />
                <DemonTableComponent raceFilter={raceFilter} hidePlugins={hidePlugins} displayVariants={displayVariants} />
            </SimpleGrid>
        </Flex>
    );
}
