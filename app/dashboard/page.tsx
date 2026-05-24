'use client'

import { useEffect, useState } from 'react'
import { Package, Tag, Users, Recycle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import '@/lib/i18n'
import api from '@/lib/api'

const COLORS = ['#16a34a', '#4ade80', '#86efac', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6']

function StatCard({ icon: Icon, label, value, accent }: any) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: accent + '22' }}>
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div>
        <div className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</div>
        <div className="font-display font-bold text-2xl mt-0.5" style={{ color: 'var(--text)' }}>{value}</div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products/stats').then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>

  const categoryData = Object.entries(stats?.products_by_category || {}).map(([name, value]) => ({ name, value }))
  const countryData = Object.entries(stats?.products_by_country || {}).map(([name, value]) => ({ name, value }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) return (
      <div className="card px-3 py-2 text-sm shadow-lg">
        <div className="font-display font-semibold" style={{ color: 'var(--text)' }}>{label}</div>
        <div style={{ color: 'var(--brand)' }}>{payload[0].value} {t('dashboard.products')}</div>
      </div>
    )
    return null
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>{t('dashboard.title')}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label={t('dashboard.totalProducts')} value={stats?.total_products ?? 0} accent="#16a34a" />
        <StatCard icon={Tag} label={t('dashboard.categories')} value={stats?.total_categories ?? 0} accent="#0ea5e9" />
        <StatCard icon={Users} label={t('dashboard.totalUsers')} value={stats?.total_users ?? 0} accent="#8b5cf6" />
        <StatCard icon={Recycle} label={t('dashboard.recycledMaterials')} value={`${stats?.recycled_material_percentage ?? 0}%`} accent="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>{t('dashboard.productsByCategory')}</h2>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>{t('dashboard.noData')}</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barCategoryGap="35%">
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-subtle)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--brand)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>{t('dashboard.productsByCountry')}</h2>
          {countryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>{t('dashboard.noData')}</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={countryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85}>
                  {countryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v} ${t('dashboard.products')}`]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
