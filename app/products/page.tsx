'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Trash2, Eye, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'
import api from '@/lib/api'
import { useAuthStore } from '@/store'
import ProductFormModal from '@/components/ProductFormModal'

export default function ProductsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (search) params.search = search
      if (category) params.category = category
      const [p, c] = await Promise.all([api.get('/products/', { params }), api.get('/products/categories')])
      setProducts(p.data)
      setCategories(c.data)
    } finally { setLoading(false) }
  }, [search, category])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(t('products.delete.confirm', { name }))) return
    try { await api.delete(`/products/${id}`); toast.success(t('products.delete.success')); load() }
    catch { toast.error(t('products.delete.failed')) }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>{t('products.title')}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('products.subtitle_other', { count: products.length })}</p>
        </div>
        {isAdmin && (
          <button className="btn-primary flex items-center gap-2" onClick={() => { setEditProduct(null); setShowModal(true) }}>
            <Plus size={16} /> {t('products.newProduct')}
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input className="input pl-9" placeholder={t('products.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <select className="input pl-9 pr-8 appearance-none cursor-pointer" value={category} onChange={(e) => setCategory(e.target.value)} style={{ minWidth: 160 }}>
            <option value="">{t('products.allCategories')}</option>
            {categories.map((c) => <option key={c} value={c}>{t(`products.categories.${c}`, c)}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-sm" style={{ color: 'var(--text-muted)' }}>{t('products.noProducts')} {isAdmin && t('products.createFirst')}</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ background: 'var(--bg-subtle)' }}>
                {[t('products.columns.name'), t('products.columns.brand'), t('products.columns.category'), t('products.columns.country'), t('products.columns.date'), ''].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-display font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:opacity-80 transition-opacity" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-5 py-3.5 font-display font-medium text-sm" style={{ color: 'var(--text)' }}>{p.name}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>{p.brand}</td>
                  <td className="px-5 py-3.5 text-sm">
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                      {t(`products.categories.${p.category}`, p.category)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>{p.country_of_production}</td>
                  <td className="px-5 py-3.5 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{p.production_date}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/products/${p.id}`} className="p-1.5 rounded-lg transition hover:opacity-70" style={{ color: 'var(--brand)' }}><Eye size={15} /></Link>
                      {isAdmin && (
                        <>
                          <button onClick={() => { setEditProduct(p); setShowModal(true) }} className="p-1.5 rounded-lg transition hover:opacity-70" style={{ color: 'var(--text-muted)' }}><Pencil size={15} /></button>
                          <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 rounded-lg transition hover:opacity-70 text-red-500"><Trash2 size={15} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <ProductFormModal product={editProduct} onClose={() => { setShowModal(false); setEditProduct(null) }} onSaved={() => { setShowModal(false); setEditProduct(null); load() }} />}
    </div>
  )
}
