<script setup lang="ts">
definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const apiUrl = ref('')
const setSettingsButtonLoading = ref(false)
const showSettingsChangedBarSuccess = ref(false)
const showSettingsChangedBarFail = ref(false)

const { data: getSettingsData, error } = await useFetch('https://alertflow-api.justlab.xyz/settings')
if (error.value)
  console.error(error.value)
else if (getSettingsData.value)
  apiUrl.value = JSON.parse(getSettingsData.value).settings.api_endpoint

async function setSettings() {
  setSettingsButtonLoading.value = true

  const { data: setSettingsData, error: setSettingsError } = await useFetch('https://alertflow-api.justlab.xyz/settings', {
    method: 'POST',
    body: JSON.stringify({ api_endpoint: apiUrl.value }),
  })

  if (setSettingsError.value) {
    setSettingsButtonLoading.value = false
    showSettingsChangedBarFail.value = true
    console.error(error.value)
  }
  else if (setSettingsData.value) {
    setSettingsButtonLoading.value = false
    showSettingsChangedBarSuccess.value = true
    console.log(setSettingsData.value)
  }
}
</script>

<template>
  <div>
    <VCard title="Settings">
      <VCardText>
        <VTextField
          v-model="apiUrl"
          label="API URL"
          placeholder="https://alertflow-api.justlab.xyz"
        />

        <VBtn
          color="primary"
          class="mt-4"
          :loading="setSettingsButtonLoading"
          @click="setSettings"
        >
          Set Settings
        </VBtn>
      </VCardText>
    </VCard>
    <VSnackbar
      v-model="showSettingsChangedBarSuccess"
      location="bottom right"
      variant="tonal"
      color="success"
      :timeout="5000"
    >
      Settings applied.
    </VSnackbar>
    <VSnackbar
      v-model="showSettingsChangedBarFail"
      location="bottom right"
      variant="tonal"
      color="error"
      :timeout="15000"
    >
      Failed to apply Settings.
    </VSnackbar>
  </div>
</template>
