'use client'

import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react'
import clsx from 'clsx'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

type CustomComboboxProps<T> = {
    data: T[]
    valueKey?: keyof T
    displayKey?: keyof T
    defaultValue?: T | null
    onSelect?: (value: T) => void
    placeholder?: string
}

export default function CustomCombobox<T extends string | Record<string, any>>({
    data,
    valueKey,
    displayKey,
    defaultValue = null,
    onSelect,
    placeholder = '',
}: CustomComboboxProps<T>) {
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<T | null>(defaultValue)

    const getDisplayValue = (item: T): string => {
        if (typeof item === 'string') return item
        if (displayKey) return String(item[displayKey])
        return ''
    }

    const getValueKey = (item: T): string => {
        if (typeof item === 'string') return item
        if (valueKey) return String(item[valueKey])
        return getDisplayValue(item)
    }

    const filteredData =
        query === ''
            ? data
            : data.filter((item) =>
                getDisplayValue(item).toLowerCase().includes(query.toLowerCase())
            )

    const handleChange = (value: T) => {
        setSelected(value)
        onSelect?.(value)
    }

    return (
        <div className="relative w-full">
            <Combobox value={selected} onChange={handleChange} onClose={() => setQuery('')}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-black',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                        )}
                        displayValue={(item: T | null) => (item ? getDisplayValue(item) : '')}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                    )}
                >
                    {filteredData.map((item, index) => (
                        <ComboboxOption
                            key={getValueKey(item) + index}
                            value={item}
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                            <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                            <div className="text-sm/6 text-black">{getDisplayValue(item)}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    )
}
