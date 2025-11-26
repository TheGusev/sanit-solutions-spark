import { useEffect, useRef, useState } from "react";
import { ServiceArea } from "@/data/serviceAreas";

interface YandexMapProps {
  selectedArea: ServiceArea;
  onAreaSelect: (area: ServiceArea) => void;
  districts: ServiceArea[];
  regions: ServiceArea[];
}

const YandexMap = ({ selectedArea, onAreaSelect, districts, regions }: YandexMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // District coordinates (simplified polygons for Moscow districts)
  const districtCoordinates: Record<string, number[][][]> = {
    cao: [[[55.7558, 37.6173], [55.7658, 37.6373], [55.7558, 37.6573], [55.7458, 37.6373], [55.7558, 37.6173]]],
    sao: [[[55.7958, 37.5573], [55.8258, 37.5873], [55.8158, 37.6473], [55.7858, 37.6173], [55.7958, 37.5573]]],
    svao: [[[55.8358, 37.6573], [55.8658, 37.6873], [55.8358, 37.7273], [55.8058, 37.6873], [55.8358, 37.6573]]],
    vao: [[[55.7658, 37.7073], [55.7858, 37.7473], [55.7558, 37.7873], [55.7358, 37.7473], [55.7658, 37.7073]]],
    yuvao: [[[55.6858, 37.7273], [55.7158, 37.7573], [55.6858, 37.7973], [55.6558, 37.7573], [55.6858, 37.7273]]],
    yao: [[[55.6158, 37.6173], [55.6458, 37.6473], [55.6158, 37.6873], [55.5858, 37.6473], [55.6158, 37.6173]]],
    yzao: [[[55.6558, 37.5173], [55.6858, 37.5473], [55.6558, 37.5873], [55.6258, 37.5473], [55.6558, 37.5173]]],
    zao: [[[55.7258, 37.4473], [55.7558, 37.4773], [55.7258, 37.5173], [55.6958, 37.4773], [55.7258, 37.4473]]],
    szao: [[[55.8058, 37.4873], [55.8358, 37.5173], [55.8058, 37.5573], [55.7758, 37.5273], [55.8058, 37.4873]]],
    zelenograd: [[[55.9858, 37.2173], [56.0158, 37.2473], [55.9858, 37.2873], [55.9558, 37.2473], [55.9858, 37.2173]]],
    novomoskovsk: [[[55.4358, 37.4673], [55.4658, 37.4973], [55.4358, 37.5373], [55.4058, 37.4973], [55.4358, 37.4673]]],
    troitsk: [[[55.4858, 37.2973], [55.5158, 37.3273], [55.4858, 37.3673], [55.4558, 37.3273], [55.4858, 37.2973]]],
  };

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [55.7558, 37.6173], // Moscow center
          zoom: 10,
          controls: ['zoomControl', 'fullscreenControl', 'typeSelector']
        });

        // Add polygons for each district
        districts.forEach((district) => {
          const coords = districtCoordinates[district.id];
          if (!coords) return;

          const polygon = new window.ymaps.Polygon(
            coords,
            {
              balloonContentHeader: district.fullName,
              balloonContentBody: `<strong>Стоимость:</strong> ${district.price}<br/><strong>Время выезда:</strong> ${district.responseTime}`,
              hintContent: district.fullName
            },
            {
              fillColor: district.color + '66', // Add transparency
              strokeColor: district.color,
              strokeWidth: 2,
              strokeOpacity: 0.8,
              fillOpacity: 0.4
            }
          );

          // Highlight on hover
          polygon.events.add('mouseenter', () => {
            polygon.options.set('fillOpacity', 0.6);
          });

          polygon.events.add('mouseleave', () => {
            polygon.options.set('fillOpacity', 0.4);
          });

          // Select area on click
          polygon.events.add('click', () => {
            onAreaSelect(district);
          });

          map.geoObjects.add(polygon);
        });

        // Highlight selected area
        if (selectedArea && districtCoordinates[selectedArea.id]) {
          const selectedPolygon = new window.ymaps.Polygon(
            districtCoordinates[selectedArea.id],
            {},
            {
              strokeColor: '#FF5722',
              strokeWidth: 4,
              strokeOpacity: 1,
              fillOpacity: 0
            }
          );
          map.geoObjects.add(selectedPolygon);
        }

        setMapInstance(map);
        setIsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Ошибка инициализации карты');
        setIsLoading(false);
      }
    };

    // Wait for Yandex Maps API to load with timeout
    const checkApi = setInterval(() => {
      if (window.ymaps) {
        clearInterval(checkApi);
        window.ymaps.ready(initializeMap);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkApi);
      if (!window.ymaps) {
        setError('Не удалось загрузить карту. Попробуйте обновить страницу.');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      clearInterval(checkApi);
      clearTimeout(timeout);
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, []);

  // Update highlighted district when selection changes
  useEffect(() => {
    if (!mapInstance || !isLoaded) return;

    // Remove old highlight
    const geoObjects = mapInstance.geoObjects;
    geoObjects.each((obj: any) => {
      if (obj.options.get('strokeWidth') === 4) {
        geoObjects.remove(obj);
      }
    });

    // Add new highlight
    if (selectedArea && districtCoordinates[selectedArea.id]) {
      const selectedPolygon = new window.ymaps.Polygon(
        districtCoordinates[selectedArea.id],
        {},
        {
          strokeColor: '#FF5722',
          strokeWidth: 4,
          strokeOpacity: 1,
          fillOpacity: 0
        }
      );
      mapInstance.geoObjects.add(selectedPolygon);
    }
  }, [selectedArea, mapInstance, isLoaded]);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="text-sm">Загрузка карты...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg text-center p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}
      
      {/* Legend */}
      {!isLoading && !error && (
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-card/95 backdrop-blur-sm p-2 sm:p-4 rounded-lg shadow-lg border max-w-[200px] sm:max-w-none">
          <h4 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Легенда</h4>
          <div className="space-y-1 sm:space-y-2 text-[10px] sm:text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: '#4CAF50' }}></div>
              <span>Быстрый выезд (30-60 мин)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: '#FFC107' }}></div>
              <span>День в день (40-120 мин)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded" style={{ backgroundColor: '#2196F3' }}></div>
              <span>Отдалённые (90-150 мин)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YandexMap;
