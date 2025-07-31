"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Search, 
  Navigation, 
  Phone, 
  Clock, 
  Heart, 
  Star,
  Filter,
  Route,
  Building,
  Activity
} from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import MapboxMapStyled from "@/components/ui/MapboxMapStyled"

// Interface for blood donation center
interface BloodCenter {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  type: string
  rating: number
  distance: string
  bloodTypes: string[]
  urgent: string[]
  coordinates: { lat: number; lng: number }
}

export default function CheckMapPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistance, setSelectedDistance] = useState("5km")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [filteredCenters, setFilteredCenters] = useState<BloodCenter[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        searchNearbyBloodCenters(latitude, longitude, selectedDistance)
        setLoading(false)
      },
      (error) => {
        setError("Không thể lấy vị trí hiện tại")
        setLoading(false)
        console.error("Geolocation error:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Search for nearby blood centers using a mapping service API
  const searchNearbyBloodCenters = async (lat: number, lng: number, distance: string) => {
    setLoading(true)
    setError(null)

    try {
      const radiusKm = parseInt(distance.replace('km', ''))
      
      // Using Overpass API to search for hospitals and blood donation centers
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          way["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          relation["amenity"="hospital"](around:${radiusKm * 1000},${lat},${lng});
          node["healthcare"="blood_donation"](around:${radiusKm * 1000},${lat},${lng});
          way["healthcare"="blood_donation"](around:${radiusKm * 1000},${lat},${lng});
          relation["healthcare"="blood_donation"](around:${radiusKm * 1000},${lat},${lng});
        );
        out center;
      `

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery
      })

      if (!response.ok) {
        throw new Error('Không thể tìm kiếm địa điểm')
      }

      const data = await response.json()
      
      const centers: BloodCenter[] = data.elements
        .filter((element: any) => element.tags && element.tags.name)
        .map((element: any, index: number) => {
          const centerLat = element.lat || element.center?.lat
          const centerLng = element.lon || element.center?.lon
          const dist = calculateDistance(lat, lng, centerLat, centerLng)
          
          return {
            id: index + 1,
            name: element.tags.name || "Cơ sở y tế",
            address: element.tags["addr:full"] || element.tags["addr:street"] || "Địa chỉ không rõ",
            phone: element.tags.phone || element.tags["contact:phone"] || "Chưa có thông tin",
            hours: element.tags.opening_hours || "Chưa có thông tin",
            type: element.tags.amenity === "hospital" ? "Bệnh viện" : "Trung tâm hiến máu",
            rating: 4.0 + Math.random() * 1, // Random rating for demo
            distance: `${dist.toFixed(1)} km`,
            bloodTypes: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"], // Default blood types
            urgent: Math.random() > 0.5 ? ["O-", "A+"] : [], // Random urgent types
            coordinates: { lat: centerLat, lng: centerLng }
          }
        })
        .sort((a: BloodCenter, b: BloodCenter) => parseFloat(a.distance) - parseFloat(b.distance))

      setFilteredCenters(centers)
      setLoading(false)
    } catch (error) {
      setError("Lỗi khi tìm kiếm địa điểm")
      setLoading(false)
      console.error("Search error:", error)
    }
  }

  // Handle distance change
  const handleDistanceChange = (distance: string) => {
    setSelectedDistance(distance)
    if (userLocation) {
      searchNearbyBloodCenters(userLocation.lat, userLocation.lng, distance)
    }
  }

  // Handle filter change
  useEffect(() => {
    if (filteredCenters.length === 0) return

    let filtered = filteredCenters

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(center => 
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (selectedFilter !== "all") {
      filtered = filtered.filter(center => {
        if (selectedFilter === "hospital") return center.type === "Bệnh viện"
        if (selectedFilter === "urgent") return center.urgent.length > 0
        return true
      })
    }

    setFilteredCenters(filtered)
  }, [searchTerm, selectedFilter])

  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      "O+": "bg-red-100 text-red-800",
      "O-": "bg-red-200 text-red-900",
      "A+": "bg-blue-100 text-blue-800",
      "A-": "bg-blue-200 text-blue-900",
      "B+": "bg-green-100 text-green-800",
      "B-": "bg-green-200 text-green-900",
      "AB+": "bg-purple-100 text-purple-800",
      "AB-": "bg-purple-200 text-purple-900"
    }
    return colors[bloodType as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-red-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <Badge className="mb-4 bg-blue-100 text-blue-800">🗺️ Tìm điểm hiến máu</Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Bản đồ điểm hiến máu</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tìm kiếm các điểm hiến máu, bệnh viện và trung tâm y tế gần bạn để thực hiện việc hiến máu tình nguyện.
            </p>
          </div>

          {/* Distance Search Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Vị trí hiện tại</Label>
                  <Button 
                    onClick={getCurrentLocation}
                    disabled={loading}
                    className="w-full mt-1"
                    variant="outline"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {loading ? "Đang tìm..." : "Lấy vị trí"}
                  </Button>
                </div>

                <div>
                  <Label htmlFor="search">Tìm kiếm địa điểm</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Lọc kết quả..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      disabled={!userLocation}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Khoảng cách tìm kiếm</Label>
                  <div className="flex gap-1 mt-1">
                    <Button
                      variant={selectedDistance === "1km" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDistanceChange("1km")}
                      disabled={!userLocation}
                    >
                      1km
                    </Button>
                    <Button
                      variant={selectedDistance === "5km" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDistanceChange("5km")}
                      disabled={!userLocation}
                    >
                      5km
                    </Button>
                    <Button
                      variant={selectedDistance === "10km" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDistanceChange("10km")}
                      disabled={!userLocation}
                    >
                      10km
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Lọc theo loại</Label>
                  <div className="flex gap-1 mt-1">
                    <Button
                      variant={selectedFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter("all")}
                      disabled={!userLocation}
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={selectedFilter === "hospital" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter("hospital")}
                      disabled={!userLocation}
                    >
                      <Building className="w-4 h-4 mr-1" />
                      Bệnh viện
                    </Button>
                    <Button
                      variant={selectedFilter === "urgent" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter("urgent")}
                      disabled={!userLocation}
                    >
                      <Activity className="w-4 h-4 mr-1" />
                      Cần gấp
                    </Button>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              {!userLocation && !loading && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-600 text-sm">
                    Vui lòng nhấn "Lấy vị trí" để tìm kiếm các điểm hiến máu gần bạn
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-blue-600" />
                    Bản đồ điểm hiến máu
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-full relative">
                  {/* Map Container */}
                  <div className="w-full h-full rounded-lg overflow-hidden relative">
                    <MapboxMapStyled />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Centers List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Danh sách địa điểm</h2>
                <Badge variant="secondary">
                  {loading ? "Đang tìm..." : `${filteredCenters.length} kết quả`}
                </Badge>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tìm kiếm địa điểm...</p>
                  </div>
                )}
                
                {!loading && !userLocation && (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Nhấn "Lấy vị trí" để bắt đầu tìm kiếm</p>
                  </div>
                )}
                
                {!loading && userLocation && filteredCenters.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Không tìm thấy địa điểm nào trong phạm vi {selectedDistance}</p>
                    <p className="text-sm text-gray-500 mt-2">Thử tăng khoảng cách tìm kiếm</p>
                  </div>
                )}

                {!loading && filteredCenters.map((center) => (
                  <Card key={center.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{center.name}</h3>
                          <Badge variant="outline" className="mb-2">{center.type}</Badge>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {center.address}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Route className="w-4 h-4 mr-1" />
                            {center.distance}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{center.rating}</span>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {center.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {center.hours}
                        </div>
                      </div>

                      {/* Blood Types */}
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Nhóm máu tiếp nhận:</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {center.bloodTypes.map((type) => (
                            <Badge 
                              key={type} 
                              variant="secondary" 
                              className={`text-xs ${getBloodTypeColor(type)}`}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                        
                        {center.urgent.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-red-600 mb-1">Cần gấp:</p>
                            <div className="flex flex-wrap gap-1">
                              {center.urgent.map((type) => (
                                <Badge 
                                  key={type} 
                                  variant="destructive" 
                                  className="text-xs animate-pulse"
                                >
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
