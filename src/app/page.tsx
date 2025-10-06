'use client'

import React, { useState } from "react";
import DemonTableComponent from "./Components/DemonTableComponent";
import FilterComponent from "./Components/FilterComponent";
import { Flex, Space, Stack } from "@mantine/core";

export default function Home() {
    const [nameFilter, setNameFilter] = useState<string>('')
    const [raceFilter, setRaceFilter] = useState<string>('')
    const [hidePlugins, setHidePlugins] = useState<boolean>(false)
    //const [displayContractOnly, setDisplayContractOnly] = useState<boolean>(false)
    const [displayVariants, setDisplayVariants] = useState<boolean>(false)

    return (
        <Flex align='center' justify='center' m={'lg'}>
            <Stack>
                <FilterComponent
                    nameFilter={nameFilter} setNameFilter={setNameFilter}
                    raceFilter={raceFilter} setRaceFilter={setRaceFilter}
                    hidePlugins={hidePlugins} setHidePlugins={setHidePlugins}
                    displayVariants={displayVariants} setDisplayVariants={setDisplayVariants}
                /* displayContractOnly={displayContractOnly} setDisplayContractOnly={setDisplayContractOnly}*/
                />
                <Space h={'lg'}/>
                <DemonTableComponent nameFilter={nameFilter} raceFilter={raceFilter} hidePlugins={hidePlugins} displayVariants={displayVariants} /*displayContractOnly={displayContractOnly}*/ />
            </Stack>
        </Flex>
    );
}
