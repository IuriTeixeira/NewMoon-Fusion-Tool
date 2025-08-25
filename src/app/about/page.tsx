'use client'

import React from "react";
import AboutComponent from "../Components/AboutComponent";
import { Flex } from "@mantine/core";

export default function Contract() {
    return (
        <Flex direction={'column'} align={'center'}>
            <AboutComponent />
        </Flex >
    )
}