
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About MilluxCollections</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crafting premium bags that combine style, functionality, and durability for the modern lifestyle.
          </p>
        </div>

        {/* Brand Story */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                Founded with a passion for quality and design, MilluxCollections began as a vision to create 
                bags that seamlessly blend elegance with everyday functionality. We believe that a great bag 
                is more than just an accessory – it's an extension of your personality and a companion for 
                life's adventures.
              </p>
              <p className="text-gray-600 mb-4">
                Our curated collection features carefully selected pieces that meet our high standards for 
                quality, craftsmanship, and style. From professional laptop bags to elegant evening clutches, 
                each piece in our collection is chosen with the modern consumer in mind.
              </p>
              <p className="text-gray-600">
                At MilluxCollections, we're committed to providing exceptional customer service and ensuring 
                that every purchase is a delightful experience. We believe in building lasting relationships 
                with our customers, offering guidance and support to help you find the perfect bag for your needs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Founder Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet Our Founder</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-1">
                <div className="bg-gray-200 h-64 w-full rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Founder Photo</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Milkah Adhiambo</h3>
                <p className="text-gray-600 mb-4">
                  With over a decade of experience in fashion and retail, Milkah Adhiambo founded MilluxCollections 
                  with a mission to make premium bags accessible to everyone. Her eye for quality and 
                  passion for customer satisfaction drives every aspect of our business.
                </p>
                <p className="text-gray-600">
                  "I believe that the right bag can transform not just your outfit, but your entire day. 
                  That's why we're committed to offering pieces that are both beautiful and functional." - Sarah
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every bag is carefully inspected to meet our high standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Focus</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to help you find the perfect bag for your needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Style & Function</h3>
              <p className="text-gray-600">
                Beautiful design meets practical functionality in every piece we offer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
