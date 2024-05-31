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

// Members
const searchQuery = ref('')
const selectedRole = ref()
const isAddNewUserDrawerVisible = ref(false)

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
      <VWindowItem value="tab-2" />
      <VWindowItem value="tab-3" />
    </VWindow>
  </div>
</template>

<style lang="scss" scoped>
.app-user-search-filter {
  inline-size: 15.625rem;
}
</style>
