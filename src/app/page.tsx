'use client'

import React, { useState } from "react";
import DemonTableComponent from "./Components/DemonTableComponent";
import SearchComponent from "./Components/SearchComponent";
import { Flex, SimpleGrid } from "@mantine/core";

export default function Home() {
    const [raceFilter, setRaceFilter] = useState<string>('')

    return (
        <Flex align='center' justify='center'>
            <SimpleGrid cols={1}>
                <SearchComponent raceFilter={raceFilter} setRaceFilter={setRaceFilter} />
                <DemonTableComponent raceFilter={raceFilter} />
            </SimpleGrid>
        </Flex>
    );
}
