import { useEffect, useState } from 'react'

const DropdownMenu = ({ label, icon, options, selected, onSelect, show, setShow }) => (
  <div className="relative">
    <button
      onClick={() => setShow(!show)}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all
        ${selected !== 'all'
          ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
          : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
        }`}
    >
      <span>{icon}</span>
      <span>{selected === 'all' ? label : selected}</span>
      <span className={`text-xs transition-transform ${show ? 'rotate-180' : ''}`}>▾</span>
    </button>

    {show && (
      <div className="absolute top-11 right-0 w-52 bg-[#18181f] border border-white/10 rounded-xl overflow-hidden z-30 shadow-xl">
        <button
          onClick={() => { onSelect('all'); setShow(false) }}
          className={`w-full text-left px-4 py-2.5 text-sm transition-colors
            ${selected === 'all' ? 'text-white bg-white/8' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          All {label}s
        </button>
        <div className="border-t border-white/8" />
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => { onSelect(opt); setShow(false) }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors capitalize
              ${selected === opt ? 'text-white bg-white/8' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    )}
  </div>
)

const ProductsList = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://api.freeapi.app/api/v1/public/randomproducts')
        const data = await res.json()
        const productsData = data.data.data
        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories([...new Set(productsData.map(p => p.category))])
        setBrands([...new Set(productsData.map(p => p.brand))])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let updated = [...products]
    if (selectedCategory !== 'all') updated = updated.filter(p => p.category === selectedCategory)
    if (selectedBrand !== 'all') updated = updated.filter(p => p.brand === selectedBrand)
    setFilteredProducts(updated)
  }, [selectedCategory, selectedBrand, products])

  return (
    <div
      className="min-h-screen bg-[#0c0c0f] px-6 py-10"
      onClick={() => { setShowCategoryDropdown(false); setShowBrandDropdown(false) }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs text-slate-600 uppercase tracking-widest mb-1">Store</p>
            <h1 className="text-2xl font-medium text-white">Products</h1>
          </div>

          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <DropdownMenu
              label="Category" icon="◈"
              options={categories} selected={selectedCategory}
              onSelect={setSelectedCategory}
              show={showCategoryDropdown} setShow={setShowCategoryDropdown}
            />
            <DropdownMenu
              label="Brand" icon="◇"
              options={brands} selected={selectedBrand}
              onSelect={setSelectedBrand}
              show={showBrandDropdown} setShow={setShowBrandDropdown}
            />
            {(selectedCategory !== 'all' || selectedBrand !== 'all') && (
              <button
                onClick={() => { setSelectedCategory('all'); setSelectedBrand('all') }}
                className="px-3 py-2 rounded-xl text-xs border border-white/10 text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filters + count */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-slate-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
          {selectedCategory !== 'all' && (
            <span className="text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 capitalize">
              {selectedCategory}
            </span>
          )}
          {selectedBrand !== 'all' && (
            <span className="text-xs px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300">
              {selectedBrand}
            </span>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-52 bg-white/8" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-white/10 rounded-full w-3/4" />
                    <div className="h-3 bg-white/8 rounded-full w-full" />
                    <div className="h-3 bg-white/8 rounded-full w-1/2" />
                  </div>
                </div>
              ))
            : filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/8 rounded-2xl overflow-hidden
                             hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-52 bg-white/5">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                    {/* Discount badge */}
                    {product.discountPercentage && (
                      <span className="absolute top-2.5 right-2.5 text-[11px] font-medium px-2 py-0.5
                                       rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                        -{Math.round(product.discountPercentage)}%
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="text-white text-sm font-medium leading-snug line-clamp-1">
                        {product.title}
                      </h2>
                      <span className="text-xs text-amber-400 flex items-center gap-0.5 fshrink-0">
                        ★ {product.rating}
                      </span>
                    </div>

                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="border-t border-white/5 pt-3 flex items-end justify-between">
                      <div>
                        <p className="text-white font-medium text-base">${product.price}</p>
                        <p className="text-slate-600 text-xs mt-0.5">{product.brand}</p>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full border border-white/10 text-slate-500 capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 text-sm">No products match your filters.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedBrand('all') }}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProductsList