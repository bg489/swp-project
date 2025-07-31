"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import api from "@/lib/axios"

import { Droplet } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import toast, { Toaster } from "react-hot-toast"

export default function ManageInventoryPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const hospitalId = searchParams.get("hospitalId")
    const [inventory, setInventory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const bloodInvent = await api.get(`/blood-in/blood-inventory/hospital/${hospitalId}`);
                setInventory(bloodInvent.data.inventories);
                console.log(bloodInvent.data.inventories);
            } catch (error) {
                setInventory([]);
            } finally {
                setLoading(false);
            }
        }

        if (hospitalId) {
            fetchNotes();
        }
    }, [hospitalId])


    const handleChange = (index: number, field: string, value: number) => {
        const updated = [...inventory]
        updated[index][field] = value
        setInventory(updated)
    }

    const handleSave = async () => {
        try {
            await Promise.all(inventory.map(item =>
                api.put(`/blood-in/blood-inventory/update/${item._id}`, {
                    quantity: item.quantity,
                    expiring_quantity: item.expiring_quantity,
                })
            ))

            toast.success("Cập nhật kho máu thành công.")
            router.push("/admin/dashboard");
        } catch (err) {
            toast.error("Không thể lưu thay đổi.")
        }
    }

    const getStatusColor = (qty: number) => {
        if (qty < 30) return "bg-red-500"
        if (qty < 100) return "bg-yellow-500"
        if (qty < 150) return "bg-blue-500"
        return "bg-green-500"
    }

    if (loading) return <p className="p-4">Đang tải dữ liệu...</p>

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <div className="flex justify-center bg-gray-50 min-h-screen py-10">
                <div className="w-full max-w-6xl px-4">
                    <h1 className="text-3xl font-bold mb-8 text-center text-red-700">Quản lý kho máu</h1>

                    {/* Responsive grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {inventory.map((item, idx) => (
                            <Card key={item._id} className="shadow-lg rounded-2xl border border-gray-200 bg-white">
                                <CardHeader className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${getStatusColor(item.quantity)} text-white`}>
                                            <Droplet className="w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold">
                                            {item.blood_type}
                                        </CardTitle>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Đang có: <strong>{item.quantity}</strong> đơn vị
                                    </span>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Số lượng hiện có</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={item.quantity}
                                                onChange={(e) => handleChange(idx, "quantity", parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label>Sắp hết hạn</Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                value={item.expiring_quantity}
                                                onChange={(e) => handleChange(idx, "expiring_quantity", parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Tiến độ đạt mục tiêu (500 đơn vị)</Label>
                                        <Progress value={Math.min((item.quantity / 500) * 100, 100)} className="h-2 mt-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            onClick={handleSave}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl shadow-md"
                        >
                            💾 Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />

            <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
            <Toaster position="top-center" containerStyle={{
                top: 80,
            }} />
        </div>
    )

}
