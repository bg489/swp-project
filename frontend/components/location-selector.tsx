"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Building, MapPin, Home, Check, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Province {
  code: string
  name: string
}

interface District {
  code: string
  name: string
}

interface Ward {
  code: string
  name: string
}

interface LocationData {
  province: Province | null
  district: District | null
  ward: Ward | null
}

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void
  onAddressChange: (address: string) => void
  value: LocationData
  detailedAddress: string
}

export function LocationSelector({ onLocationChange, onAddressChange, value, detailedAddress }: LocationSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(value.province)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(value.district)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(value.ward)

  const [openProvince, setOpenProvince] = useState(false)
  const [openDistrict, setOpenDistrict] = useState(false)
  const [openWard, setOpenWard] = useState(false)

  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)

  // Load provinces on component mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Error loading provinces:", err))
  }, [])

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      setLoadingDistricts(true)
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data.districts || [])
          setLoadingDistricts(false)
        })
        .catch((err) => {
          console.error("Error loading districts:", err)
          setLoadingDistricts(false)
        })
    } else {
      setDistricts([])
      setSelectedDistrict(null)
      setSelectedWard(null)
    }
  }, [selectedProvince])

  // Load wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      setLoadingWards(true)
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setWards(data.wards || [])
          setLoadingWards(false)
        })
        .catch((err) => {
          console.error("Error loading wards:", err)
          setLoadingWards(false)
        })
    } else {
      setWards([])
      setSelectedWard(null)
    }
  }, [selectedDistrict])

  // Notify parent component when location changes
  useEffect(() => {
    onLocationChange({
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
    })
  }, [selectedProvince, selectedDistrict, selectedWard])

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province)
    setSelectedDistrict(null)
    setSelectedWard(null)
    setOpenProvince(false)
  }

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district)
    setSelectedWard(null)
    setOpenDistrict(false)
  }

  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward)
    setOpenWard(false)
  }

  return (
    <div className="space-y-6">
      {/* Location Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Province Selector */}
        <div className="space-y-2">
          <Label htmlFor="province" className="text-sm font-medium text-gray-700">
            Tỉnh / Thành phố *
          </Label>
          <Popover open={openProvince} onOpenChange={setOpenProvince}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openProvince}
                className="w-full h-12 justify-between text-left font-normal focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-transparent"
              >
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                  <span className={selectedProvince ? "text-gray-900" : "text-gray-500"}>
                    {selectedProvince ? selectedProvince.name : "Chọn tỉnh/thành phố"}
                  </span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm tỉnh/thành phố..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy tỉnh/thành phố.</CommandEmpty>
                  <CommandGroup>
                    {provinces.map((province) => (
                      <CommandItem
                        key={province.code}
                        value={province.name}
                        onSelect={() => handleProvinceSelect(province)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProvince?.code === province.code ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {province.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* District Selector */}
        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-medium text-gray-700">
            Quận / Huyện *
          </Label>
          <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDistrict}
                disabled={!selectedProvince || loadingDistricts}
                className="w-full h-12 justify-between text-left font-normal focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 bg-transparent"
              >
                <div className="flex items-center">
                  {loadingDistricts ? (
                    <Loader2 className="w-4 h-4 mr-3 text-green-500 flex-shrink-0 animate-spin" />
                  ) : (
                    <MapPin className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                  )}
                  <span className={selectedDistrict ? "text-gray-900" : "text-gray-500"}>
                    {loadingDistricts ? "Đang tải..." : selectedDistrict ? selectedDistrict.name : "Chọn quận/huyện"}
                  </span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm quận/huyện..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy quận/huyện.</CommandEmpty>
                  <CommandGroup>
                    {districts.map((district) => (
                      <CommandItem
                        key={district.code}
                        value={district.name}
                        onSelect={() => handleDistrictSelect(district)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedDistrict?.code === district.code ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {district.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Ward Selector */}
        <div className="space-y-2">
          <Label htmlFor="ward" className="text-sm font-medium text-gray-700">
            Xã / Phường *
          </Label>
          <Popover open={openWard} onOpenChange={setOpenWard}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openWard}
                disabled={!selectedDistrict || loadingWards}
                className="w-full h-12 justify-between text-left font-normal focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 bg-transparent"
              >
                <div className="flex items-center">
                  {loadingWards ? (
                    <Loader2 className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0 animate-spin" />
                  ) : (
                    <Home className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                  )}
                  <span className={selectedWard ? "text-gray-900" : "text-gray-500"}>
                    {loadingWards ? "Đang tải..." : selectedWard ? selectedWard.name : "Chọn xã/phường"}
                  </span>
                </div>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm xã/phường..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy xã/phường.</CommandEmpty>
                  <CommandGroup>
                    {wards.map((ward) => (
                      <CommandItem key={ward.code} value={ward.name} onSelect={() => handleWardSelect(ward)}>
                        <Check
                          className={cn("mr-2 h-4 w-4", selectedWard?.code === ward.code ? "opacity-100" : "opacity-0")}
                        />
                        {ward.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Detailed Address Input */}
      <div className="space-y-2">
        <Label htmlFor="detailedAddress" className="text-sm font-medium text-gray-700">
          Địa chỉ chi tiết *
        </Label>
        <div className="relative">
          <Input
            id="detailedAddress"
            placeholder="Số nhà, tên đường (VD: 123 Đường Nguyễn Văn Linh)"
            value={detailedAddress}
            onChange={(e) => onAddressChange(e.target.value)}
            className="pl-10 h-12 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <MapPin className="absolute left-3 top-4 h-4 w-4 text-purple-500" />
        </div>
        <p className="text-xs text-gray-500">
          Nhập số nhà và tên đường. Thông tin tỉnh/thành phố, quận/huyện, xã/phường sẽ được thêm tự động.
        </p>
      </div>

      {/* Full Address Display */}
      {detailedAddress && selectedProvince && selectedDistrict && selectedWard && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Địa chỉ đầy đủ:</h4>
              <p className="text-sm text-gray-800 leading-relaxed">
                {detailedAddress}, {selectedWard.name}, {selectedDistrict.name}, {selectedProvince.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
