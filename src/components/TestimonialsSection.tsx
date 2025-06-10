
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "The quality of the handbag I purchased is exceptional. It's stylish, durable, and perfect for my daily needs. Highly recommend MilluxCollections!",
  },
  {
    id: 2,
    name: "Grace Mwangi",
    location: "Mombasa, Kenya",
    rating: 5,
    text: "Amazing customer service and beautiful bags! The travel bag I bought has been perfect for all my trips. Great value for money.",
  },
  {
    id: 3,
    name: "Mary Wanjiku",
    location: "Kisumu, Kenya",
    rating: 5,
    text: "I love my new laptop bag! It's professional, functional, and gets so many compliments. MilluxCollections exceeded my expectations.",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers about their MilluxCollections experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
