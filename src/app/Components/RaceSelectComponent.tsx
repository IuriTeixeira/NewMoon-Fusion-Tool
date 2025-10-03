'use client'
import { CloseButton, Combobox, ScrollArea, useCombobox, InputBase, Input, Box, Group } from '@mantine/core';
import { useEffect, useState } from 'react';

interface SearchProps {
    nameFilter?: string
    raceFilter?: string
    setRaceFilter: React.Dispatch<React.SetStateAction<string>>,
    races: string[],
    altNames?: AltName[]
}

export default function RaceSelectComponent({ setRaceFilter, races, altNames }: SearchProps) {
    const [search, setSearch] = useState('');
    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption();
            combobox.focusTarget();
            setSearch('');
        },

        onDropdownOpen: () => {
            combobox.focusSearchInput();
        },
    });

    const [value, setValue] = useState('');
    const filteredOptions: string[] = races.filter((race) => {
        const lowerRace = race.toLowerCase();
        const lowerSearch = search.toLowerCase().trim();

        // Direct match
        if (lowerRace.includes(lowerSearch)) return true;

        // Match by any altName that maps to this race
        if (altNames) {
            const matchingAlts = altNames.filter(
                (altName) =>
                    altName.Type === 'Race' &&
                    altName.Alt.toLowerCase().includes(lowerSearch) &&
                    altName.Name.toLowerCase() === lowerRace
            );
            return matchingAlts.length > 0;
        }

        return false;
    });


    const options: React.JSX.Element[] = filteredOptions.map((item) => (
        <Combobox.Option value={item} key={item}>
            {item}
        </Combobox.Option>
    ));

    useEffect(() => {
        setRaceFilter(value)
    }, [value, setRaceFilter])

    return (
        <Combobox
            onOptionSubmit={(optionValue) => {
                setValue(optionValue);
                combobox.closeDropdown();
            }}
            store={combobox}
            withinPortal={true}
            zIndex={2000}
        >
            <Combobox.Target>
                <Box>
                    <Group gap={4} align="end">
                        <InputBase
                            w={'10vw'}
                            label="Search by Race"
                            component="button"
                            type="button"
                            pointer
                            rightSection={
                                value !== '' ? (
                                    <CloseButton
                                        size="sm"
                                        onMouseDown={(event) => event.preventDefault()}
                                        onClick={() => setValue('')}
                                        aria-label="Clear value"
                                    />
                                ) : (
                                    <Combobox.Chevron />
                                )
                            }
                            onClick={() => combobox.openDropdown()}
                            rightSectionPointerEvents={value === null ? 'none' : 'all'}
                        >
                            {value || <Input.Placeholder>Select Race</Input.Placeholder>}
                        </InputBase>

                    </Group>
                </Box>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Search
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="e.g. Fairy"
                />
                <Combobox.Options>
                    <ScrollArea.Autosize mah={200} type="scroll">
                        {options.length === 0 ? <Combobox.Empty>No races found.</Combobox.Empty> : options}
                    </ScrollArea.Autosize>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}