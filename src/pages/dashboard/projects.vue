<script setup lang="ts">
definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const apiError = ref(false)
const createFlowDialog = ref(false)
</script>

<template>
  <div>
    <VRow class="match-height">
      <VCol
        cols="12"
        md="6"
        sm="6"
        align="left"
      >
        <p class="text-2xl mb-0">
          Projects
        </p>
      </VCol>
      <VCol
        cols="12"
        md="6"
        sm="6"
        align="right"
      >
        <VBtn
          :disabled="apiError"
          color="success"
          class="mb-0"
          prepend-icon="ri-add-line"
          variant="tonal"
          @click="createProjectDialog = true"
        >
          Create Project
        </VBtn>
      </VCol>
    </VRow>
  </div>
</template>
