'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, ShieldCheck, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n'
import api from '@/lib/api'
import { useAuthStore } from '@/store'

export default function UsersPage() {
  const router = useRouter()

  const { t } = useTranslation()
  const currentUser = useAuthStore((s) => s.user)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Auditor direkt URL'den girerse login'e yönlendir
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [currentUser])

  const load = async () => {
    setLoading(true)
    try { const { data } = await api.get('/users/'); setUsers(data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleRoleChange = async (user: any, newRole: string) => {
    try { await api.patch(`/users/${user.id}/role`, { role: newRole }); toast.success(t('users.roleUpdate', { name: user.full_name, role: newRole })); load() }
    catch (err: any) { toast.error(err.response?.data?.detail || t('users.roleFailed')) }
  }

  const handleDelete = async (user: any) => {
    if (!confirm(t('users.deleteConfirm', { name: user.full_name }))) return
    try { await api.delete(`/users/${user.id}`); toast.success(t('users.deleteSuccess')); load() }
    catch (err: any) { toast.error(err.response?.data?.detail || t('users.deleteFailed')) }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text)' }}>{t('users.title')}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('users.subtitle_other', { count: users.length })}</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ background: 'var(--bg-subtle)' }}>
                {[t('users.columns.name'), t('users.columns.email'), t('users.columns.role'), t('users.columns.joined'), t('users.columns.actions')].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-display font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === currentUser?.id
                return (
                  <tr key={u.id} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3.5 font-display font-medium text-sm" style={{ color: 'var(--text)' }}>
                      {u.full_name}{isSelf && <span className="ml-2 text-xs font-mono" style={{ color: 'var(--brand)' }}>{t('users.you')}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={u.role === 'admin' ? 'badge-admin' : 'badge-auditor'}>
                        {u.role === 'admin' ? <ShieldCheck size={11} /> : <Eye size={11} />}{u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      {!isSelf && (
                        <div className="flex items-center gap-2">
                          <select className="input py-1 text-xs w-28" value={u.role} onChange={(e) => handleRoleChange(u, e.target.value)}>
                            <option value="auditor">auditor</option>
                            <option value="admin">admin</option>
                          </select>
                          <button onClick={() => handleDelete(u)} className="p-1.5 text-red-500 hover:text-red-700 transition"><Trash2 size={14} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
