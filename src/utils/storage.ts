import { Chat } from "@/types/chats";

interface UserData {
  username: string;
  password: string;
  filterJenis: string;
  loginTime: string;
}

export const getChatsFromStorage = (): Chat[] | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("chats");
  return data ? JSON.parse(data) : [];
};

export const saveChatsToStorage = (chats: Chat[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("chats", JSON.stringify(chats));
};

// IndexedDB utilities
const DB_NAME = 'EvyapDB'
const DB_VERSION = 1
const LOGIN_STORE = 'logins'
const USER_STORE = 'users'

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = () => {
      const db = request.result
      
      // Store untuk login data
      if (!db.objectStoreNames.contains(LOGIN_STORE)) {
        const loginStore = db.createObjectStore(LOGIN_STORE, { keyPath: 'id', autoIncrement: true })
        loginStore.createIndex('username', 'username', { unique: false })
      }
      
      // Store untuk user management
      if (!db.objectStoreNames.contains(USER_STORE)) {
        const userStore = db.createObjectStore(USER_STORE, { keyPath: 'id', autoIncrement: true })
        userStore.createIndex('username', 'username', { unique: true })
      }
    }
  })
}

export const setDataIndexDB = async (data: UserData): Promise<boolean> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([LOGIN_STORE], 'readwrite')
    const store = transaction.objectStore(LOGIN_STORE)
    
    await new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    return true
  } catch (error) {
    console.error('Error saving to IndexedDB:', error)
    return false
  }
}

// User management functions
export const addUser = async (userData: any): Promise<boolean> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([USER_STORE], 'readwrite')
    const store = transaction.objectStore(USER_STORE)
    
    await new Promise((resolve, reject) => {
      const request = store.add(userData)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    return true
  } catch (error) {
    console.error('Error adding user:', error)
    return false
  }
}

export const getAllUsers = async (): Promise<any[]> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([USER_STORE], 'readonly')
    const store = transaction.objectStore(USER_STORE)
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting users:', error)
    return []
  }
}

export const getDataIndexDB = async (username: string): Promise<UserData | null> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([LOGIN_STORE], 'readonly')
    const store = transaction.objectStore(LOGIN_STORE)
    const index = store.index('username')
    
    return new Promise((resolve, reject) => {
      const request = index.get(username)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting from IndexedDB:', error)
    return null
  }
}

export const delDataIndexDB = async (username: string): Promise<boolean> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([LOGIN_STORE], 'readwrite')
    const store = transaction.objectStore(LOGIN_STORE)
    const index = store.index('username')
    
    const user = await new Promise<any>((resolve, reject) => {
      const request = index.get(username)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    if (user) {
      await new Promise((resolve, reject) => {
        const request = store.delete(user.id)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }
    
    return true
  } catch (error) {
    console.error('Error deleting from IndexedDB:', error)
    return false
  }
}

export const clearDataIndexDB = async (): Promise<boolean> => {
  try {
    const db = await openDB()
    const transaction = db.transaction([LOGIN_STORE], 'readwrite')
    const store = transaction.objectStore(LOGIN_STORE)
    
    await new Promise((resolve, reject) => {
      const request = store.clear()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    
    return true
  } catch (error) {
    console.error('Error clearing IndexedDB:', error)
    return false
  }
}