import axios from 'axios';

// Using a mock API base URL - in a real app, this would be your actual API endpoint
export const api = axios.create({
  baseURL: 'https://api.example.com'
});

// Simulated API responses
const mockData = {
  products: [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics',
      tags: ['wireless', 'audio', 'premium'],
      featured: true
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      description: 'Advanced smartwatch with health tracking features',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      category: 'Electronics',
      tags: ['smartwatch', 'fitness', 'tech'],
      featured: true
    }
  ],
  categories: [
    { id: '1', name: 'Electronics', description: 'Electronic devices and accessories' },
    { id: '2', name: 'Fashion', description: 'Clothing and accessories' },
    { id: '3', name: 'Home & Living', description: 'Home decor and furniture' }
  ]
};

// Mock API methods
export const mockApi = {
  get: async (endpoint: string) => {
    switch (endpoint) {
      case '/products':
        return { data: mockData.products };
      case '/categories':
        return { data: mockData.categories };
      default:
        throw new Error('Not found');
    }
  },
  post: async (endpoint: string, data: any) => {
    switch (endpoint) {
      case '/auth/login':
        return {
          data: {
            id: '1',
            name: 'John Doe',
            email: data.email,
            role: 'user',
            token: 'mock-token'
          }
        };
      case '/auth/register':
        return {
          data: {
            id: '2',
            name: data.name,
            email: data.email,
            role: 'user',
            token: 'mock-token'
          }
        };
      default:
        throw new Error('Not found');
    }
  }
};

export default mockApi;