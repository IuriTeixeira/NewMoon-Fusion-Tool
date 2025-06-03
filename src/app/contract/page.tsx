import React from "react";
import DemonLocationTableComponent from "../Components/DemonLocationTableComponent";
import { Flex } from "@mantine/core";

export default function Contract() {
    return (
        <Flex align={"center"} justify={"center"}>
            <DemonLocationTableComponent />
        </Flex>
    )
}