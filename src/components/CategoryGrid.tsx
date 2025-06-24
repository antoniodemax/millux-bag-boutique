
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { id: 1, name: "Handbags for Women", image: "/lovable-uploads/3504aa42-e749-4c7b-b736-c8700d635528.png", available: true },
  { id: 2, name: "Sling Bags", image: "", available: true },
  { id: 3, name: "Large Bags", image: "", available: false },
  { id: 4, name: "Travel Bags", image: "", available: true },
  { id: 5, name: "Bridal Bags", image: "", available: false },
  { id: 6, name: "Gym Bags", image: "", available: false },
  { id: 7, name: "Laptop Bags", image: "", available: false },
  { id: 8, name: "Briefcase", image: "", available: false },
  { id: 9, name: "School Bags", image: "", available: false },
  { id: 10, name: "Lunch Bags", image: "", available: false },
  { id: 11, name: "Men Bags", image: "", available: false },
  { id: 12, name: "Baby Diaper Bags", image: "", available: false },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our extensive collection of bags designed for every lifestyle and occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.available ? `/shop?category=${category.id}` : "#"}
              className={`block ${!category.available ? "cursor-not-allowed" : ""}`}
            >
              <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
                category.available ? "hover:scale-105" : "opacity-75"
              }`}>
                <CardContent className="p-0">
                  <div className="bg-gray-200 h-48 flex items-center justify-center relative overflow-hidden">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={`${category.name} - Premium bags from MilluxCollections`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                        <p className="text-sm">{category.name}</p>
                      </div>
                    )}
                    {!category.available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Coming Soon</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-center">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
