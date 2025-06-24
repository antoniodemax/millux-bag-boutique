
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus } from "lucide-react";

// Mock products data
const mockProducts = [
  { id: 1, name: "Classic Leather Handbag", price: 2500, category: "Handbags for Women", description: "Elegant leather handbag" },
  { id: 2, name: "Designer Tote Bag", price: 2700, category: "Handbags for Women", description: "Spacious tote bag" },
  { id: 3, name: "Evening Clutch", price: 3500, category: "Handbags for Women", description: "Sophisticated clutch" },
];

const Admin = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null as File | null
  });

  const categories = [
    "Handbags for Women",
    "Sling Bags",
    "Large Bags",
    "Travel Bags",
    "Bridal Bags",
    "Gym Bags",
    "Laptop Bags",
    "Briefcase",
    "School Bags",
    "Lunch Bags",
    "Men Bags",
    "Baby Diaper Bags"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: Number(formData.price) }
          : p
      ));
      setEditingProduct(null);
    } else {
      // Add new product
      const newProduct = {
        id: products.length + 1,
        ...formData,
        price: Number(formData.price)
      };
      setProducts([...products, newProduct]);
      setIsAddingProduct(false);
    }
    setFormData({ name: "", price: "", category: "", description: "", image: null });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: null
    });
    setIsAddingProduct(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "", description: "", image: null });
    setEditingProduct(null);
    setIsAddingProduct(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your MilluxCollection inventory</p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Products</h2>
              <Button onClick={() => setIsAddingProduct(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Add/Edit Product Form */}
            {isAddingProduct && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price">Price (KSh)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="image">Product Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit">
                        {editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-lg font-bold text-gray-900">KSh {product.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category} className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900">{category}</h3>
                      <p className="text-sm text-gray-500">
                        {products.filter(p => p.category === category).length} products
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
