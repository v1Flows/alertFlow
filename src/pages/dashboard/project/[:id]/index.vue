<script setup lang="ts">
definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const apiError = ref(false)

// Project
const projectID = useRoute().params.id
const loadingProject = ref(false)
const project = ref({})

// Tabs
const currentTab = ref('tab-1')

const getProject = async () => {
  loadingProject.value = true
  try {
    const { data, error } = await useFetch(`http://localhost:8080/api/projects/${projectID}`, {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (error.value) {
      apiError.value = true
      console.error(error.value)
    }

    project.value = await JSON.parse(data.value).project
    loadingProject.value = false
  }
  catch (err) {
    console.error(err)
    loadingProject.value = false
    apiError.value = true
  }
}

onMounted(async () => {
  await getProject()
})
</script>

<template>
  <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
    <div>
      <h4 class="text-h4 mb-1">
        {{ project.name }}
        <VChip
          color="secondary"
          label
          class="mb-0 mx-2"
        >
          Project ID: {{ project.id }}
        </VChip>
      </h4>
      <p class="text-body-1 mb-0">
        {{ project.description }}
      </p>
    </div>
    <div class="d-flex gap-4 align-center flex-wrap">
      <VBtn
        variant="outlined"
        color="warning"
      >
        Edit Project
      </VBtn>
      <VBtn
        prepend-icon="ri-arrow-left-s-line"
        variant="tonal"
        color="success"
        :to="{ name: 'dashboard-projects' }"
      >
        Back to Project
      </VBtn>
    </div>
  </div>

  <VAlert
    v-model="apiError"
    title="Error receiving project data from API"
    text="Please try again later"
    type="error"
    variant="tonal"
    class="mb-6"
  />

  <div>
    <VRow>
      <VCol
        cols="12"
        md="3"
        sm="3"
      >
        <div>
          <VCard :loading="apiError">
            <VCardText>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex flex-column">
                  <span
                    class="text-h5 mb-1"
                    :class="project.members ? project.members.length > 0 ? 'text-success' : 'text-info' : 'text-info'"
                  >{{ project.members ? project.members.length : 0 }}</span>
                  <span class="text-sm">Number of Members</span>
                </div>
                <VAvatar
                  icon="ri-check-double-line"
                  variant="tonal"
                  color="secondary"
                />
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
      <VCol
        cols="12"
        md="3"
        sm="3"
      >
        <div>
          <VCard :loading="apiError">
            <VCardText>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex flex-column">
                  <span class="text-h5 mb-1">nope</span>
                  <span class="text-sm">Number of Flows</span>
                </div>
                <VAvatar
                  icon="ri-swap-2-line"
                  variant="tonal"
                  color="warning"
                />
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
      <VCol
        cols="12"
        md="3"
        sm="3"
      >
        <div>
          <VCard :loading="apiError">
            <VCardText>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex flex-column">
                  <span class="text-h5 mb-1">{{ project.api_keys ? project.api_keys.length : 0 }}</span>
                  <span class="text-sm">Number of API Keys</span>
                </div>
                <VAvatar
                  icon="ri-key-2-line"
                  variant="tonal"
                  color="info"
                />
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
      <VCol
        cols="12"
        md="3"
        sm="3"
      >
        <div>
          <VCard :loading="apiError">
            <VCardText>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex flex-column">
                  <span class="text-h5 mb-1">{{ new Date(project.created_at).toLocaleString() }}</span>
                  <span class="text-sm">Created At</span>
                </div>
                <VAvatar
                  icon="ri-loop-left-line"
                  variant="tonal"
                  color="secondary"
                />
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
    </VRow>
  </div>
  <div class="my-5">
    <VTabs
      v-model="currentTab"
      class="v-tabs-pill mb-1"
    >
      <VTab prepend-icon="ri-user-line">
        <span>Members</span>
      </VTab>

      <VTab prepend-icon="ri-key-2-line">
        <span>API Keys</span>
      </VTab>

      <VTab prepend-icon="ri-line-chart-line">
        <span>Stats</span>
      </VTab>
    </VTabs>

    <VWindow v-model="currentTab">
      <VWindowItem value="tab-1" />
      <VWindowItem value="tab-2" />
      <VWindowItem value="tab-3" />
    </VWindow>
  </div>
</template>
