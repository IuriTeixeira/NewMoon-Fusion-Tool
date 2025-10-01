'use client'
import { sortTable } from '@/utils/functionUtils';
import { CloseButton, Combobox, ScrollArea, TextInput, useCombobox, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

interface SearchProps {
    demonsList: Demon[],
    raceFilter: string,
    setNameFilter: React.Dispatch<React.SetStateAction<string>>
    forward?: boolean
}

export function DemonSearchBarComponent({ demonsList, raceFilter, setNameFilter, forward }: SearchProps) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState('');
    const shouldFilterOptions:boolean = !demonsList.some((demon: Demon) => demon.Name === value);
    const filteredOptions:Demon[] = shouldFilterOptions
        ? demonsList.filter((demon: Demon) => demon.Name.toLowerCase().includes(value.toLowerCase().trim()))
        : demonsList;

    const sortedOptions:Demon[] = sortTable(filteredOptions)

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
        setValue('')
    }, [raceFilter]);

    useEffect(() => {
        if (value.length >= 3) {
            setNameFilter(value)
        } else {
            setNameFilter('')
        }
    }, [value, setNameFilter]);

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