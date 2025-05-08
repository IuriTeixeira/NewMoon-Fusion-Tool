'use client'

import React, { useState } from "react";
import DemonTableComponent from "./Components/DemonTableComponent";
import SearchComponent from "./Components/SearchComponent";
import { Flex, SimpleGrid } from "@mantine/core";

export default function Home() {
    const [filter, setFilter] = useState<string>('')
    const [demon, setDemon] = useState<string>('')

    return (
        <Flex align='center' justify='center'>
            <SimpleGrid cols={1} w='80%'>
                <SearchComponent setFilter={setFilter} setDemon={setDemon} />
                <DemonTableComponent filter={filter} />
            </SimpleGrid>
        </Flex>
    );
}
