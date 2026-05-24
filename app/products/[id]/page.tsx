'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Trash2, CheckCircle, XCircle, Recycle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'
import api from '@/lib/api'
import { useAuthStore } from '@/store'
import ProductFormModal from '@/components/ProductFormModal'

function Field({ label, value }: any) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>{value || '—'}</div>
    </div>
  )
}

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'admin'
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)

  const load = async () => {
    setLoading(true)
    try { const { data } = await api.get(`/products/${id}`); setProduct(data) }
    catch { toast.error(t('productDetail.notFound')); router.push('/products') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const handleDelete = async () => {
    if (!confirm(t('productDetail.deleteConfirm', { name: product.name }))) return
    try { await api.delete(`/products/${id}`); toast.success(t('productDetail.deleteSuccess')); router.push('/products') }
    catch { toast.error(t('productDetail.deleteFailed')) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/products" className="p-2 rounded-lg hover:opacity-70 transition" style={{ color: 'var(--text-muted)', background: 'var(--bg-subtle)' }}><ArrowLeft size={16} /></Link>
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>{product.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{t('productDetail.subtitle')}</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-2" onClick={() => setShowEdit(true)}><Pencil size={14} /> {t('productDetail.edit')}</button>
            <button className="btn-danger flex items-center gap-2" onClick={handleDelete}><Trash2 size={14} /> {t('productDetail.delete')}</button>
          </div>
        )}
      </div>

      <div className="card p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
        <Field label={t('productDetail.fields.brand')} value={product.brand} />
        <Field label={t('productDetail.fields.category')} value={product.category} />
        <Field label={t('productDetail.fields.country')} value={product.country_of_production} />
        <Field label={t('productDetail.fields.date')} value={product.production_date} />
        <Field label={t('productDetail.fields.washTemp')} value={t(`productDetail.wash.${product.wash_temperature}`)} />
        <div>
          <div className="label">{t('productDetail.fields.dryCleaning')}</div>
          {product.dry_cleaning
            ? <span className="flex items-center gap-1.5 text-sm font-medium text-green-600"><CheckCircle size={15} /> {t('productDetail.fields.suitable')}</span>
            : <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-muted)' }}><XCircle size={15} /> {t('productDetail.fields.notSuitable')}</span>
          }
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b"><h2 className="font-display font-semibold text-sm" style={{ color: 'var(--text)' }}>{t('productDetail.materials.title')}</h2></div>
        {!product.materials?.length ? (
          <div className="px-6 py-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>{t('productDetail.materials.noMaterials')}</div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b" style={{ background: 'var(--bg-subtle)' }}>{[t('productDetail.materials.name'), t('productDetail.materials.percentage'), t('productDetail.materials.recycled')].map((h) => <th key={h} className="text-left px-5 py-3 text-xs font-display font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {product.materials.map((m: any, i: number) => (
                <tr key={i} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-5 py-3.5 font-medium text-sm" style={{ color: 'var(--text)' }}>{m.name}</td>
                  <td className="px-5 py-3.5 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
                    {m.percentage}%
                    <div className="mt-1 h-1.5 rounded-full w-24 overflow-hidden" style={{ background: 'var(--bg-subtle)' }}>
                      <div className="h-full rounded-full" style={{ width: `${m.percentage}%`, background: 'var(--brand)' }} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm">{m.is_recycled ? <span className="flex items-center gap-1.5 text-green-600"><Recycle size={14} /> {t('productDetail.materials.yes')}</span> : <span style={{ color: 'var(--text-muted)' }}>{t('productDetail.materials.no')}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {product.additional_notes && <div className="card p-5"><div className="label">{t('productDetail.notes')}</div><p className="text-sm mt-1" style={{ color: 'var(--text)' }}>{product.additional_notes}</p></div>}
      <div className="flex gap-6 text-xs font-mono" style={{ color: 'var(--text-muted)' }}><span>ID: {product.id}</span><span>{new Date(product.created_at).toLocaleString()}</span></div>

      {showEdit && <ProductFormModal product={product} onClose={() => setShowEdit(false)} onSaved={() => { setShowEdit(false); load() }} />}
    </div>
  )
}
