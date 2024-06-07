<script setup lang="ts">
definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const apiError = ref(false)

const projects = ref([])
const loadingProjects = ref(false)

const flows = ref([])
const loadingFlows = ref(false)

const flowToDelete = ref(null)
const deleteFlowDialog = ref(false)

const createFlowDialog = ref(false)
const createFlowSubmitLoading = ref(false)

const createFlowForm = ref({
  name: '',
  description: '',
  project_id: null,
  active: true,
})

const getFlows = async () => {
  loadingFlows.value = true
  try {
    const { data, error } = await useFetch('https://alertflow.justlab.xyz/api/flows/', {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      apiError.value = true
      console.error(error.value)
    }

    flows.value = await JSON.parse(data.value).flows
    loadingFlows.value = false
  }
  catch (err) {
    console.error(err)
    loadingFlows.value = false
    apiError.value = true
  }
}

const getProjects = async () => {
  loadingProjects.value = true
  try {
    const { data, error } = await useFetch('https://alertflow.justlab.xyz/api/projects/', {
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

    for (const project of JSON.parse(data.value).projects)
      projects.value.push({ id: project.id, name: project.name })

    loadingProjects.value = false
  }
  catch (err) {
    console.error(err)
    loadingProjects.value = false
    apiError.value = true
  }
}

const deleteFlow = async flow => {
  try {
    const { data, error } = await useFetch(`https://alertflow.justlab.xyz/api/flows/${flow.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      apiError.value = true
      deleteFlowDialog.value = false
      console.error(error.value)
    }
    else if (data.value) {
      apiError.value = false
      deleteFlowDialog.value = false
      getFlows()
    }
  }
  catch (err) {
    console.error(err)
    deleteFlowDialog.value = false
    apiError.value = true
  }
}

const deleteFlowDialogFn = flow => {
  deleteFlowDialog.value = true
  flowToDelete.value = flow
}

onMounted(async () => {
  await getFlows()
  await getProjects()
})
</script>

<template>
  <div class="d-flex justify-space-between">
    <p class="text-2xl">
      Flows
    </p>
    <VBtn
      :disabled="apiError"
      color="success"
      prepend-icon="ri-add-line"
      variant="tonal"
      to="/dashboard/flow/create"
    >
      Create Flow
    </VBtn>
  </div>
  <VAlert
    v-model="apiError"
    title="Error receiving flows from API"
    text="Please try again later"
    type="error"
    variant="tonal"
  />
  <div>
    <VRow class="match-height">
      <VCol
        v-for="flow in flows.sort((a, b) => b.active - a.active)"
        :key="flow"
        cols="12"
        md="6"
        sm="6"
      >
        <VCard :loading="loadingFlows">
          <VCardText>
            <div>
              <h5 class="text-h5 mb-2">
                {{ flow.name }}
              </h5>
              <div class="text-body-2">
                {{ flow.description }}
              </div>
              <div class="text-body-2">
                {{ flow.id }}
              </div>
              <div class="d-flex justify-space-between my-4 flex-wrap gap-4">
                <div class="d-flex gap-x-3 align-center">
                  <VAvatar
                    color="primary"
                    variant="tonal"
                    rounded
                  >
                    <VIcon
                      icon="ri-stack-line"
                      size="28"
                    />
                  </VAvatar>
                  <div>
                    <h6 class="text-h6">
                      {{ projects.find(project => project.id === flow.project_id)?.name }}
                    </h6>
                    <div class="text-sm">
                      Project
                    </div>
                  </div>
                </div>
                <div class="d-flex gap-x-3 align-center">
                  <VAvatar
                    :color="flow.active ? 'success' : 'error'"
                    variant="tonal"
                    rounded
                  >
                    <VIcon
                      icon="ri-check-double-line"
                      size="28"
                    />
                  </VAvatar>
                  <div>
                    <h6
                      class="text-h6"
                      :class="flow.active ? 'text-success' : 'text-error'"
                    >
                      {{ flow.active ? 'Active' : 'Inactive' }}
                    </h6>
                    <div class="text-sm">
                      Status
                    </div>
                  </div>
                </div>
                <div class="d-flex gap-x-3 align-center">
                  <VAvatar
                    color="primary"
                    variant="tonal"
                    rounded
                  >
                    <VIcon
                      icon="ri-loop-left-line"
                      size="28"
                    />
                  </VAvatar>
                  <div>
                    <h6 class="text-h6">
                      {{ flow.updated_at ? new Date(flow.updated_at).toLocaleString() : 'N/A' }}
                    </h6>
                    <div class="text-sm">
                      Last Update
                    </div>
                  </div>
                </div>
              </div>
              <VRow class="match-height">
                <VCol
                  cols="12"
                  md="10"
                >
                  <RouterLink :to="`/dashboard/flow/${flow.id}`">
                    <VBtn
                      color="primary"
                      variant="tonal"
                      block
                    >
                      View
                      <VIcon
                        end
                        icon="ri-eye-2-line"
                      />
                    </VBtn>
                  </RouterLink>
                </VCol>
                <VCol
                  cols="12"
                  md="2"
                >
                  <VBtn
                    icon="ri-delete-bin-line"
                    color="error"
                    variant="outlined"
                    rounded
                    block
                    @click="deleteFlowDialogFn(flow)"
                  />
                </VCol>
              </VRow>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>

  <!-- DIALOG -->
  <VDialog
    v-model="createFlowDialog"
    max-width="900"
    min-height="590"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn
      size="small"
      @click="createFlowDialog = false"
    />
    <VCard
      class="create-app-dialog"
      min-height="590"
    >
      <VCardText class="pa-5 pa-sm-16">
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-6">
          Create a new Flow
        </h4>

        <VRow>
          <VCol cols="12">
            <VForm
              ref="createFlowFormRef"
              @submit.prevent="() => {}"
            >
              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="createFlowForm.name"
                    label="Flow Name"
                    placeholder="Flow Name"
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    v-model="createFlowForm.description"
                    label="Flow Description"
                    placeholder="Flow Description"
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    v-model="createFlowForm.project_id"
                    :items="projects"
                    item-title="name"
                    item-value="id"
                    label="Assign Flow to Project"
                    placeholder="Select Project"
                    eager
                    :rules="[requiredValidator]"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <div class="d-flex align-center gap-4">
                    <h5 class="text-h5">
                      Flow Status:
                    </h5>
                    <VCheckbox
                      v-model="createFlowForm.active"
                      color="success"
                      :label="createFlowForm.active === true ? 'Active' : 'Inactive'"
                    />
                  </div>
                </VCol>

                <VCol cols="12">
                  <div class="d-flex justify-space-between mt-6">
                    <VBtn
                      variant="tonal"
                      color="secondary"
                      @click="createFlowDialog = false"
                    >
                      <VIcon
                        icon="ri-arrow-go-back-line"
                        start
                        class="flip-in-rtl"
                      />
                      Cancel
                    </VBtn>

                    <VBtn
                      color="success"
                      :loading="createFlowSubmitLoading"
                      @click="createFlow(createFlowForm)"
                    >
                      Create

                      <VIcon
                        icon="ri-rocket-2-line"
                        end
                        class="flip-in-rtl"
                      />
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VForm>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Delete Flow Dialog -->
  <VDialog
    v-model="deleteFlowDialog"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Content -->
    <VCard title="Delete Flow">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="deleteFlowDialog = false"
      />

      <VCardText>
        Are you sure you want to delete this Flow?
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          color="secondary"
          @click="deleteFlowDialog = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="error"
          @click="deleteFlow(flowToDelete)"
        >
          Delete
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 16px;
}
</style>
