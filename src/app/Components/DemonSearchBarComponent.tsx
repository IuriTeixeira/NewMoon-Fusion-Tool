'use client'
import { sortTable } from '@/utils/functionUtils';
import { CloseButton, Combobox, ScrollArea, TextInput, useCombobox, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

interface SearchProps {
    demonsList: Demon[],
    raceFilter: string,
    setNameFilter: React.Dispatch<React.SetStateAction<string>>,
    altNames?: AltName[]
    forward?: boolean
}

export function DemonSearchBarComponent({ demonsList, raceFilter, setNameFilter, altNames, forward }: SearchProps) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState('');
    const filteredOptions: Demon[] = demonsList.filter((demon) => {
        const lowerDemon = demon.Name.toLowerCase();
        const lowerSearch = value.toLowerCase().trim();

        // Direct match
        if (lowerDemon.includes(lowerSearch)) return true;

        // Match by any altName that maps to this demon.Name
        if (altNames) {
            const matchingAlts = altNames.filter(
                (altName) =>
                    altName.Type === 'Demon' &&
                    altName.Alt.toLowerCase().includes(lowerSearch) &&
                    altName.Name.toLowerCase() === lowerDemon
            );
            return matchingAlts.length > 0;
        }

        return false;
    });

    const sortedOptions: Demon[] = sortTable(filteredOptions)

    const options = sortedOptions.map((demon: Demon) => (
        <Combobox.Option value={demon.Name} key={`${demon.Name}-${demon.Level}`}>
            <div>
                <Text fz="sm" fw={500}>
                    {demon.Name}
                </Text>
                <Text fz="xs" opacity={0.6}>
                    {demon.Race}
                </Text>
            </div>
        </Combobox.Option>
    ));

    useEffect(() => {
        if (!forward || (forward && !raceFilter)) setValue('')
    }, [raceFilter, forward]);

    useEffect(() => {
        if (value.length >= 3) {
            setNameFilter(value)
        } else {
            setNameFilter('')
        }
    }, [value, filteredOptions, setNameFilter]);

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
                <TextInput
                    w={forward ? '15vw' : '30vw'}
                    label="Search by Name"
                    placeholder={'e.g. Jack Frost'}
                    value={value}
                    onChange={(event) => {
                        setValue(event.currentTarget.value);
                        combobox.openDropdown();
                    }}
                    onSubmit={(event) => {
                        setValue(event.currentTarget.value);
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    rightSection={
                        value !== '' && (
                            <CloseButton
                                size="sm"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => setValue('')}
                                aria-label="Clear value"
                            />
                        )
                    }
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>
                    <ScrollArea.Autosize mah={200} type="scroll">
                        {options.length === 0 ? <Combobox.Empty>No demons found.</Combobox.Empty> : options}
                    </ScrollArea.Autosize>
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}