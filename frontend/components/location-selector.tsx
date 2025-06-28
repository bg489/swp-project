"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Building, Home } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Province {
  code: string
  name: string
  districts?: District[]
}

interface District {
  code: string
  name: string
  wards?: Ward[]
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
  value?: LocationData
  detailedAddress?: string
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationChange,
  onAddressChange,
  value,
  detailedAddress,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(value?.province || null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(value?.district || null)
  const [selectedWard, setSelectedWard] = useState<Ward | null>(value?.ward || null)
  const [isLoading, setIsLoading] = useState(false)

  // Popover states
  const [openProvince, setOpenProvince] = useState(false)
  const [openDistrict, setOpenDistrict] = useState(false)
  const [openWard, setOpenWard] = useState(false)

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("https://provinces.open-api.vn/api/p/")
        const data = await response.json()
        setProvinces(data)
      } catch (error) {
        console.error("Error fetching provinces:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          setIsLoading(true)
          const response = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
          const data = await response.json()
          setDistricts(data.districts || [])
          setSelectedDistrict(null)
          setSelectedWard(null)
          setWards([])
        } catch (error) {
          console.error("Error fetching districts:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setDistricts([])
        setSelectedDistrict(null)
        setSelectedWard(null)
        setWards([])
      }
    }

    fetchDistricts()
  }, [selectedProvince])

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          setIsLoading(true)
          const response = await fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          const data = await response.json()
          setWards(data.wards || [])
          setSelectedWard(null)
        } catch (error) {
          console.error("Error fetching wards:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setWards([])
        setSelectedWard(null)
      }
    }

    fetchWards()
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
    setOpenProvince(false)
  }

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district)
    setOpenDistrict(false)
  }

  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward)
    setOpenWard(false)
  }

  return (
    <div className="space-y-6">
      {/* Location Selectors Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Province Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Tỉnh / Thành phố *</Label>
          <Popover open={openProvince} onOpenChange={setOpenProvince}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openProvince}
                className="w-full justify-between h-12 px-4 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                disabled={isLoading}
              >
                {selectedProvince ? (
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-3 text-blue-500" />
                    <span className="text-gray-900">{selectedProvince.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <Building className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Chọn tỉnh/thành phố</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm tỉnh/thành phố..." className="h-10" />
                <CommandList>
                  <CommandEmpty>Không tìm thấy tỉnh/thành phố.</CommandEmpty>
                  <CommandGroup>
                    {provinces.map((province) => (
                      <CommandItem
                        key={province.code}
                        value={province.name}
                        onSelect={() => handleProvinceSelect(province)}
                        className="flex items-center px-3 py-2"
                      >
                        <Check
                          className={cn(
                            "mr-3 h-4 w-4",
                            selectedProvince?.code === province.code ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <Building className="w-4 h-4 mr-3 text-blue-500" />
                        <span>{province.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* District Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Quận / Huyện *</Label>
          <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDistrict}
                className="w-full justify-between h-12 px-4 bg-white border-gray-200 hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                disabled={!districts.length || isLoading}
              >
                {selectedDistrict ? (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-green-500" />
                    <span className="text-gray-900">{selectedDistrict.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Chọn quận/huyện</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm quận/huyện..." className="h-10" />
                <CommandList>
                  <CommandEmpty>Không tìm thấy quận/huyện.</CommandEmpty>
                  <CommandGroup>
                    {districts.map((district) => (
                      <CommandItem
                        key={district.code}
                        value={district.name}
                        onSelect={() => handleDistrictSelect(district)}
                        className="flex items-center px-3 py-2"
                      >
                        <Check
                          className={cn(
                            "mr-3 h-4 w-4",
                            selectedDistrict?.code === district.code ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <MapPin className="w-4 h-4 mr-3 text-green-500" />
                        <span>{district.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Ward Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Xã / Phường *</Label>
          <Popover open={openWard} onOpenChange={setOpenWard}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openWard}
                className="w-full justify-between h-12 px-4 bg-white border-gray-200 hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                disabled={!wards.length || isLoading}
              >
                {selectedWard ? (
                  <div className="flex items-center">
                    <Home className="w-5 h-5 mr-3 text-orange-500" />
                    <span className="text-gray-900">{selectedWard.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <Home className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Chọn xã/phường</span>
                  </div>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm xã/phường..." className="h-10" />
                <CommandList>
                  <CommandEmpty>Không tìm thấy xã/phường.</CommandEmpty>
                  <CommandGroup>
                    {wards.map((ward) => (
                      <CommandItem
                        key={ward.code}
                        value={ward.name}
                        onSelect={() => handleWardSelect(ward)}
                        className="flex items-center px-3 py-2"
                      >
                        <Check
                          className={cn("mr-3 h-4 w-4", selectedWard?.code === ward.code ? "opacity-100" : "opacity-0")}
                        />
                        <Home className="w-4 h-4 mr-3 text-orange-500" />
                        <span>{ward.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-sm text-gray-600">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* Detailed Address Input */}
      <div className="space-y-3">
        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
          Địa chỉ chi tiết *
        </Label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            id="address"
            placeholder="Số nhà, tên đường (VD: 123 Đường Nguyễn Văn Linh)"
            value={detailedAddress || ""}
            onChange={(e) => onAddressChange(e.target.value)}
            className="pl-12 h-12 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Nhập số nhà và tên đường. Thông tin tỉnh/thành phố, quận/huyện, xã/phường sẽ được thêm tự động.
        </p>
      </div>

      {/* Simplified Full Address Display Only */}
      {detailedAddress && selectedWard && selectedDistrict && selectedProvince && (
        <Card className="bg-blue-50 border-blue-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center text-blue-700">
              <MapPin className="w-5 h-5 mr-3 text-blue-600" />
              Địa chỉ đầy đủ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-900 leading-relaxed">
              {detailedAddress}, {selectedWard.name}, {selectedDistrict.name}, {selectedProvince.name}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
