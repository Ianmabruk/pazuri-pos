import { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Search, Package, Scan } from 'lucide-react';

export default function ProductGrid({ onAddToCart }) {
  const { products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [barcodeMode, setBarcodeMode] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const getStockStatus = (stock) => {
    if (stock <= 5) return { color: '#dc2626', text: 'LOW STOCK' };
    if (stock <= 10) return { color: '#d97706', text: 'LOW' };
    return { color: '#16a34a', text: 'IN STOCK' };
  };

  // Barcode scanner simulation
  useEffect(() => {
    if (barcodeMode && barcodeInput.length > 0) {
      const timer = setTimeout(() => {
        const product = products.find(p => 
          p.id.toString() === barcodeInput || 
          p.name.toLowerCase().includes(barcodeInput.toLowerCase())
        );
        if (product) {
          onAddToCart(product);
          setBarcodeInput('');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [barcodeInput, barcodeMode, products, onAddToCart]);

  return (
    <div className="card padded">
      <div style={{marginBottom: 16}}>
        <div style={{display: 'flex', gap: 12, marginBottom: 16}}>
          <div style={{position: 'relative', flex: 1}}>
            <Search size={20} style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b7280'}} />
            <input
              type="text"
              placeholder={barcodeMode ? "Scan or enter barcode..." : "Search products..."}
              value={barcodeMode ? barcodeInput : searchTerm}
              onChange={(e) => barcodeMode ? setBarcodeInput(e.target.value) : setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: 14,
                background: barcodeMode ? '#fef3c7' : '#fff'
              }}
              autoFocus={barcodeMode}
            />
          </div>
          <button
            onClick={() => setBarcodeMode(!barcodeMode)}
            className={barcodeMode ? 'btn btn-primary' : 'btn btn-outline'}
            style={{display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px'}}
          >
            <Scan size={18} />
            {barcodeMode ? 'Scanning' : 'Barcode'}
          </button>
        </div>

        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'btn btn-primary' : 'btn btn-outline'}
              style={{fontSize: 12, padding: '6px 12px'}}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16,
        maxHeight: 500,
        overflowY: 'auto'
      }}>
        {filteredProducts.map(product => {
          const stockStatus = getStockStatus(product.stock);
          return (
            <div
              key={product.id}
              className="card padded"
              style={{
                cursor: 'pointer',
                border: product.stock <= 5 ? '2px solid #dc2626' : '1px solid #e2e8f0',
                position: 'relative'
              }}
              onClick={() => onAddToCart(product)}
            >
              {product.stock <= 5 && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: '#dc2626',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700
                }}>
                  LOW STOCK
                </div>
              )}

              <div style={{
                width: '100%',
                height: 120,
                background: '#f3f4f6',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12
              }}>
                <Package size={48} style={{color: '#6b7280'}} />
              </div>

              <h3 style={{fontSize: 16, fontWeight: 700, marginBottom: 4}}>
                {product.name}
              </h3>

              <p style={{fontSize: 18, fontWeight: 800, color: '#059669', marginBottom: 8}}>
                KES {product.price}
              </p>

              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{
                  fontSize: 12,
                  color: stockStatus.color,
                  fontWeight: 600
                }}>
                  {stockStatus.text}
                </span>
                <span style={{fontSize: 12, color: '#6b7280'}}>
                  Stock: {product.stock}
                </span>
              </div>

              {product.category === 'Combo' && (
                <div style={{marginTop: 8, padding: 8, background: '#fef3c7', borderRadius: 4}}>
                  <p style={{fontSize: 12, margin: 0, color: '#92400e'}}>
                    Profit: KES {product.price - product.cost}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{textAlign: 'center', padding: 40, color: '#6b7280'}}>
          <Package size={48} style={{marginBottom: 16, color: '#d1d5db'}} />
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}
