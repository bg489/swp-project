"use client"
import { useEffect, useRef } from "react"

export default function UploadCertificate({
  id,
  value,
  onChange,
}: {
  id: string
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).uploadcare) {
      const widget = (window as any).uploadcare.Widget(inputRef.current)
      widget.onUploadComplete((fileInfo: any) => {
        onChange(fileInfo.cdnUrl)
      })
    }
  }, [])

  return (
    <div className="space-y-1">
      <input
        id={id}
        ref={inputRef}
        type="hidden"
        role="uploadcare-uploader"
        data-public-key="e0b946f3abf13fdef7a0"
        data-tabs="file url"
        data-images-only="true"
        data-clearable
      />
      {value && (
        <img
          src={value}
          alt="Giấy chứng nhận"
          className="w-40 h-40 object-cover rounded-lg border"
        />
      )}
    </div>
  )
}
