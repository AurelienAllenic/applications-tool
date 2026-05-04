import { useState, useEffect, useCallback } from 'react'
import { Application, Status } from '../types'

const STORAGE_KEY = 'jobtracker_applications'

const SAMPLE_DATA: Application[] = [
  {
    id: '1',
    entreprise: 'Exemple : Google',
    poste: 'Développeur Frontend',
    localisation: 'Paris',
    dateEnvoi: '2024-05-15',
    lienOffre: 'https://careers.google.com',
    contact: 'Jean Recruteur',
    salaire: '55',
    statut: 'En attente',
    dateRelance: '2024-05-25',
    commentaires: 'Poste très intéressant',
    createdAt: new Date().toISOString(),
  },
]

function loadFromStorage(): Application[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SAMPLE_DATA
    return JSON.parse(raw)
  } catch {
    return SAMPLE_DATA
  }
}

function saveToStorage(apps: Application[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

export type ImportResult =
  | { ok: true; count: number }
  | { ok: false; reason: string }

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>(loadFromStorage)

  useEffect(() => {
    saveToStorage(applications)
  }, [applications])

  const addApplication = useCallback((data: Omit<Application, 'id' | 'createdAt'>) => {
    const newApp: Application = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setApplications(prev => [newApp, ...prev])
  }, [])

  const updateApplication = useCallback((id: string, data: Partial<Application>) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, ...data } : app))
    )
  }, [])

  const updateStatus = useCallback((id: string, statut: Status) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, statut } : app))
    )
  }, [])

  const deleteApplication = useCallback((id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setApplications([])
  }, [])

  const exportData = useCallback((): number => {
    const blob = new Blob([JSON.stringify(applications, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jobtracker_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    return applications.length
  }, [applications])

  // Retourne une Promise<ImportResult> pour pouvoir afficher un toast depuis App
  const importData = useCallback((file: File): Promise<ImportResult> => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target?.result as string)
          if (!Array.isArray(data)) {
            resolve({ ok: false, reason: 'Le fichier ne contient pas un tableau de candidatures.' })
            return
          }
          // Validation minimale de chaque entrée
          const valid = data.every(
            (item: unknown) =>
              typeof item === 'object' &&
              item !== null &&
              'id' in item &&
              'entreprise' in item
          )
          if (!valid) {
            resolve({ ok: false, reason: 'Le format des données est invalide.' })
            return
          }
          setApplications(data as Application[])
          resolve({ ok: true, count: data.length })
        } catch {
          resolve({ ok: false, reason: 'Fichier JSON illisible ou corrompu.' })
        }
      }
      reader.onerror = () => resolve({ ok: false, reason: 'Impossible de lire le fichier.' })
      reader.readAsText(file)
    })
  }, [])

  return {
    applications,
    addApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    clearAll,
    exportData,
    importData,
  }
}
