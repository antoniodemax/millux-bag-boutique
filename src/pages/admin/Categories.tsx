import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, Category } from '@/services/categoryService';
import { deleteCategory } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import { Thead } from '@/components/ui/table';
import { Tbody } from '@/components/ui/table';
import { Tr } from '@/components/ui/table';
import { Th } from '@/components/ui/table';
import { Td } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useToast } from '@/hooks/use-toast';

export const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Card className="mb-6">
      <div className="flex flex-wrap items-center mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <div className="ml-auto flex items-center space-x-3">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => navigate('/admin/categories/new')}>
            New Category
          </Button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Available</Th>
              <Th>Order</Th>
              <Th className="text-center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories
              .filter(c =>
                c.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((category) => (
                <Tr key={category.id}>
                  <Td className="flex items-center space-x-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted flex items-center justify-center rounded">
                        No Image
                      </div>
                    )}
                  </Td>
                  <Td>{category.name}</Td>
                  <Td>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        category.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.available ? 'Yes' : 'No'}
                    </span>
                  </Td>
                  <Td>{category.orderNumber ?? '-'}</Td>
                  <Td className="text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this category?')) {
                          deleteCategory(category.id)
                            .then(() => {
                              toast({
                                title: 'Success',
                                description: 'Category deleted successfully',
                              });
                              fetchCategories();
                            })
                            .catch((err) => {
                              console.error(err);
                              toast({
                                title: 'Error',
                                description: 'Failed to delete category',
                                variant: 'destructive',
                              });
                            });
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
    </Card>
  );
};

export default AdminCategories;