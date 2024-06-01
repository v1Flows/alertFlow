<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block'

definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const apiError = ref(false)
const refreshDataProgress = ref(0)

// Project
const projectID = useRoute().params.id
const loadingProject = ref(false)
const project = ref({})

// Members
const searchQuery = ref('')
const selectedRole = ref()
const isAddNewUserDrawerVisible = ref(false)

// API Keys
const apiKeys = ref([])
const loadingApiKeys = ref(false)
const addApiKeyDialog = ref(false)
const addApiKeyDescription = ref('')

// Runners
const runners = ref([])
const loadingRunners = ref(false)
const addRunnerDialog = ref(false)
const addRunnerName = ref('')
const removeRunnerDialog = ref(false)
const removeRunnerID = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const selectedRows = ref([])

const roles = [
  { title: 'Owner', value: 'owner' },
  { title: 'Editor', value: 'editor' },
  { title: 'Viewer', value: 'viewer' },
]

const headers = [
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Tabs
const currentTab = ref('tab-1')

const getProject = async () => {
  loadingProject.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow-api.justlab.xyz/api/projects/${projectID}`, {
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

const getApiKeys = async () => {
  loadingApiKeys.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow-api.justlab.xyz/api/projects/${projectID}/apikeys`, {
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

    apiKeys.value = await JSON.parse(data.value).api_keys
    loadingApiKeys.value = false
  }
  catch (err) {
    console.error(err)
    loadingApiKeys.value = false
    apiError.value = true
  }
}

const deleteApiKey = async (apiKeyID: string) => {
  try {
    const { error } = await useFetch(`https://alertflow-api.justlab.xyz/api/token/service/${apiKeyID}`, {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })

    if (error.value) {
      apiError.value = true
      console.error(error.value)
    }
    else {
      apiError.value = false
      getApiKeys()
    }
  }
  catch (err) {
    console.error(err)
    apiError.value = true
  }
}

const createApiKey = async () => {
  try {
    const { data, error } = await useFetch(`https://alertflow-api.justlab.xyz/api/token/service/${projectID}`, {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        description: addApiKeyDescription.value,
      }),
    })

    if (error.value) {
      apiError.value = true
      addApiKeyDialog.value = false
      console.error(error.value)
    }
    else if (data.value) {
      apiError.value = false
      addApiKeyDialog.value = false
      getApiKeys()
    }
  }
  catch (err) {
    console.error(err)
    apiError.value = true
    addApiKeyDialog.value = false
  }
}

const getRunners = async () => {
  loadingRunners.value = true
  try {
    const { data, error } = await useFetch('https://alertflow-api.justlab.xyz/api/runners/', {
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

    runners.value = await JSON.parse(data.value).runners
    loadingRunners.value = false
  }
  catch (err) {
    console.error(err)
    loadingRunners.value = false
    apiError.value = true
  }
}

const addRunner = async () => {
  try {
    const { data, error } = await useFetch('https://alertflow-api.justlab.xyz/api/runners/', {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        name: addRunnerName.value,
        project_id: projectID,
      }),
    })

    if (error.value) {
      apiError.value = true
      addRunnerDialog.value = false
      console.error(error.value)
    }
    else if (data.value) {
      apiError.value = false
      addRunnerDialog.value = false
      getRunners()
    }
  }
  catch (err) {
    console.error(err)
    apiError.value = true
    addRunnerDialog.value = false
  }
}

const deleteRunner = async (runnerID: string) => {
  try {
    const { error } = await useFetch(`https://alertflow-api.justlab.xyz/api/runners/${runnerID}`, {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    })

    if (error.value) {
      apiError.value = true
      removeRunnerDialog.value = false
      console.error(error.value)
    }
    else {
      apiError.value = false
      removeRunnerDialog.value = false
      getRunners()
    }
  }
  catch (err) {
    console.error(err)
    removeRunnerDialog.value = false
    apiError.value = true
  }
}

const resolveUserRoleVariant = (role: string) => {
  const roleLowerCase = role.toLowerCase()

  if (roleLowerCase === 'viewer')
    return { color: 'success', icon: 'ri-user-line' }
  if (roleLowerCase === 'editor')
    return { color: 'warning', icon: 'ri-edit-box-line' }
  if (roleLowerCase === 'owner')
    return { color: 'primary', icon: 'ri-vip-crown-line' }

  return { color: 'success', icon: 'ri-user-line' }
}

const resolveRunnerHeatbeat = (lastHeartbeat: string) => {
  let dateTime = 'N/A'
  if (lastHeartbeat.Valid)
    dateTime = new Date(lastHeartbeat.Time).toLocaleString()

  return dateTime
}

const resolveRunnerHeartbeatColor = (lastHeartbeat: string) => {
  if (lastHeartbeat.Valid) {
    if (new Date(lastHeartbeat.Time).getTime() < new Date().getTime() - 15000)
      return 'text-warning'

    return 'text-success'
  }
  else { return 'text-error' }
}

const resolveRunnerHearbeatAge = (lastHeartbeat: string) => {
  let age = 0
  if (lastHeartbeat.Valid) {
    age = new Date().getTime() - new Date(lastHeartbeat.Time).getTime()
    if (age > 1000 * 60 * 60 * 24)
      return `${Math.floor(age / (1000 * 60 * 60 * 24))} days`

    if (age > 1000 * 60 * 60)
      return `${Math.floor(age / (1000 * 60 * 60))} hours`

    if (age > 1000 * 60)
      return `${Math.floor(age / (1000 * 60))} minutes`

    return `${Math.floor(age / 1000)} seconds`
  }
  else { return 0 }
}

const refreshData = async () => {
  const refreshInterval = 10 * 1000 // 10 seconds
  const eachSecondInterval = 1000 // 1 second

  console.log('test')

  const intervalId = setInterval(async () => {
    await getProject()
    await getApiKeys()
    await getRunners()

    refreshDataProgress.value = 0
  }, refreshInterval)

  const eachSecondIntervalId = setInterval(() => {
    refreshDataProgress.value += 10
  }, eachSecondInterval)

  onUnmounted(() => {
    clearInterval(intervalId)
    clearInterval(eachSecondIntervalId)
  })
}

onMounted(async () => {
  await getProject()
  await getApiKeys()
  await getRunners()

  refreshData()
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
      <VProgressCircular
        :model-value="refreshDataProgress"
        color="primary"
      />
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
                  <span class="text-sm">Project Members</span>
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
                  <span class="text-h5 mb-1">{{ apiKeys.length }}</span>
                  <span class="text-sm">API Keys</span>
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
                  <span class="text-h5 mb-1">{{ runners.length }}</span>
                  <span class="text-sm">Runners</span>
                </div>
                <VAvatar
                  icon="ri-remix-run-line"
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

      <VTab prepend-icon="ri-remix-run-line">
        <span>Runner</span>
      </VTab>

      <VTab prepend-icon="ri-line-chart-line">
        <span>Stats</span>
      </VTab>
    </VTabs>

    <VWindow v-model="currentTab">
      <VWindowItem value="tab-1">
        <VCard class="mb-6">
          <VCardItem class="pb-4">
            <VCardTitle>Filters</VCardTitle>
          </VCardItem>
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol cols="12">
                <VSelect
                  v-model="selectedRole"
                  label="Select Role"
                  placeholder="Select Role"
                  :items="roles"
                  clearable
                  clear-icon="ri-close-line"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap gap-4 align-center">
            <div class="app-user-search-filter">
              <VTextField
                v-model="searchQuery"
                placeholder="Search User"
                density="compact"
              />
            </div>
            <VSpacer />
            <div class="d-flex align-center gap-4 flex-wrap">
              <!-- 👉 Add user button -->
              <VBtn @click="isAddNewUserDrawerVisible = true">
                Add New User
              </VBtn>
            </div>
          </VCardText>

          <!-- SECTION datatable -->
          <VDataTableServer
            v-model:model-value="selectedRows"
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :items="project.members"
            item-value="id"
            :items-length="project.members ? project.members.length : 0"
            :headers="headers"
            show-select
            class="text-no-wrap rounded-0"
            @update:options="updateOptions"
          >
            <!-- Role -->
            <template #item.role="{ item }">
              <div class="d-flex gap-2">
                <VIcon
                  :icon="resolveUserRoleVariant(item.role).icon"
                  :color="resolveUserRoleVariant(item.role).color"
                  size="22"
                />
                <span class="text-capitalize text-high-emphasis">{{ item.role }}</span>
              </div>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn size="small">
                <VIcon icon="ri-delete-bin-7-line" />
              </IconBtn>

              <IconBtn
                size="small"
                color="medium-emphasis"
              >
                <VIcon icon="ri-more-2-line" />

                <VMenu activator="parent">
                  <VList>
                    <VListItem link>
                      <template #prepend>
                        <VIcon icon="ri-edit-box-line" />
                      </template>
                      <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </IconBtn>
            </template>

            <!-- Pagination -->
            <template #bottom>
              <VDivider />

              <div class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1">
                <div class="d-flex align-center gap-x-2 text-medium-emphasis text-base">
                  Rows Per Page:
                  <VSelect
                    v-model="itemsPerPage"
                    class="per-page-select"
                    variant="plain"
                    :items="[10, 20, 25, 50, 100]"
                  />
                </div>

                <p class="d-flex align-center text-base text-high-emphasis me-2 mb-0">
                  {{ paginationMeta({ page, itemsPerPage }, project.members ? project.members.length : 0) }}
                </p>

                <div class="d-flex gap-x-2 align-center me-2">
                  <VBtn
                    class="flip-in-rtl"
                    icon="ri-arrow-left-s-line"
                    variant="text"
                    density="comfortable"
                    color="high-emphasis"
                    :disabled="page <= 1"
                    @click="page <= 1 ? page = 1 : page--"
                  />

                  <VBtn
                    class="flip-in-rtl"
                    icon="ri-arrow-right-s-line"
                    density="comfortable"
                    variant="text"
                    color="high-emphasis"
                    :disabled="page >= Math.ceil(project.members ? project.members.length : 0 / itemsPerPage)"
                    @click="page >= Math.ceil(project.members ? project.members.length : 0 / itemsPerPage) ? page = Math.ceil(project.members ? project.members.length : 0 / itemsPerPage) : page++ "
                  />
                </div>
              </div>
            </template>
          </VDataTableServer>
          <!-- SECTION -->
        </VCard>
      </VWindowItem>
      <VWindowItem value="tab-2">
        <VRow>
          <VCol cols="12">
            <VBtn
              :disabled="apiError"
              color="success"
              class="mb-0"
              prepend-icon="ri-add-line"
              variant="tonal"
              @click="addApiKeyDialog = true"
            >
              Create API Key
            </VBtn>
          </VCol>
        </VRow>
        <VAlert
          v-if="apiKeys.length === 0"
          color="info"
          variant="tonal"
        >
          No API Keys found for this Project.
        </VAlert>

        <VRow v-if="apiKeys.length > 0">
          <VCol
            v-for="key in apiKeys"
            :key="key.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <VCard>
              <VCardText class="d-flex align-center pb-4">
                <VRow>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <span>
                      Created At: {{ new Date(key.created_at).toLocaleString() }}
                    </span>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                    align="end"
                  >
                    <VBtn
                      icon="ri-delete-bin-7-line"
                      variant="text"
                      color="error"
                      @click="deleteApiKey(key.id)"
                    />
                  </VCol>
                </VRow>
              </VCardText>

              <VCardText>
                <div class="d-flex justify-space-between align-end">
                  <div>
                    <h5 class="text-h5 mb-1">
                      {{ key.description }}
                    </h5>
                  </div>
                </div>
              </VCardText>

              <VCardText>
                <VCodeBlock
                  :browser-window="true"
                  :code="key.key"
                  :indent="2"
                  highlightjs
                  theme="tokyo-night-dark"
                  :persistent-copy-button="true"
                  code-block-radius="0rem"
                />
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
      <VWindowItem value="tab-3">
        <VRow>
          <VCol cols="12">
            <VBtn
              :disabled="apiError"
              color="success"
              class="mb-0"
              prepend-icon="ri-remix-run-line"
              variant="tonal"
              @click="addRunnerDialog = true"
            >
              Add Runner
            </VBtn>
          </VCol>
        </VRow>

        <VAlert
          v-if="runners.length === 0"
          color="info"
          variant="tonal"
          class="mt-4 mb-4"
        >
          No Runners found for this Project.
        </VAlert>

        <VRow v-if="runners.length > 0">
          <VCol
            v-for="runner in runners"
            :key="runner.id"
            cols="12"
            sm="6"
            lg="4"
          >
            <VCard :loading="!runner.registered">
              <VCardText class="d-flex align-center pb-4">
                <VRow>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VChip
                      color="secondary"
                      label
                    >
                      ID: {{ runner.id }}
                    </VChip>
                  </VCol>
                  <VCol
                    cols="12"
                    sm="6"
                    align="end"
                  >
                    <VBtn
                      icon="ri-delete-bin-7-line"
                      variant="text"
                      color="error"
                      @click="removeRunnerID = runner.id ; removeRunnerDialog = true"
                    />
                  </VCol>
                </VRow>
              </VCardText>

              <VCardText>
                <h4 class="text-h4">
                  {{ runner.name }}
                </h4>
              </VCardText>

              <VDivider />

              <VCardText>
                <VRow>
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VTable>
                      <tr>
                        <td
                          class="text-body-1 pb-1"
                          style="inline-size: 150px;"
                        >
                          Registered:
                        </td>
                        <td
                          class="text-body-1 text-high-emphasis font-weight-medium pb-1"
                          :class="{ 'text-success': runner.registered, 'text-error': !runner.registered }"
                        >
                          {{ runner.registered ? 'Yes' : 'No' }}
                        </td>
                      </tr>
                      <tr>
                        <td
                          class="text-body-1 pb-1"
                          style="inline-size: 150px;"
                        >
                          Active:
                        </td>
                        <td
                          class="text-body-1 text-high-emphasis font-weight-medium pb-1"
                          :class="{ 'text-success': runner.active, 'text-error': !runner.active }"
                        >
                          {{ runner.active ? 'Yes' : 'No' }}
                        </td>
                      </tr>
                      <tr>
                        <td
                          class="text-body-1 pb-1"
                          style="inline-size: 150px;"
                        >
                          Available Actions:
                        </td>
                        <td class="text-body-1 text-high-emphasis font-weight-medium">
                          {{ runner.actions ? runner.actions.length : 0 }}
                        </td>
                      </tr>
                    </VTable>
                  </VCol>
                  <VDivider vertical />
                  <VCol
                    cols="12"
                    sm="6"
                  >
                    <VTable>
                      <tr>
                        <td
                          class="text-body-1 pb-1"
                          style="inline-size: 150px;"
                        >
                          Last Heartbeat:
                        </td>
                        <td
                          class="text-body-1 text-high-emphasis font-weight-medium pb-1"
                          :class="resolveRunnerHeartbeatColor(runner.last_heartbeat)"
                        >
                          {{ resolveRunnerHeatbeat(runner.last_heartbeat) }}
                        </td>
                      </tr>
                      <tr>
                        <td
                          class="text-body-1 pb-1"
                          style="inline-size: 150px;"
                        >
                          Heartbeat Age:
                        </td>
                        <td
                          class="text-body-1 text-high-emphasis font-weight-medium pb-1"
                          :class="resolveRunnerHeartbeatColor(runner.last_heartbeat)"
                        >
                          {{ resolveRunnerHearbeatAge(runner.last_heartbeat) }}
                        </td>
                      </tr>
                      <tr>
                        <td
                          class="text-body-1 pb-1"
                          style="inline-size: 150px;"
                        >
                          Runner Version:
                        </td>
                        <td class="text-body-1 text-high-emphasis font-weight-medium pb-1">
                          {{ runner.runner_version ? runner.runner_version : 'N/A' }}
                        </td>
                      </tr>
                    </VTable>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
      <VWindowItem value="tab-4" />
    </VWindow>
  </div>

  <!-- Add API Key Dialog -->
  <VDialog
    v-model="addApiKeyDialog"
    max-width="600"
  >
    <!-- Dialog Content -->
    <VCard title="Create Service API Key">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="addApiKeyDialog = false"
      />

      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="addApiKeyDescription"
              label="Description"
              placeholder="My API Key"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="addApiKeyDialog = false"
        >
          Close
        </VBtn>
        <VBtn
          variant="tonal"
          color="success"
          @click="createApiKey"
        >
          Create
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Add Runner Dialog -->
  <VDialog
    v-model="addRunnerDialog"
    max-width="600"
  >
    <!-- Dialog Content -->
    <VCard title="Add Runner">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="addRunnerDialog = false"
      />

      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="addRunnerName"
              label="Name"
              placeholder="My Runner"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          variant="outlined"
          color="secondary"
          @click="addRunnerDialog = false"
        >
          Close
        </VBtn>
        <VBtn
          variant="tonal"
          color="success"
          @click="addRunner"
        >
          Add
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Delete Runner Dialog -->
  <VDialog
    v-model="removeRunnerDialog"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Content -->
    <VCard title="Remove Runner">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="removeRunnerDialog = false"
      />

      <VCardText>
        Are you sure you want to remove this Runner?
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          color="secondary"
          @click="removeRunnerDialog = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="error"
          @click="deleteRunner(removeRunnerID)"
        >
          Remove
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss" scoped>
.app-user-search-filter {
  inline-size: 15.625rem;
}
</style>
