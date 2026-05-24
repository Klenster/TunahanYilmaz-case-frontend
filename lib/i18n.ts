'use client'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const tr = {
  nav: {
    dashboard: 'Panel', products: 'Ürünler', users: 'Kullanıcılar',
    profile: 'Profil', logout: 'Çıkış', lightMode: 'Açık tema', darkMode: 'Koyu tema',
  },
  login: {
    title: 'Giriş yap', subtitle: 'Pasaport panelinize erişin',
    email: 'E-posta', password: 'Şifre', submit: 'Giriş yap', loading: 'Giriş yapılıyor...',
    noAccount: 'Hesabınız yok mu?', createOne: 'Oluşturun',
    welcome: 'Tekrar hoş geldiniz, {{name}}!', failed: 'Giriş başarısız',
    errors: { email: 'E-posta gerekli', emailInvalid: 'Geçersiz e-posta', password: 'Şifre gerekli' },
  },
  register: {
    title: 'Hesap oluştur', subtitle: 'Denetçi olarak kayıt olacaksınız',
    fullName: 'Ad soyad', email: 'E-posta', password: 'Şifre', confirmPassword: 'Şifre tekrar',
    submit: 'Hesap oluştur', loading: 'Oluşturuluyor...', hasAccount: 'Zaten hesabınız var mı?',
    signIn: 'Giriş yapın', success: 'Hesap oluşturuldu! Lütfen giriş yapın.', failed: 'Kayıt başarısız',
    errors: {
      name: 'Ad en az 2 karakter olmalı', email: 'Geçerli e-posta gerekli',
      password: 'En az 8 karakter', passwordUpper: 'En az bir büyük harf içermeli',
      passwordNumber: 'En az bir rakam içermeli', confirm: 'Şifreler eşleşmiyor',
    },
  },
  dashboard: {
    title: 'Panel', subtitle: 'Tekstil pasaport kayıt defterine genel bakış',
    totalProducts: 'Toplam Ürün', categories: 'Kategori', totalUsers: 'Toplam Kullanıcı',
    recycledMaterials: 'Geri Dönüştürülmüş', productsByCategory: 'Kategoriye Göre Ürünler',
    productsByCountry: 'Ülkeye Göre Ürünler', noData: 'Henüz veri yok', products: 'ürün',
  },
  products: {
    title: 'Ürünler', subtitle_other: '{{count}} pasaport kayıtlı',
    newProduct: 'Yeni ürün', searchPlaceholder: 'Ad veya marka ara...',
    allCategories: 'Tüm kategoriler', noProducts: 'Ürün bulunamadı.', createFirst: 'İlk ürün pasaportunuzu oluşturun.',
    columns: { name: 'Ad', brand: 'Marka', category: 'Kategori', country: 'Ülke', date: 'Tarih' },
    delete: { confirm: '"{{name}}" silinsin mi?', success: 'Ürün silindi', failed: 'Silme başarısız' },
    categories: { tshirt: 'Tişört', pants: 'Pantolon', jacket: 'Ceket', underwear: 'İç Giyim', dress: 'Elbise', other: 'Diğer' },
  },
  productForm: {
    newTitle: 'Yeni Ürün', editTitle: 'Ürünü Düzenle',
    name: 'Ürün adı', namePlaceholder: 'Organik Pamuk Tişört',
    brand: 'Marka', brandPlaceholder: 'EcoWear', category: 'Kategori',
    country: 'Üretim ülkesi', countryPlaceholder: 'Türkiye', date: 'Üretim tarihi',
    washTemp: 'Yıkama sıcaklığı', noWash: 'Yıkanamaz', dryCleaning: 'Kuru temizleme uygun',
    notes: 'Ek notlar', notesPlaceholder: 'İsteğe bağlı...',
    materials: 'Materyal kompozisyonu', materialName: 'Materyal (örn. Pamuk)', recycled: 'Geri dönüştürülmüş',
    addMaterial: 'Materyal ekle', cancel: 'İptal', create: 'Oluştur', update: 'Güncelle', saving: 'Kaydediliyor...',
    createSuccess: 'Ürün oluşturuldu', updateSuccess: 'Ürün güncellendi', saveFailed: 'Kayıt başarısız',
    errors: { name: 'Gerekli', brand: 'Gerekli', country: 'Gerekli', date: 'Gerekli', materials: 'Toplam %100 olmalı (şu an {{total}}%)', materialName: 'Tüm materyallerin adı olmalı' },
  },
  productDetail: {
    subtitle: 'Dijital Ürün Pasaportu', edit: 'Düzenle', delete: 'Sil',
    deleteConfirm: '"{{name}}" silinsin mi?', deleteSuccess: 'Ürün silindi', deleteFailed: 'Silme başarısız', notFound: 'Ürün bulunamadı',
    fields: { brand: 'Marka', category: 'Kategori', country: 'Üretim ülkesi', date: 'Üretim tarihi', washTemp: 'Yıkama sıcaklığı', dryCleaning: 'Kuru temizleme', suitable: 'Uygun', notSuitable: 'Uygun değil' },
    materials: { title: 'Materyal Kompozisyonu', noMaterials: 'Materyal kaydedilmemiş', name: 'Materyal', percentage: 'Yüzde', recycled: 'Geri Dönüştürülmüş', yes: 'Evet', no: 'Hayır' },
    notes: 'Ek notlar',
    wash: { '30': '30°C', '40': '40°C', '60': '60°C', none: 'Yıkanamaz' },
  },
  users: {
    title: 'Kullanıcılar & Roller', subtitle_other: '{{count}} kayıtlı kullanıcı', you: '(siz)',
    columns: { name: 'Ad', email: 'E-posta', role: 'Rol', joined: 'Katılım', actions: 'İşlemler' },
    roleUpdate: '{{name}} artık {{role}}', roleFailed: 'Rol güncellenemedi',
    deleteConfirm: '{{name}} silinsin mi?', deleteSuccess: 'Kullanıcı silindi', deleteFailed: 'Silme başarısız',
  },
  profile: {
    title: 'Profil', role: 'Rol', userId: 'Kullanıcı ID', changePassword: 'Şifre değiştir',
    currentPassword: 'Mevcut şifre', newPassword: 'Yeni şifre', confirmPassword: 'Yeni şifre tekrar',
    update: 'Şifreyi güncelle', updating: 'Güncelleniyor...', updateSuccess: 'Şifre güncellendi', updateFailed: 'Şifre güncellenemedi',
    errors: { current: 'Gerekli', next: 'En az 8 karakter', nextUpper: 'Büyük harf içermeli', nextNumber: 'Rakam içermeli', confirm: 'Şifreler eşleşmiyor' },
  },
  common: { loading: 'Yükleniyor...', back: 'Geri', cancel: 'İptal', delete: 'Sil', edit: 'Düzenle' },
}

const en = {
  nav: { dashboard: 'Dashboard', products: 'Products', users: 'Users', profile: 'Profile', logout: 'Logout', lightMode: 'Light mode', darkMode: 'Dark mode' },
  login: {
    title: 'Sign in', subtitle: 'Access your passport dashboard',
    email: 'Email', password: 'Password', submit: 'Sign in', loading: 'Signing in...',
    noAccount: 'No account?', createOne: 'Create one', welcome: 'Welcome back, {{name}}!', failed: 'Login failed',
    errors: { email: 'Email required', emailInvalid: 'Invalid email', password: 'Password required' },
  },
  register: {
    title: 'Create account', subtitle: "You'll be registered as an auditor",
    fullName: 'Full name', email: 'Email', password: 'Password', confirmPassword: 'Confirm password',
    submit: 'Create account', loading: 'Creating...', hasAccount: 'Already have an account?', signIn: 'Sign in',
    success: 'Account created! Please sign in.', failed: 'Registration failed',
    errors: { name: 'Min 2 characters', email: 'Valid email required', password: 'Min 8 characters', passwordUpper: 'Must contain uppercase', passwordNumber: 'Must contain a number', confirm: 'Passwords do not match' },
  },
  dashboard: {
    title: 'Dashboard', subtitle: 'Overview of your textile passport registry',
    totalProducts: 'Total Products', categories: 'Categories', totalUsers: 'Total Users',
    recycledMaterials: 'Recycled Materials', productsByCategory: 'Products by Category',
    productsByCountry: 'Products by Country', noData: 'No data yet', products: 'products',
  },
  products: {
    title: 'Products', subtitle_other: '{{count}} passports registered',
    newProduct: 'New product', searchPlaceholder: 'Search by name or brand...',
    allCategories: 'All categories', noProducts: 'No products found.', createFirst: 'Create your first product passport.',
    columns: { name: 'Name', brand: 'Brand', category: 'Category', country: 'Country', date: 'Date' },
    delete: { confirm: 'Delete "{{name}}"?', success: 'Product deleted', failed: 'Delete failed' },
    categories: { tshirt: 'T-Shirt', pants: 'Pants', jacket: 'Jacket', underwear: 'Underwear', dress: 'Dress', other: 'Other' },
  },
  productForm: {
    newTitle: 'New Product', editTitle: 'Edit Product',
    name: 'Product name', namePlaceholder: 'Organic Cotton T-Shirt',
    brand: 'Brand', brandPlaceholder: 'EcoWear', category: 'Category',
    country: 'Country of production', countryPlaceholder: 'Turkey', date: 'Production date',
    washTemp: 'Wash temperature', noWash: 'Do not wash', dryCleaning: 'Dry cleaning suitable',
    notes: 'Additional notes', notesPlaceholder: 'Optional...',
    materials: 'Material composition', materialName: 'Material (e.g. Cotton)', recycled: 'Recycled',
    addMaterial: 'Add material', cancel: 'Cancel', create: 'Create', update: 'Update', saving: 'Saving...',
    createSuccess: 'Product created', updateSuccess: 'Product updated', saveFailed: 'Save failed',
    errors: { name: 'Required', brand: 'Required', country: 'Required', date: 'Required', materials: 'Must sum to 100% (currently {{total}}%)', materialName: 'All materials need a name' },
  },
  productDetail: {
    subtitle: 'Digital Product Passport', edit: 'Edit', delete: 'Delete',
    deleteConfirm: 'Delete "{{name}}"?', deleteSuccess: 'Product deleted', deleteFailed: 'Delete failed', notFound: 'Product not found',
    fields: { brand: 'Brand', category: 'Category', country: 'Country of production', date: 'Production date', washTemp: 'Wash temperature', dryCleaning: 'Dry cleaning', suitable: 'Suitable', notSuitable: 'Not suitable' },
    materials: { title: 'Material Composition', noMaterials: 'No materials recorded', name: 'Material', percentage: 'Percentage', recycled: 'Recycled', yes: 'Yes', no: 'No' },
    notes: 'Additional notes',
    wash: { '30': '30°C', '40': '40°C', '60': '60°C', none: 'Do not wash' },
  },
  users: {
    title: 'Users & Roles', subtitle_other: '{{count}} users registered', you: '(you)',
    columns: { name: 'Name', email: 'Email', role: 'Role', joined: 'Joined', actions: 'Actions' },
    roleUpdate: '{{name}} is now {{role}}', roleFailed: 'Failed to update role',
    deleteConfirm: 'Delete {{name}}?', deleteSuccess: 'User deleted', deleteFailed: 'Delete failed',
  },
  profile: {
    title: 'Profile', role: 'Role', userId: 'User ID', changePassword: 'Change password',
    currentPassword: 'Current password', newPassword: 'New password', confirmPassword: 'Confirm new password',
    update: 'Update password', updating: 'Updating...', updateSuccess: 'Password updated', updateFailed: 'Failed to update password',
    errors: { current: 'Required', next: 'Min 8 characters', nextUpper: 'Must contain uppercase', nextNumber: 'Must contain a number', confirm: 'Passwords do not match' },
  },
  common: { loading: 'Loading...', back: 'Back', cancel: 'Cancel', delete: 'Delete', edit: 'Edit' },
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: { tr: { translation: tr }, en: { translation: en } },
    lng: typeof window !== 'undefined' ? (localStorage.getItem('dpp-lang') || 'tr') : 'tr',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })
}

export default i18n
