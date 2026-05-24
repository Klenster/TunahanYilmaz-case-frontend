'use client'

import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'
import api from '@/lib/api'

const CATEGORIES = ['tshirt', 'pants', 'jacket', 'underwear', 'dress', 'other']
const WASH_TEMPS = ['30', '40', '60', 'none']

const emptyMaterial = () => ({ name: '', percentage: '', is_recycled: false })
const emptyForm = () => ({ name: '', brand: '', category: 'tshirt', country_of_production: '', production_date: '', wash_temperature: '30', dry_cleaning: false, additional_notes: '', materials: [emptyMaterial()] })

function fromProduct(p: any) {
  return {
    name: p.name, brand: p.brand, category: p.category,
    country_of_production: p.country_of_production, production_date: p.production_date,
    wash_temperature: p.wash_temperature, dry_cleaning: p.dry_cleaning,
    additional_notes: p.additional_notes || '',
    materials: p.materials.length ? p.materials.map((m: any) => ({ name: m.name, percentage: String(m.percentage), is_recycled: m.is_recycled })) : [emptyMaterial()],
  }
}

export default function ProductFormModal({ product, onClose, onSaved }: any) {
  const { t } = useTranslation()
  const [form, setForm] = useState(product ? fromProduct(product) : emptyForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }))
  const setCheck = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.checked }))
  const setMaterial = (i: number, k: string) => (e: any) => {
    setForm((f: any) => {
      const mats = [...f.materials]
      mats[i] = { ...mats[i], [k]: k === 'is_recycled' ? e.target.checked : e.target.value }
      return { ...f, materials: mats }
    })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = t('productForm.errors.name')
    if (!form.brand.trim()) errs.brand = t('productForm.errors.brand')
    if (!form.country_of_production.trim()) errs.country = t('productForm.errors.country')
    if (!form.production_date) errs.date = t('productForm.errors.date')
    if (form.materials.length > 0) {
      const total = form.materials.reduce((s: number, m: any) => s + (parseFloat(m.percentage) || 0), 0)
      if (Math.abs(total - 100) > 0.01) errs.materials = t('productForm.errors.materials', { total: total.toFixed(1) })
      if (form.materials.some((m: any) => !m.name.trim())) errs.materials = errs.materials || t('productForm.errors.materialName')
    }
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const payload = { ...form, materials: form.materials.map((m: any) => ({ ...m, percentage: parseFloat(m.percentage) })) }
      if (product) { await api.put(`/products/${product.id}`, payload); toast.success(t('productForm.updateSuccess')) }
      else { await api.post('/products/', payload); toast.success(t('productForm.createSuccess')) }
      onSaved()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('productForm.saveFailed'))
    } finally { setLoading(false) }
  }

  const totalPct = form.materials.reduce((s: number, m: any) => s + (parseFloat(m.percentage) || 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>{product ? t('productForm.editTitle') : t('productForm.newTitle')}</h2>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">{t('productForm.name')}</label><input className="input" value={form.name} onChange={set('name')} placeholder={t('productForm.namePlaceholder')} />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
            <div><label className="label">{t('productForm.brand')}</label><input className="input" value={form.brand} onChange={set('brand')} placeholder={t('productForm.brandPlaceholder')} />{errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}</div>
            <div><label className="label">{t('productForm.category')}</label><select className="input appearance-none cursor-pointer" value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c} value={c}>{t(`products.categories.${c}`)}</option>)}</select></div>
            <div><label className="label">{t('productForm.country')}</label><input className="input" value={form.country_of_production} onChange={set('country_of_production')} placeholder={t('productForm.countryPlaceholder')} />{errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}</div>
            <div><label className="label">{t('productForm.date')}</label><input className="input" type="date" value={form.production_date} onChange={set('production_date')} />{errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}</div>
            <div><label className="label">{t('productForm.washTemp')}</label><select className="input appearance-none cursor-pointer" value={form.wash_temperature} onChange={set('wash_temperature')}>{WASH_TEMPS.map((temp) => <option key={temp} value={temp}>{temp === 'none' ? t('productForm.noWash') : `${temp}°C`}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="dry" checked={form.dry_cleaning} onChange={setCheck('dry_cleaning')} className="w-4 h-4 accent-green-600" />
            <label htmlFor="dry" className="text-sm cursor-pointer" style={{ color: 'var(--text)' }}>{t('productForm.dryCleaning')}</label>
          </div>
          <div><label className="label">{t('productForm.notes')}</label><textarea className="input resize-none" rows={2} value={form.additional_notes} onChange={set('additional_notes')} placeholder={t('productForm.notesPlaceholder')} /></div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">{t('productForm.materials')}</label>
              <span className="text-xs font-mono" style={{ color: totalPct === 100 ? 'var(--brand)' : 'var(--warning)' }}>{totalPct.toFixed(1)}% / 100%</span>
            </div>
            {errors.materials && <p className="text-xs text-red-500 mb-2">{errors.materials}</p>}
            <div className="space-y-2">
              {form.materials.map((m: any, i: number) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className="input" placeholder={t('productForm.materialName')} value={m.name} onChange={setMaterial(i, 'name')} />
                  <input className="input w-24 shrink-0" type="number" min="0" max="100" step="0.1" placeholder="%" value={m.percentage} onChange={setMaterial(i, 'percentage')} />
                  <label className="flex items-center gap-1.5 text-xs whitespace-nowrap cursor-pointer shrink-0" style={{ color: 'var(--text-muted)' }}>
                    <input type="checkbox" checked={m.is_recycled} onChange={setMaterial(i, 'is_recycled')} className="w-3.5 h-3.5 accent-green-600" />
                    {t('productForm.recycled')}
                  </label>
                  {form.materials.length > 1 && <button type="button" onClick={() => setForm((f: any) => ({ ...f, materials: f.materials.filter((_: any, idx: number) => idx !== i) }))} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 size={14} /></button>}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setForm((f: any) => ({ ...f, materials: [...f.materials, emptyMaterial()] }))} className="mt-2 flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--brand)' }}>
              <Plus size={13} /> {t('productForm.addMaterial')}
            </button>
          </div>
          <div className="flex gap-3 pt-2 border-t">
            <button type="button" className="btn-secondary" onClick={onClose}>{t('productForm.cancel')}</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? t('productForm.saving') : product ? t('productForm.update') : t('productForm.create')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
