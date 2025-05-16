import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Product = {
  slug: string;
  name: string;
};

export const PRODUCTS: Product[] = [
  { slug: "edutest", name: "EduTest Scholarship" },
  { slug: "acer", name: "ACER Scholarship" },
  { slug: "naplan-year5", name: "Year 5 NAPLAN" },
  { slug: "naplan-year7", name: "Year 7 NAPLAN" },
  { slug: "vic-selective", name: "VIC Selective Entry" },
  { slug: "nsw-selective", name: "NSW Selective Entry" }
];

interface ProductContextProps {
  selectedProduct: Product;
  setSelectedProduct: (product: Product) => void;
  products: Product[];
}

const defaultProduct = PRODUCTS[0];

const ProductContext = createContext<ProductContextProps>({
  selectedProduct: defaultProduct,
  setSelectedProduct: () => {},
  products: PRODUCTS
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(defaultProduct);
  
  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedProduct = localStorage.getItem('selectedProduct');
      if (savedProduct) {
        const parsed = JSON.parse(savedProduct);
        // Validate that the parsed product has the expected structure
        if (parsed && typeof parsed === 'object' && 'slug' in parsed && 'name' in parsed) {
          setSelectedProduct(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading product from localStorage:', error);
      // Fallback to default product
      setSelectedProduct(defaultProduct);
    }
  }, []);

  // Save to localStorage when product changes
  useEffect(() => {
    try {
      localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
    } catch (error) {
      console.error('Error saving product to localStorage:', error);
    }
  }, [selectedProduct]);

  return (
    <ProductContext.Provider value={{ 
      selectedProduct, 
      setSelectedProduct, 
      products: PRODUCTS 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  // Context is now initialized with defaults, so this shouldn't happen
  if (!context) {
    console.error('useProduct must be used within a ProductProvider');
    return { 
      selectedProduct: defaultProduct, 
      setSelectedProduct: () => {}, 
      products: PRODUCTS 
    };
  }
  return context;
}; 