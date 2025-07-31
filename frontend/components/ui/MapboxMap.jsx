import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./mapbox-custom.css";
import api from "../../lib/axios";

mapboxgl.accessToken = "pk.eyJ1IjoiZ2lhYmFvMTIzOTYzIiwiYSI6ImNtY2J1ejZ6ZTAxYjYybG9wOXJkYnRxMmkifQ.AL0ZjkYXmVV7UsTAPrgVxA";

export default function MapboxMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [placeSearchTerm, setPlaceSearchTerm] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [nearbyMarkers, setNearbyMarkers] = useState([]);
  const suggestionRefs = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get("/hospital/"); // giả sử router bạn đã khai báo ở `/api/hospitals`
        if (response.data.success) {
          const hospitalData = response.data.hospitals.map(h => ({
            name: h.name,
            coords: [h.longitude, h.latitude], // map về format bạn cần cho Mapbox
            address: h.address,
            phone: h.phone,
          }));
          setHospitals(hospitalData);
        } else {
          console.error("Không lấy được danh sách bệnh viện:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API danh sách bệnh viện:", error);
      }
    };

    fetchHospitals();
  }, []);


  const normalizeVietnamese = (str) => str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  const addHospital = (name, longitude, latitude) => {
    if (!name || isNaN(longitude) || isNaN(latitude)) {
      alert("Tên bệnh viện và tọa độ không hợp lệ!");
      return;
    }
    const newHospital = { name, coords: [longitude, latitude] };
    setHospitals((prev) => [...prev, newHospital]);
    alert(`✅ Đã thêm: ${name}`);
  };

  const checkLocationPermission = async () => {
    if (!navigator.permissions) {
      alert("Trình duyệt không hỗ trợ Permissions API.");
      return false;
    }
    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
      return permissionStatus.state === "granted";
    } catch (err) {
      console.error("Lỗi kiểm tra quyền geolocation:", err);
      return false;
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

      // Chỉ hiển thị kết quả khớp nguyên văn
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedIndex(-1);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    const normalizedInput = normalizeVietnamese(value.toLowerCase());
    const matches = hospitals.filter((h) => {
      const normalizedName = normalizeVietnamese(h.name.toLowerCase());
      return normalizedName.includes(normalizedInput);
    });

    setSuggestions(matches);
  };

  /**
   * Lấy tọa độ hiện tại của người dùng
   * @returns {Promise<{ latitude: number, longitude: number }>}
   */
  const getCurrentCoordinates = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Trình duyệt không hỗ trợ geolocation."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };



  const findHospitalsNearby = (latitude, longitude, radiusKm) => {
    nearbyMarkers.forEach(marker => marker.remove());

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearbyHospitals = hospitals.filter((h) => {
      const [lon, lat] = h.coords;
      const distance = getDistanceFromLatLonInKm(latitude, longitude, lat, lon);
      return distance <= radiusKm;
    });

    const newMarkers = nearbyHospitals.map((hospital) => {
      const marker = new mapboxgl.Marker({ color: "orange" })
        .setLngLat(hospital.coords)
        .setPopup(new mapboxgl.Popup().setText(`${hospital.name}`))
        .addTo(mapRef.current);
      return marker;
    });

    setNearbyMarkers(newMarkers);

    if (nearbyHospitals.length === 0) {
      alert(`❗ Không tìm thấy bệnh viện nào trong ${radiusKm}km.`);
    }
  };

  const handleSuggestionClick = (hospital) => {
    setSearchTerm(hospital.name);
    setSuggestions([]);
    mapRef.current?.flyTo({ center: hospital.coords, zoom: 15, essential: true });
    new mapboxgl.Marker({ color: "green" })
      .setLngLat(hospital.coords)
      .setPopup(new mapboxgl.Popup().setText(hospital.name))
      .addTo(mapRef.current);
  };

  const findLocationByName = async (query) => {
    if (!query.trim()) {
      alert("Vui lòng nhập tên địa điểm gần bạn!");
      return;
    }
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?country=VN&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        mapRef.current.flyTo({ center: [longitude, latitude], zoom: 13, essential: true });
        new mapboxgl.Marker({ color: "purple" })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup().setText(`Vị trí bạn chọn: ${query}`))
          .addTo(mapRef.current);
      } else {
        alert(`❗ Không tìm thấy địa điểm "${query}".`);
      }
    } catch (error) {
      console.error("Lỗi khi tìm địa điểm:", error);
      alert("Đã xảy ra lỗi khi tìm địa điểm.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          console.log("📍 Tọa độ hiện tại:", latitude, longitude);
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [longitude, latitude],
            zoom: 13,
          });
          new mapboxgl.Marker({ color: "blue" })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setText("Bạn đang ở đây"))
            .addTo(mapRef.current);
        },
        (err) => {
          console.error(err);
          alert("Không thể lấy vị trí của bạn. Hiển thị bản đồ mặc định.");
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [106.700981, 10.776530],
            zoom: 12,
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      setSearchTerm(suggestions[selectedIndex].name);
      suggestionRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex, suggestions]);

  return (
    <div>
      <div style={{ position: "absolute", zIndex: 1, padding: 10 }}>
        <input
          type="text"
          placeholder="Tìm bệnh viện..."
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
          style={{ padding: "8px", width: "300px", borderRadius: 4, marginBottom: 8 }}
        />

        {suggestions.length > 0 && (
          <ul style={{
            background: "#fff", border: "1px solid #ccc", marginTop: 4,
            maxHeight: 150, overflowY: "auto", listStyle: "none", padding: 0, width: "300px"
          }}>
            {suggestions.map((s, i) => (
              <li
                key={i}
                ref={el => suggestionRefs.current[i] = el}
                onClick={() => handleSuggestionClick(s)}
                style={{
                  padding: "8px", cursor: "pointer", borderBottom: "1px solid #eee",
                  backgroundColor: i === selectedIndex ? "#f0f0f0" : "#fff",
                }}
              >
                {s.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map Container */}
      <div ref={mapContainerRef} className="mapbox-map-container" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
