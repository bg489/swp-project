"use client"

import React from "react"
import { Input } from "@/components/ui/input"

type Props = {
  value: string
  onChange: (value: string) => void
}

const AddressAutocomplete: React.FC<Props> = ({ value, onChange }) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleInput}
        placeholder="Nhập địa chỉ"
        className="pl-3"
      />
    </div>
  )
}

export default AddressAutocomplete
