"use client"

import React, { useEffect } from "react"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { Input } from "@/components/ui/input"

type Props = {
  value: string
  onChange: (value: string) => void
}

const AddressAutocomplete: React.FC<Props> = ({ value, onChange }) => {
  const {
    ready,
    value: inputValue,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      componentRestrictions: { country: ["vn"] },
    },
  })

  useEffect(() => {
    if (value !== inputValue) {
      setValue(value)
    }
  }, [value])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange(e.target.value)
  }

  const handleSelect = async (address: string) => {
    setValue(address, false)
    onChange(address)
    clearSuggestions()

    try {
      const results = await getGeocode({ address })
      const { lat, lng } = await getLatLng(results[0])
      console.log("Toạ độ chọn:", { lat, lng })
    } catch (error) {
      console.error("Lỗi khi lấy toạ độ:", error)
    }
  }

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Nhập địa chỉ"
        className="pl-3"
      />
      {status === "OK" && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 shadow-md rounded mt-1 max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <div
              key={place_id}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm"
              onClick={() => handleSelect(description)}
            >
              {description}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressAutocomplete
