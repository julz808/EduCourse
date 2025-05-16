import { PRODUCTS } from "@/context/ProductContext";
import { useProduct } from "@/context/ProductContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductSelector() {
  const { selectedProduct, setSelectedProduct } = useProduct();

  // Handle product selection
  const handleProductChange = (slug: string) => {
    const product = PRODUCTS.find((p) => p.slug === slug);
    if (product) {
      setSelectedProduct(product);
    }
  };

  return (
    <Select
      value={selectedProduct?.slug}
      onValueChange={handleProductChange}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select product" />
      </SelectTrigger>
      <SelectContent>
        {PRODUCTS.map((product) => (
          <SelectItem key={product.slug} value={product.slug}>
            {product.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 