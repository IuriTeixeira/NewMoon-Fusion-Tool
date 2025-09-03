'use client'

import React, { useState } from "react";
import DemonTableComponent from "./Components/DemonTableComponent";
import FilterComponent from "./Components/FilterComponent";
import { Flex, Stack } from "@mantine/core";

export default function Home() {
    const [raceFilter, setRaceFilter] = useState<string>('')
    const [hidePlugins, setHidePlugins] = useState<boolean>(false)
    //const [displayContractOnly, setDisplayContractOnly] = useState<boolean>(false)
    const [displayVariants, setDisplayVariants] = useState<boolean>(false)

    return (
        <Flex align='center' justify='center' m={'lg'}>
            <Stack>
                <FilterComponent raceFilter={raceFilter} setRaceFilter={setRaceFilter} hidePlugins={hidePlugins} setHidePlugins={setHidePlugins} displayVariants={displayVariants} setDisplayVariants={setDisplayVariants}/* displayContractOnly={displayContractOnly} setDisplayContractOnly={setDisplayContractOnly}*/ />
                <DemonTableComponent raceFilter={raceFilter} hidePlugins={hidePlugins} displayVariants={displayVariants} /*displayContractOnly={displayContractOnly}*/ />
            </Stack>
        </Flex>
    );
}
