'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    currency: 'TRY',
    sku: '',
    image: '',
    images: [] as string[],
    categoryId: '',
  });
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/admin/products?limit=1000', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store', // Prevent caching
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure we always have an array
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        console.log('[AdminProductsPage] Products loaded:', productsArray.length);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[AdminProductsPage] Failed to fetch products:', errorData);
        setProducts([]);
        alert(`Ürünler yüklenemedi: ${errorData.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('[AdminProductsPage] Failed to fetch products:', error);
      setProducts([]);
      alert('Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('[AdminProductsPage] Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          images: formData.images.filter((img) => img.trim() !== ''),
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          slug: '',
          description: '',
          price: '',
          currency: 'TRY',
          sku: '',
          image: '',
          images: [],
          categoryId: '',
        });
        alert(editingProduct ? 'Ürün başarıyla güncellendi!' : 'Ürün başarıyla oluşturuldu!');
        fetchProducts();
      } else {
        const error = await response.json();
        alert(error.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('[AdminProductsPage] Failed to save product:', error);
      alert('İşlem başarısız');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      currency: product.currency || 'TRY',
      sku: product.sku || '',
      image: product.image || '',
      images: product.images || [],
      categoryId: product.categoryId || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Ürün başarıyla silindi!');
        fetchProducts();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Silme işlemi başarısız' }));
        alert(errorData.error || 'Silme işlemi başarısız');
      }
    } catch (error) {
      console.error('[AdminProductsPage] Failed to delete product:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Ürün Yönetimi</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              slug: '',
              description: '',
              price: '',
              currency: 'TRY',
              sku: '',
              image: '',
              images: [],
              categoryId: '',
            });
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          + Yeni Ürün Ekle
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Toplam {products.length} ürün bulundu
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                        Görsel Yok
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.description.substring(0, 50)}...
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {typeof product.price === 'number' 
                        ? product.price.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : product.price} {product.currency || 'TRY'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {product.category?.name || product.categoryId || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.sku || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-primary-600 hover:text-primary-900 px-2 py-1 rounded hover:bg-primary-50"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ürün Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: editingProduct ? formData.slug : generateSlug(e.target.value),
                    });
                  }}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ana Görsel</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const token = localStorage.getItem('accessToken');
                          if (!token) {
                            alert('Lütfen giriş yapın');
                            return;
                          }

                          const uploadFormData = new FormData();
                          uploadFormData.append('file', file);
                          uploadFormData.append('folder', 'products');

                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                            body: uploadFormData,
                          });

                          if (response.ok) {
                            const data = await response.json();
                            setFormData({ ...formData, image: data.url });
                            alert('Görsel başarıyla yüklendi!');
                          } else {
                            const error = await response.json();
                            alert(error.error || 'Görsel yüklenemedi');
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Görsel yüklenirken bir hata oluştu');
                        }
                      }
                    }}
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Maksimum 5MB, Desteklenen formatlar: JPEG, PNG, WebP, GIF
                  </p>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        Görseli Kaldır
                      </button>
                    </div>
                  )}
                  <div className="mt-2">
                    <label className="text-xs text-gray-500">veya URL ile ekle:</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="input w-full mt-1"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ek Görseller</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        try {
                          const token = localStorage.getItem('accessToken');
                          if (!token) {
                            alert('Lütfen giriş yapın');
                            return;
                          }

                          const uploadedUrls: string[] = [];
                          for (const file of files) {
                            const uploadFormData = new FormData();
                            uploadFormData.append('file', file);
                            uploadFormData.append('folder', 'products');

                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                              body: uploadFormData,
                            });

                            if (response.ok) {
                              const data = await response.json();
                              uploadedUrls.push(data.url);
                            } else {
                              const error = await response.json();
                              alert(`${file.name}: ${error.error || 'Yüklenemedi'}`);
                            }
                          }

                          if (uploadedUrls.length > 0) {
                            setFormData({
                              ...formData,
                              images: [...formData.images, ...uploadedUrls],
                            });
                            alert(`${uploadedUrls.length} görsel başarıyla yüklendi!`);
                          }
                        } catch (error) {
                          console.error('Upload error:', error);
                          alert('Görseller yüklenirken bir hata oluştu');
                        }
                      }
                    }}
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Birden fazla görsel seçebilirsiniz. Maksimum 5MB, Desteklenen formatlar: JPEG, PNG, WebP, GIF
                  </p>
                  {formData.images.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={img}
                              alt={`Preview ${idx + 1}`}
                              className="w-24 h-24 object-cover rounded border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  images: formData.images.filter((_, i) => i !== idx),
                                });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    <label className="text-xs text-gray-500">veya URL'ler ile ekle (her satıra bir tane):</label>
                    <textarea
                      value={formData.images.join('\n')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          images: e.target.value.split('\n').filter((url) => url.trim() !== ''),
                        })
                      }
                      className="input w-full mt-1"
                      rows={3}
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fiyat *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Para Birimi</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="input w-full"
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="input w-full"
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                  }}
                  className="btn btn-outline"
                >
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
