'use client'

import React, { useState } from "react";
import DemonLocationTableComponent from "../Components/DemonLocationTableComponent";
import FilterComponent from "../Components/FilterComponent";
import { Flex, Stack } from "@mantine/core";

export default function Contract() {
    const [raceFilter, setRaceFilter] = useState<string>('')
    return (
        <Flex align='center' justify='center' m={'lg'}>
            <Stack>
                <FilterComponent raceFilter={raceFilter} setRaceFilter={setRaceFilter} />
                <DemonLocationTableComponent raceFilter={raceFilter} />
            </Stack>
        </Flex>
    )
}