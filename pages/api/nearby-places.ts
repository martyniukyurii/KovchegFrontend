import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);
  const radius = 500; // 500 метрів

  try {
    // Один великий запит замість 10 окремих - набагато швидше!
    const overpassQuery = `
      [out:json][timeout:10];
      (
        node["amenity"="cafe"](around:${radius},${latitude},${longitude});
        node["amenity"="restaurant"](around:${radius},${latitude},${longitude});
        node["shop"~"supermarket|convenience|mall|general"](around:${radius},${latitude},${longitude});
        way["shop"~"supermarket|mall"](around:${radius},${latitude},${longitude});
        node["highway"="bus_stop"](around:${radius},${latitude},${longitude});
        node["amenity"="school"](around:${radius},${latitude},${longitude});
        node["leisure"="park"](around:${radius},${latitude},${longitude});
        way["leisure"="park"](around:${radius},${latitude},${longitude});
        node["amenity"="hospital"](around:${radius},${latitude},${longitude});
        node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        node["amenity"="pharmacy"](around:${radius},${latitude},${longitude});
        node["amenity"="bank"](around:${radius},${latitude},${longitude});
        node["amenity"~"atm"](around:${radius},${latitude},${longitude});
        node["leisure"~"fitness_centre|sports_centre|gym"](around:${radius},${latitude},${longitude});
        way["highway"="cycleway"](around:${radius},${latitude},${longitude});
      );
      out body;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Перевірка чи відповідь - це JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Overpass API повернув не JSON, можливо сервер перевантажений");
      // Повертаємо пусті дані замість помилки
      return res.status(200).json({
        cafes: 0,
        shops: 0,
        busStops: 0,
        schools: 0,
        parks: 0,
        hospitals: 0,
        pharmacies: 0,
        banks: 0,
        gyms: 0,
        bikeRoads: 0,
      });
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error("Помилка парсингу JSON від Overpass API:", jsonError);
      // Повертаємо пусті дані
      return res.status(200).json({
        cafes: 0,
        shops: 0,
        busStops: 0,
        schools: 0,
        parks: 0,
        hospitals: 0,
        pharmacies: 0,
        banks: 0,
        gyms: 0,
        bikeRoads: 0,
      });
    }
    
    // Підраховуємо кількість кожного типу
    const counts = {
      cafes: 0,
      shops: 0,
      busStops: 0,
      schools: 0,
      parks: 0,
      hospitals: 0,
      pharmacies: 0,
      banks: 0,
      gyms: 0,
      bikeRoads: 0,
    };

    if (data.elements) {
      data.elements.forEach((element: any) => {
        const tags = element.tags || {};
        
        // Кафе та ресторани
        if (tags.amenity === "cafe" || tags.amenity === "restaurant") {
          counts.cafes++;
        }
        // Магазини
        else if (tags.shop) {
          counts.shops++;
        }
        // Зупинки
        else if (tags.highway === "bus_stop") {
          counts.busStops++;
        }
        // Школи
        else if (tags.amenity === "school") {
          counts.schools++;
        }
        // Парки
        else if (tags.leisure === "park") {
          counts.parks++;
        }
        // Лікарні та клініки
        else if (tags.amenity === "hospital" || tags.amenity === "clinic") {
          counts.hospitals++;
        }
        // Аптеки
        else if (tags.amenity === "pharmacy") {
          counts.pharmacies++;
        }
        // Банки та банкомати
        else if (tags.amenity === "bank" || tags.amenity === "atm") {
          counts.banks++;
        }
        // Спортзали
        else if (tags.leisure === "fitness_centre" || tags.leisure === "sports_centre" || tags.leisure === "gym") {
          counts.gyms++;
        }
        // Велодоріжки
        else if (tags.highway === "cycleway") {
          counts.bikeRoads++;
        }
      });
    }

    return res.status(200).json(counts);
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

