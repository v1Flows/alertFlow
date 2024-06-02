<script setup lang="ts">
definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const { data, error } = await useFetch('https://alertflow.justlab.xyz/settings')

let settings = ref({
  api_endpoint: '',
})

if (error.value)
  console.error(error.value)
else if (data.value)
  settings = JSON.parse(data.value)
</script>

<template>
  <div>
    <VAlert
      v-if="settings.api_endpoint === ''"
      color="error"
      variant="tonal"
      class="mb-4"
    >
      API is not configured. Go to <RouterLink to="/settings">
        Settings
      </RouterLink> and configure it.
    </VAlert>

    <VRow>
      <VCol
        cols="12"
        sm="6"
        md="4"
      >
        <VCard>
          <VCardText class="d-flex align-center">
            <VAvatar
              size="40"
              rounded="lg"
              :color="settings.api_endpoint !== '' ? 'success' : 'error'"
              variant="tonal"
              class="me-4"
            >
              <VIcon
                icon="ri-server-line"
                size="24"
              />
            </VAvatar>

            <div class="d-flex flex-column">
              <div class="d-flex align-center flex-wrap gap-x-2">
                <h5 class="text-h5">
                  {{ settings.api_endpoint !== '' ? 'Configured' : 'Not Configured' }}
                </h5>
              </div>
              <div class="text-body-1">
                API
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
