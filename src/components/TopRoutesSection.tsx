'use client'

interface RouteData {
  id: number
  destination: string
  price: string
  image: string
}

const routesData: RouteData[] = [
  {
    id: 1,
    destination: "Moscow → Dubai",
    price: "from €12,500",
    image: "#FF6B6B"
  },
  {
    id: 2,
    destination: "London → New York",
    price: "from €18,900",
    image: "#4ECDC4"
  },
  {
    id: 3,
    destination: "Paris → Monaco",
    price: "from €8,200",
    image: "#45B7D1"
  },
  {
    id: 4,
    destination: "Geneva → Courchevel",
    price: "from €6,800",
    image: "#96CEB4"
  },
  {
    id: 5,
    destination: "Nice → Ibiza",
    price: "from €9,400",
    image: "#FFEAA7"
  },
  {
    id: 6,
    destination: "Milan → Mykonos",
    price: "from €11,200",
    image: "#DDA0DD"
  },
  {
    id: 7,
    destination: "Zurich → St. Moritz",
    price: "from €5,900",
    image: "#98D8C8"
  },
  {
    id: 8,
    destination: "Vienna → Salzburg",
    price: "from €4,500",
    image: "#F7DC6F"
  },
  {
    id: 9,
    destination: "Rome → Sardinia",
    price: "from €7,800",
    image: "#BB8FCE"
  },
  {
    id: 10,
    destination: "Barcelona → Mallorca",
    price: "from €6,200",
    image: "#85C1E9"
  }
]

export default function TopRoutesSection() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-6xl font-medium text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
            Top Routes
          </h2>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-5 gap-6">
          {routesData.map((route) => (
            <div
              key={route.id}
              className="relative h-64 rounded-lg overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              style={{
                backgroundColor: route.image
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold mb-1 drop-shadow-lg">
                  {route.destination}
                </h3>
                <p className="text-xl font-bold drop-shadow-lg">
                  {route.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}