import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import api from "../../lib/axios";

mapboxgl.accessToken = "pk.eyJ1IjoiZ2lhYmFvMTIzOTYzIiwiYSI6ImNtY2J1ejZ6ZTAxYjYybG9wOXJkYnRxMmkifQ.AL0ZjkYXmVV7UsTAPrgVxA";

export default function MapboxMapStyled() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [placeSearchTerm, setPlaceSearchTerm] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get("/hospital/");
        if (response.data.success) {
          const hospitalData = response.data.hospitals.map(h => ({
            name: h.name,
            coords: [h.longitude, h.latitude],
            address: h.address,
            phone: h.phone,
          }));
          setHospitals(hospitalData);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API danh sách bệnh viện:", error);
        // Fallback data
        setHospitals([
          { name: "Bệnh viện Bạch Mai", coords: [105.8457, 21.0031], address: "78 Giải Phóng, Đống Đa, Hà Nội" },
          { name: "Bệnh viện Việt Đức", coords: [105.8467, 21.0344], address: "40-42 Tràng Thi, Hoàn Kiếm, Hà Nội" },
        ]);
      }
      setLoading(false);
    };

    fetchHospitals();
  }, []);

  const normalizeVietnamese = (str) => str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const normalizedInput = normalizeVietnamese(value.toLowerCase());
    const filteredHospitals = hospitals.filter((hospital) => {
      const normalizedName = normalizeVietnamese(hospital.name.toLowerCase());
      return normalizedName.includes(normalizedInput);
    });

    setSuggestions(filteredHospitals);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (hospital) => {
    setSearchTerm(hospital.name);
    setSuggestions([]);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: hospital.coords,
        zoom: 15,
        duration: 1000
      });
    }
  };

  const handlePlaceSearchChange = async (e) => {
    const value = e.target.value;
    setPlaceSearchTerm(value);

    if (value.trim() === "") {
      setPlaceSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?autocomplete=true&limit=5&country=VN&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      const normalizedInput = normalizeVietnamese(value.toLowerCase());
      const filteredFeatures = (data.features || []).filter((feature) => {
        const normalizedPlace = normalizeVietnamese(feature.place_name.toLowerCase());
        return normalizedPlace.includes(normalizedInput);
      });

      setPlaceSuggestions(filteredFeatures);
    } catch (err) {
      console.error("Lỗi gợi ý địa điểm:", err);
      setPlaceSuggestions([]);
    }
  };

  const findLocationByName = (placeName) => {
    setPlaceSearchTerm(placeName);
    setPlaceSuggestions([]);
    
    if (mapRef.current) {
      const suggestion = placeSuggestions.find(s => s.place_name === placeName);
      if (suggestion) {
        mapRef.current.flyTo({
          center: suggestion.center,
          zoom: 13,
          duration: 1000
        });
      }
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [longitude, latitude],
          zoom: 12,
        });

        // Add user location marker
        new mapboxgl.Marker({ color: '#3b82f6', scale: 1.2 })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setText('Vị trí của bạn'))
          .addTo(mapRef.current);

        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Default to Ho Chi Minh City
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [106.700981, 10.776530],
          zoom: 12,
        });
        setLoading(false);
      }
    );

    return () => mapRef.current?.remove();
  }, []);

  useEffect(() => {
    if (!mapRef.current || hospitals.length === 0) return;

    hospitals.forEach((hospital) => {
      const el = document.createElement('div');
      el.className = 'hospital-marker';
      el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #ef4444;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        font-size: 14px;
        cursor: pointer;
      `;
      el.innerHTML = '🏥';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; font-family: system-ui;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${hospital.name}</h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">${hospital.address || 'Địa chỉ không có'}</p>
          ${hospital.phone ? `<p style="margin: 0; font-size: 12px; color: #6b7280;">📞 ${hospital.phone}</p>` : ''}
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat(hospital.coords)
        .setPopup(popup)
        .addTo(mapRef.current);
    });
  }, [hospitals]);

  const customStyles = `
    .mapbox-search-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      overflow: hidden;
    }

    .mapbox-search-input {
      border: none;
      outline: none;
      padding: 12px 16px;
      font-size: 14px;
      width: 100%;
      background: white;
    }

    .mapbox-search-input:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .mapbox-suggestions {
      background: white;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 4px;
    }

    .mapbox-suggestion-item {
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #f3f4f6;
      font-size: 14px;
      color: #374151;
      transition: background-color 0.15s ease;
    }

    .mapbox-suggestion-item:hover {
      background-color: #f9fafb;
    }

    .mapbox-suggestion-item:last-child {
      border-bottom: none;
    }

    .mapboxgl-ctrl-top-right,
    .mapboxgl-ctrl-bottom-right,
    .mapboxgl-ctrl-bottom-left {
      display: none !important;
    }

    .hospital-marker:hover {
      transform: scale(1.1);
      transition: transform 0.2s ease;
    }
  `;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{customStyles}</style>
      
      {loading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
          background: "white",
          padding: "16px 24px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <div style={{
            width: "20px",
            height: "20px",
            border: "2px solid #e5e7eb",
            borderTop: "2px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>Đang tải bản đồ...</span>
        </div>
      )}

      {/* Search Controls */}
      <div style={{ 
        position: "absolute", 
        zIndex: 1000, 
        top: "16px", 
        left: "16px", 
        right: "16px",
        maxWidth: "400px"
      }}>
        <div className="mapbox-search-container" style={{ marginBottom: "8px" }}>
          <input
            type="text"
            placeholder="🔍 Tìm bệnh viện hoặc điểm hiến máu..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (suggestions.length === 0) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % suggestions.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
              } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                handleSuggestionClick(suggestions[selectedIndex]);
              }
            }}
            className="mapbox-search-input"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="mapbox-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="mapbox-suggestion-item"
                style={{ 
                  backgroundColor: index === selectedIndex ? "#f3f4f6" : "transparent"
                }}
              >
                <div style={{ fontWeight: "600", marginBottom: "2px" }}>{suggestion.name}</div>
                {suggestion.address && (
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    📍 {suggestion.address}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mapbox-search-container">
          <input
            type="text"
            placeholder="📍 Tìm theo địa điểm (VD: Quận 1, TP.HCM)..."
            value={placeSearchTerm}
            onChange={handlePlaceSearchChange}
            className="mapbox-search-input"
          />
        </div>

        {placeSuggestions.length > 0 && (
          <div className="mapbox-suggestions">
            {placeSuggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => findLocationByName(suggestion.place_name)}
                className="mapbox-suggestion-item"
              >
                📍 {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: "100%", 
          height: "100%",
          borderRadius: "12px",
          overflow: "hidden"
        }} 
      />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
