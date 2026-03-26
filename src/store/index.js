// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import api from '../utils/api'


// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,

//       login: (user, tokens) => {
//         localStorage.setItem('access_token',  tokens.access)
//         localStorage.setItem('refresh_token', tokens.refresh)
//         set({ user, isAuthenticated: true })
//       },

//       logout: async () => {
//         try {
//           const refresh = localStorage.getItem('refresh_token')
//           if (refresh) {
//             await api.post('/users/logout/', { refresh })
//           }
//         } catch {
//           // continue logout even if API call fails
//         }

//         localStorage.removeItem('access_token')
//         localStorage.removeItem('refresh_token')

//         useCartStore.getState().clearCart()
//         useWishlistStore.getState().clearWishlist()

//         localStorage.removeItem('cart-store')
//         localStorage.removeItem('wishlist-store')

//         set({ user: null, isAuthenticated: false })
//       },

//       setUser: (user) => set({ user }),
//     }),
//     {
//       name: 'auth-store',
//       partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
//     }
//   )
// )


// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       items: [],
//       count: 0,

//       setItems: (items) => set({
//         items,
//         count: items.reduce((s, i) => s + i.quantity, 0),
//       }),

//       addItem: (item) => {
//         const items = get().items

//         const existing = items.find(i =>
//           i.product?.id === item.product?.id &&
//           i.color === item.color &&
//           i.age === item.age
//         )

//         let updated
//         if (existing) {
//           updated = items.map(i =>
//             i.product?.id === item.product?.id &&
//             i.color === item.color &&
//             i.age === item.age
//               ? { ...i, quantity: i.quantity + 1 }
//               : i
//           )
//         } else {
//           updated = [...items, { ...item, quantity: item.quantity || 1 }]
//         }

//         set({
//           items: updated,
//           count: updated.reduce((s, i) => s + i.quantity, 0),
//         })
//       },

//       removeItem: (id) => {
//         const updated = get().items.filter(i => i.id !== id)
//         set({
//           items: updated,
//           count: updated.reduce((s, i) => s + i.quantity, 0),
//         })
//       },

//       updateQuantity: (id, quantity) => {
//         if (quantity < 1) return
//         const updated = get().items.map(i =>
//           i.id === id ? { ...i, quantity } : i
//         )
//         set({
//           items: updated,
//           count: updated.reduce((s, i) => s + i.quantity, 0),
//         })
//       },

//       clearCart: () => set({ items: [], count: 0 }),
//     }),
//     { name: 'cart-store' }
//   )
// )


// export const useWishlistStore = create(
//   persist(
//     (set, get) => ({
//       items: [],

//       toggle: (productId) => {
//         const items = get().items
//         set({
//           items: items.includes(productId)
//             ? items.filter(id => id !== productId)
//             : [...items, productId],
//         })
//       },

//       has: (productId) => get().items.includes(productId),

//       clearWishlist: () => set({ items: [] }),
//     }),
//     { name: 'wishlist-store' }
//   )
// )







import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      setItems: (items) => set({ items, count: items.reduce((s, i) => s + i.quantity, 0) }),
      addItem: (item) => {
        const items = get().items
        const existing = items.find(i => i.product?.id === item.product?.id)
        let updated
        if (existing) {
          updated = items.map(i => i.product?.id === item.product?.id ? { ...i, quantity: i.quantity + 1 } : i)
        } else {
          updated = [...items, { ...item, quantity: 1 }]
        }
        set({ items: updated, count: updated.reduce((s, i) => s + i.quantity, 0) })
      },
      removeItem: (id) => {
        const updated = get().items.filter(i => i.id !== id)
        set({ items: updated, count: updated.reduce((s, i) => s + i.quantity, 0) })
      },
      clearCart: () => set({ items: [], count: 0 }),
    }),
    { name: 'cart-store' }
  )
)

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) => {
        const items = get().items
        set({ items: items.includes(productId) ? items.filter(id => id !== productId) : [...items, productId] })
      },
      has: (productId) => get().items.includes(productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'wishlist-store' }
  )
)

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user, tokens) => {
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        // Clear tokens
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // Clear auth state
        set({ user: null, isAuthenticated: false })
        // Clear cart and wishlist from localStorage too
        useCartStore.getState().clearCart()
        useWishlistStore.getState().clearWishlist()
      },
      setUser: (user) => set({ user }),
    }),
    { name: 'auth-store', partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
)