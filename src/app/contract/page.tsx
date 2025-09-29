'use client'

import React, { useState } from "react";
import DemonLocationTableComponent from "../Components/DemonLocationTableComponent";
import FilterComponent from "../Components/FilterComponent";
import { Flex, Stack } from "@mantine/core";

export default function Contract() {
    const [nameFilter, setNameFilter] = useState<string>('')
    const [raceFilter, setRaceFilter] = useState<string>('')
    return (
        <Flex align='center' justify='center' m={'lg'}>
            <Stack>
                <FilterComponent nameFilter={nameFilter} setNameFilter={setNameFilter} raceFilter={raceFilter} setRaceFilter={setRaceFilter} contractPage={true} />
                <DemonLocationTableComponent nameFilter={nameFilter} raceFilter={raceFilter} />
            </Stack>
        </Flex>
    )
}