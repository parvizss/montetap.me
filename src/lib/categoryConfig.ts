const EUROPEAN_CAR_BRANDS = [
  "Volkswagen", "Renault", "Peugeot", "Toyota", "BMW", "Mercedes-Benz", "Audi", "Skoda", 
  "Ford", "Fiat", "Hyundai", "Kia", "Dacia", "Citroen", "Opel", "Seat", "Volvo", "Nissan", 
  "Mazda", "Suzuki", "Honda", "Land Rover", "Porsche", "Lexus", "Mitsubishi", "Smart", 
  "Mini", "Jaguar", "Alfa Romeo", "DS", "Cupra", "Tesla", "Subaru", "Jeep", "Lancia", 
  "MG", "Polestar", "Maserati", "Ferrari", "Lamborghini", "Bentley", "Aston Martin", 
  "Rolls-Royce", "Lotus", "Alpine", "McLaren", "Bugatti", "Abarth", "Iveco", "Zastava"
].sort();

const BODY_TYPES = [
  "Sedan", "Hatchback", "SUV", "Coupe", "Convertible", "Universal", "Minivan", "Pickup"
];

export const CATEGORY_FIELDS: Record<string, any[]> = {
  neqliyyat: [
    { name: "brand", label: "specs_brand", type: "select", options: EUROPEAN_CAR_BRANDS },
    { name: "model", label: "Model", type: "text" },
    { name: "year", label: "specs_year", type: "number" },
    { name: "fuel", label: "specs_fuel", type: "select", options: ["Benzin", "Dizel", "Hibrid", "Elektrik", "Qaz"] },
    { name: "transmission", label: "specs_transmission", type: "select", options: ["Avtomat", "Mexanika"] },
    { name: "body_type", label: "Ban növü", type: "select", options: BODY_TYPES }
  ],
  dasinmaz_emlak: [
    { name: "type", label: "Növü", type: "select", options: ["Mənzil", "Ev/Villa", "Obyekt", "Torpaq"] },
    { name: "area", label: "Sahə (m²)", type: "number" },
    { name: "rooms", label: "Otaq sayı", type: "number" },
    { name: "floor", label: "Mərtəbə", type: "number" },
    { name: "document", label: "Sənəd (List nepokretnosti)", type: "select", options: ["Var", "Yoxdur (Legalizacija)"] }
  ],
  elektronika: [
    { name: "device_type", label: "Cihaz növü", type: "select", options: ["Telefon", "Kompyuter", "Planşet", "Fotoaparat"] },
    { name: "brand", label: "specs_brand", type: "text" },
    { name: "condition", label: "specs_condition", type: "select", options: ["Yeni", "İşlənmiş"] }
  ],
  geyim: [
    { name: "clothing_type", label: "Geyim növü", type: "select", options: ["Üst geyim", "Ayaqqabı", "Aksesuar"] },
    { name: "size", label: "Ölçü", type: "text" },
    { name: "gender", label: "Cins", type: "select", options: ["Kişi", "Qadın", "Uşaq"] }
  ],
  is_elanlari: [
    { name: "job_category", label: "Sahə", type: "select", options: ["Restoran/Otel", "Tikinti", "IT/Dizayn", "Nəqliyyat/Kuryer"] },
    { name: "schedule", label: "İş qrafiki", type: "select", options: ["Tam", "Yarım ştat", "Mövsümi"] },
    { name: "salary", label: "Maaş təklifi (Aylıq €)", type: "number" }
  ],
  xidmetler: [
    { name: "service_name", label: "Xidmət növü", type: "text" },
    { name: "price_type", label: "Qiymət növü", type: "select", options: ["Saatlıq", "Günlük", "Layihə əsaslı"] }
  ],
  usaq_dunyasi: [
     { name: "condition", label: "specs_condition", type: "select", options: ["Yeni", "İşlənmiş"] }
  ],
  idman: [
    { name: "type", label: "Növü", type: "text" },
    { name: "condition", label: "specs_condition", type: "select", options: ["Yeni", "İşlənmiş"] }
  ],
  oyunlar: [
    { name: "platform", label: "Platforma", type: "select", options: ["PS5", "Xbox", "PC", "Nintendo"] },
    { name: "condition", label: "specs_condition", type: "select", options: ["Yeni", "İşlənmiş"] }
  ]
};