<script setup lang="ts">
definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const apiError = ref(false)

const flows = ref([])
const loadingFlows = ref(false)

const flowToDelete = ref(null)
const deleteFlowDialog = ref(false)

const createFlowDialog = ref(false)
const createFlowStep = ref(0)
const createFlowSubmitLoading = ref(false)

const createFlowCategories = ref([
  {
    icon: 'ri-survey-line',
    title: 'DETAILS',
    subtitle: 'Enter Flow Details',
  },
  {
    icon: 'ri-survey-line',
    title: 'ACTIONS',
    subtitle: 'Flow Actions',
  },
  {
    icon: 'ri-survey-line',
    title: 'SUBMIT',
    subtitle: 'Submit',
  },
])

const createFlowForm = ref({
  name: '',
  description: '',
  active: true,
})

const getFlows = async () => {
  loadingFlows.value = true
  try {
    const { data, error } = await useFetch('https://alertflow-api.justlab.xyz/flows')
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

const createFlow = async flow => {
  try {
    const { data, error } = await useFetch('https://alertflow-api.justlab.xyz/flow', {
      method: 'POST',
      body: JSON.stringify(flow),
    })

    if (error.value) {
      apiError.value = true
      createFlowDialog.value = false
      console.error(error.value)
    }
    else if (data.value) {
      apiError.value = false
      createFlowDialog.value = false
      getFlows()
    }
  }
  catch (err) {
    console.error(err)
    createFlowDialog.value = false
    apiError.value = true
  }
}

const deleteFlow = async flow => {
  try {
    const { data, error } = await useFetch(`https://alertflow-api.justlab.xyz/flow/${flow.id}`, {
      method: 'DELETE',
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

onMounted(() => getFlows())
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
          Flows
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
          @click="createFlowDialog = true"
        >
          Create Flow
          <VIcon
            end
            icon="ri-add-line"
          />
        </VBtn>
      </VCol>
    </VRow>
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
        v-for="flow in flows"
        :key="flow"
        cols="12"
        md="4"
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
                      icon="ri-hammer-line"
                      size="28"
                    />
                  </VAvatar>
                  <div>
                    <h6 class="text-h6">
                      {{ flow.actions ? flow.actions.length : 0 }}
                    </h6>
                    <div class="text-sm">
                      Actions
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
                      icon="ri-terminal-line"
                      size="28"
                    />
                  </VAvatar>
                  <div>
                    <h6 class="text-h6">
                      {{ flow.actions ? flow.actions.length : 0 }}
                    </h6>
                    <div class="text-sm">
                      Executions
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
                      icon="ri-check-double-line"
                      size="28"
                    />
                  </VAvatar>
                  <div>
                    <h6
                      v-if="flow.active"
                      class="text-h6 text-success"
                    >
                      Active
                    </h6>
                    <h6
                      v-else
                      class="text-h6 text-error"
                    >
                      Inactive
                    </h6>
                    <div class="text-sm">
                      Status
                    </div>
                  </div>
                </div>
              </div>
              <VRow class="match-height">
                <VCol
                  cols="12"
                  md="5"
                >
                  <RouterLink :to="`/flow/${flow.id}`">
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
                  md="5"
                >
                  <VBtn
                    color="warning"
                    variant="tonal"
                    block
                  >
                    Edit
                    <VIcon
                      end
                      icon="ri-pencil-line"
                    />
                  </VBtn>
                </VCol>
                <VCol
                  cols="12"
                  md="2"
                >
                  <VBtn
                    icon="ri-delete-bin-line"
                    color="error"
                    variant="tonal"
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
          <VCol
            cols="12"
            sm="5"
            md="4"
            lg="3"
          >
            <AppStepper
              v-model:current-step="createFlowStep"
              direction="vertical"
              :items="createFlowCategories"
              icon-size="22"
              class="stepper-icon-step-bg"
            />
          </VCol>

          <VCol
            cols="12"
            sm="7"
            md="8"
            lg="9"
          >
            <VForm
              ref="createFlowFormRef"
              @submit.prevent="() => {}"
            >
              <VWindow
                v-model="createFlowStep"
                class="disable-tab-transition stepper-content"
              >
                <!-- 👉 DETAILS -->
                <VWindowItem>
                  <VTextField
                    v-model="createFlowForm.name"
                    label="Flow Name"
                    placeholder="Flow Name"
                    :rules="[requiredValidator]"
                  />

                  <VTextField
                    v-model="createFlowForm.description"
                    class="mt-3"
                    label="Flow Description"
                    placeholder="Flow Description"
                    :rules="[requiredValidator]"
                  />

                  <VCheckbox
                    v-model="createFlowForm.active"
                    class="mt-3"
                    color="success"
                    :label="createFlowForm.active === true ? 'Active' : 'Inactive'"
                  />
                </VWindowItem>

                <!-- 👉 ACTIONS -->
                <VWindowItem>
                  <p>No Use till now</p>
                </VWindowItem>

                <VWindowItem class="text-center">
                  <h5 class="text-h5 mb-1">
                    Create it 🚀
                  </h5>
                  <p class="text-sm mb-4">
                    Create the new Flow.
                  </p>
                </VWindowItem>
              </VWindow>

              <div class="d-flex justify-space-between mt-6">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  :disabled="createFlowStep === 0"
                  @click="createFlowStep--"
                >
                  <VIcon
                    icon="ri-arrow-left-line"
                    start
                    class="flip-in-rtl"
                  />
                  Previous
                </VBtn>

                <VBtn
                  v-if="createFlowCategories.length - 1 === createFlowStep"
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

                <VBtn
                  v-else
                  @click="createFlowStep++"
                >
                  Next

                  <VIcon
                    icon="ri-arrow-right-line"
                    end
                    class="flip-in-rtl"
                  />
                </VBtn>
              </div>
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
