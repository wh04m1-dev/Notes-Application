import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { Note } from '@/types'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchNotes() {
    try {
      isLoading.value = true
      const response = await axios.get('/notes')
      notes.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch notes'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchNote(id: number) {
    try {
      isLoading.value = true
      const response = await axios.get(`/notes/${id}`)
      currentNote.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch note'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createNote(title: string, content: string) {
    try {
      isLoading.value = true
      const response = await axios.post('/notes', { title, content })
      notes.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create note'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateNote(id: number, title: string, content: string) {
    try {
      isLoading.value = true
      await axios.put(`/notes/${id}`, { title, content })
      const index = notes.value.findIndex(note => note.id === id)
      if (index !== -1) {
        notes.value[index] = { ...notes.value[index], title, content, updatedAt: new Date().toISOString() }
      }
      if (currentNote.value && currentNote.value.id === id) {
        currentNote.value = { ...currentNote.value, title, content, updatedAt: new Date().toISOString() }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update note'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteNote(id: number) {
    try {
      isLoading.value = true
      await axios.delete(`/notes/${id}`)
      notes.value = notes.value.filter(note => note.id !== id)
      if (currentNote.value && currentNote.value.id === id) {
        currentNote.value = null
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete note'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    notes,
    currentNote,
    isLoading,
    error,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote
  }
})
