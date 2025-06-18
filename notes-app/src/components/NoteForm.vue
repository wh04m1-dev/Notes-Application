<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotesStore } from '@/store/notes'
import { useRoute, useRouter } from 'vue-router'

const notesStore = useNotesStore()
const route = useRoute()
const router = useRouter()

const title = ref('')
const content = ref('')
const isEditing = ref(false)
const noteId = ref<number | null>(null)

onMounted(async () => {
  if (route.params.id) {
    isEditing.value = true
    noteId.value = parseInt(route.params.id as string)
    await notesStore.fetchNote(noteId.value)
    if (notesStore.currentNote) {
      title.value = notesStore.currentNote.title
      content.value = notesStore.currentNote.content
    }
  }
})

const handleSubmit = async () => {
  if (isEditing.value && noteId.value) {
    await notesStore.updateNote(noteId.value, title.value, content.value)
  } else {
    await notesStore.createNote(title.value, content.value)
  }
  router.push('/notes')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">
      {{ isEditing ? 'Edit Note' : 'Create New Note' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input
          v-model="title"
          type="text"
          id="title"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          v-model="content"
          id="content"
          rows="10"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>

      <div class="flex justify-end gap-4">
        <router-link
          to="/notes"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </router-link>
        <button
          type="submit"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="notesStore.isLoading"
        >
          {{ notesStore.isLoading ? 'Saving...' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>
