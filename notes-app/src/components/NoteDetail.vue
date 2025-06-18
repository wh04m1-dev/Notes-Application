<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotesStore } from '@/store/notes'
import { useRoute, useRouter } from 'vue-router'

const notesStore = useNotesStore()
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  await notesStore.fetchNote(parseInt(route.params.id as string))
})

const editNote = () => {
  router.push(`/notes/${route.params.id}/edit`)
}

const deleteNote = async () => {
  if (confirm('Are you sure you want to delete this note?')) {
    await notesStore.deleteNote(parseInt(route.params.id as string))
    router.push('/notes')
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <div v-if="notesStore.isLoading && !notesStore.currentNote" class="text-center py-8">
      Loading note...
    </div>

    <div v-else-if="notesStore.currentNote">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ notesStore.currentNote.title }}</h1>
        <div class="flex gap-2">
          <button
            @click="editNote"
            class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Edit
          </button>
          <button
            @click="deleteNote"
            class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="prose max-w-none">
        <p class="whitespace-pre-line">{{ notesStore.currentNote.content }}</p>
      </div>

      <div class="mt-8 text-sm text-gray-500">
        <div>Created: {{ new Date(notesStore.currentNote.createdAt).toLocaleString() }}</div>
        <div>Updated: {{ new Date(notesStore.currentNote.updatedAt).toLocaleString() }}</div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      Note not found
    </div>
  </div>
</template>
