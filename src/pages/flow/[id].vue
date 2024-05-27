<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block'

interface Flow {
  id: string
  name: string
  description: string
  active: boolean
  actions: json
  created_at: string
  updated_at: string
}

const apiError = ref(false)

const flowID = useRoute().params.id
const flow = ref<Flow>({})
const loadingFlow = ref(false)

// Executions
const flowExecutions = ref([])
const loadingExecutions = ref(false)
const executionSelected = ref([])
const executionItems = ref([])

// Payloads
const flowPayloads = ref([])
const loadingPayloads = ref(false)
const payloadsSize = ref(10)
const payloadsListCurrent = ref(1)

// Action
const actionSelectedInt = ref(null)
const actionSelectedData = ref({})

// Tabs
const currentTab = ref('tab-1')

const getFlow = async () => {
  loadingFlow.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow-api.justlab.xyz/flow/${flowID}`)
    if (error.value) {
      apiError.value = true
      console.error(error.value)
    }

    flow.value = await JSON.parse(data.value).flow
    loadingFlow.value = false
  }
  catch (err) {
    console.error(err)
    loadingFlow.value = false
    apiError.value = true
  }
}

const getFlowExecutions = async () => {
  loadingExecutions.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow-api.justlab.xyz/flow/${flowID}/executions`)
    if (error.value) {
      apiError.value = true
      console.error(error.value)
    }
    flowExecutions.value = await JSON.parse(data.value).executions

    for (let i = 0; i < flowExecutions.value.length; i++) {
      if (executionItems.value.includes(flowExecutions.value[i].type) === false)
        executionItems.value.push(flowExecutions.value[i].type)
    }

    loadingExecutions.value = false
  }
  catch (err) {
    console.error(err)
    loadingExecutions.value = false
    apiError.value = true
  }
}

const getFlowPayloads = async () => {
  loadingPayloads.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow-api.justlab.xyz/flow/${flowID}/payloads`)
    if (error.value) {
      apiError.value = true
      console.error(error.value)
    }
    flowPayloads.value = await JSON.parse(data.value).payloads
    loadingPayloads.value = false
  }
  catch (err) {
    console.error(err)
    loadingPayloads.value = false
    apiError.value = true
  }
}

const actionSelected = action => {
  actionSelectedData.value = action
}

const getExecutionIcon = execution => {
  if (execution.type === 'log')
    return 'ri-article-line'

  else
    return 'ri-question-line'
}

const getExecutionColor = execution => {
  if (execution.error)
    return 'error'

  else
    if (execution.running)
      return 'warning'

    else
      if (execution.type === '')
        return 'info'

      else
        return 'success'
}

const getExecutionStatus = execution => {
  if (execution.error)
    return 'Error'

  else
    if (execution.running)
      return 'Running'

    else
      return 'Success'
}

onMounted(() => getFlow() && getFlowExecutions() && getFlowPayloads())

const filteredFlowExecutions = computed(() => {
  if (executionSelected.value.length === 0)
    return flowExecutions.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  else
    return flowExecutions.value.filter(execution => executionSelected.value.includes(execution.type)).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

const payloadIndexStart = computed(() => (payloadsListCurrent.value - 1) * payloadsSize.value)
const payloadIndexEnd = computed(() => payloadIndexStart.value + payloadsSize.value)
const paginated = computed(() => flowPayloads.value.slice(payloadIndexStart.value, payloadIndexEnd.value))
</script>

<template>
  <div class="mb-6">
    <div class="d-flex align-center gap-x-2 mb-2">
      <p class="text-2xl font-weight-medium mb-0">
        {{ flow.name }}
      </p>
      <VDivider vertical />
      <VChip
        color="secondary"
        label
        class="mb-0"
      >
        {{ flow.id }}
      </VChip>
    </div>
    <p class="text-sm text-disabled mb-0">
      {{ flow.description }}
    </p>
  </div>

  <VAlert
    v-model="apiError"
    title="Error receiving payloads from API"
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
        sm="6"
      >
        <div>
          <VCard
            class="logistics-card-statistics"
            :loading="apiError"
          >
            <VCardText>
              <div class="d-flex align-center gap-x-4 mb-1">
                <VAvatar
                  variant="tonal"
                  :color="flow.active ? 'success' : 'error'"
                  rounded
                >
                  <VIcon
                    icon="ri-check-double-line"
                    size="28"
                  />
                </VAvatar>
                <h4 class="text-h4">
                  {{ flow.active ? 'Active' : 'Inactive' }}
                </h4>
              </div>
              <div class="text-body-1 mb-1">
                Flow Status
              </div>
              <div class="d-flex gap-x-2 align-center">
                <h6 class="text-h6">
                  12%
                </h6>
                <div class="text-sm text-disabled">
                  than last week
                </div>
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
      <VCol
        cols="12"
        md="3"
        sm="6"
      >
        <div>
          <VCard
            class="logistics-card-statistics"
            :loading="apiError"
          >
            <VCardText>
              <div class="d-flex align-center gap-x-4 mb-1">
                <VAvatar
                  variant="tonal"
                  color="warning"
                  rounded
                >
                  <VIcon
                    icon="ri-terminal-line"
                    size="28"
                  />
                </VAvatar>
                <h4 class="text-h4">
                  {{ flowExecutions.length }}
                </h4>
              </div>
              <div class="text-body-1 mb-1">
                Executions
              </div>
              <div class="d-flex gap-x-2 align-center">
                <h6 class="text-h6">
                  12%
                </h6>
                <div class="text-sm text-disabled">
                  than last week
                </div>
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
      <VCol
        cols="12"
        md="3"
        sm="6"
      >
        <div>
          <VCard
            class="logistics-card-statistics"
            :loading="apiError"
          >
            <VCardText>
              <div class="d-flex align-center gap-x-4 mb-1">
                <VAvatar
                  variant="tonal"
                  color="success"
                  rounded
                >
                  <VIcon
                    icon="ri-git-repository-commits-line"
                    size="28"
                  />
                </VAvatar>
                <h4 class="text-h4">
                  {{ flowPayloads.length }}
                </h4>
              </div>
              <div class="text-body-1 mb-1">
                Injected Payloads
              </div>
              <div class="d-flex gap-x-2 align-center">
                <h6 class="text-h6">
                  12%
                </h6>
                <div class="text-sm text-disabled">
                  than last week
                </div>
              </div>
            </VCardText>
          </VCard>
        </div>
      </VCol>
      <VCol
        cols="12"
        md="3"
        sm="6"
      >
        <VCard>
          <VCardText>
            <div class="d-flex flex-wrap gap-4">
              <VBtn
                variant="outlined"
                color="info"
                class="flex-grow-1"
              >
                Create Action
              </VBtn>

              <VBtn
                color="warning"
                variant="outlined"
                class="mb-4 flex-grow-1"
              >
                Edit Flow
              </VBtn>
            </div>

            <!-- 👉  Add Payment trigger button  -->
            <VBtn
              block
              prepend-icon="ri-arrow-left-s-line"
              color="success"
              variant="tonal"
              :to="{ name: 'flows' }"
            >
              Back to Flows
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
  <div class="my-5">
    <VCard :loading="apiError">
      <VTabs
        v-model="currentTab"
        grow
        stacked
      >
        <VTab>
          <VIcon
            icon="ri-hammer-line"
            class="mb-2"
          />
          <span>Flow Actions</span>
        </VTab>

        <VTab>
          <VIcon
            icon="ri-terminal-line"
            class="mb-2"
          />
          <span>Executions</span>
        </VTab>

        <VTab>
          <VIcon
            icon="ri-git-repository-commits-line"
            class="mb-2"
          />
          <span>Payloads</span>
        </VTab>
      </VTabs>

      <VCardText>
        <VWindow v-model="currentTab">
          <!-- 👉 Actions -->
          <VWindowItem value="tab-1">
            <VCard>
              <VCardText>
                <VSlideGroup
                  v-model="actionSelectedInt"
                  show-arrows
                  mandatory
                  class="mb-10"
                >
                  <VSlideGroupItem
                    v-for="action in flow.actions"
                    :key="action.id"
                    v-slot="{ isSelected, toggle }"
                    :value="action.id"
                  >
                    <div
                      style="block-size: 100px; inline-size: 110px;"
                      :style="isSelected ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
                      :class="isSelected ? 'border' : 'border border-dashed'"
                      class="d-flex flex-column justify-center align-center cursor-pointer rounded py-4 px-5 me-4"
                      @click="() => { toggle(); actionSelected(action); }"
                    >
                      <VAvatar
                        rounded
                        size="38"
                        color="primary"
                        variant="tonal"
                        class="mb-2"
                      >
                        <VIcon
                          size="22"
                          icon="ri-article-line"
                        />
                      </VAvatar>
                      <h6 class="text-base font-weight-medium mb-0">
                        {{ action.type.toUpperCase() }}
                      </h6>
                    </div>
                  </VSlideGroupItem>

                  <!-- 👉 slider more -->
                  <VSlideGroupItem>
                    <div
                      style="block-size: 100px; inline-size: 110px;"
                      class="d-flex flex-column justify-center align-center rounded border border-dashed py-4 px-5"
                    >
                      <VAvatar
                        rounded
                        size="38"
                        variant="tonal"
                      >
                        <VIcon
                          size="22"
                          icon="ri-add-line"
                        />
                      </VAvatar>
                    </div>
                  </VSlideGroupItem>
                </VSlideGroup>

                <VTimeline
                  v-if="actionSelectedInt !== null"
                  side="end"
                  align="start"
                  line-inset="8"
                  truncate-line="start"
                  density="compact"
                  class="v-timeline--variant-outlined"
                >
                  <!-- SECTION Timeline Item: Flight -->
                  <VTimelineItem
                    dot-color="rgb(var(--v-theme-surface))"
                    size="x-small"
                  >
                    <template #icon>
                      <VIcon
                        icon="ri-group-line"
                        color="primary"
                      />
                    </template>
                    <!-- 👉 Header -->
                    <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                      <span class="app-timeline-title">
                        {{ actionSelectedData.patternGroup }}
                      </span>
                    </div>

                    <!-- 👉 Content -->
                    <div class="app-timeline-text mt-1">
                      Which Object to use for Key, Value search
                    </div>
                  </VTimelineItem>
                  <!-- !SECTION -->

                  <!-- SECTION Timeline Item: Interview Schedule -->
                  <VTimelineItem
                    size="x-small"
                    dot-color="rgb(var(--v-theme-surface))"
                  >
                    <template #icon>
                      <VIcon
                        icon="ri-key-2-line"
                        color="success"
                      />
                    </template>
                    <!-- 👉 Header -->
                    <div class="d-flex justify-space-between align-center flex-wrap mb-2">
                      <div class="app-timeline-title">
                        {{ actionSelectedData.patternLabelKey }}
                      </div>
                    </div>

                    <div class="app-timeline-text mt-1">
                      Key to search for
                    </div>
                  </VTimelineItem>
                  <!-- !SECTION -->

                  <!-- SECTION Design Review -->
                  <VTimelineItem
                    size="x-small"
                    dot-color="rgb(var(--v-theme-surface))"
                  >
                    <template #icon>
                      <VIcon
                        icon="ri-quote-text"
                        color="info"
                      />
                    </template>
                    <!-- 👉 Header -->
                    <div class="d-flex justify-space-between align-center flex-wrap mb-2">
                      <span class="app-timeline-title">
                        {{ actionSelectedData.patternLabelValue }}
                      </span>
                    </div>

                    <!-- 👉 Content -->
                    <p class="app-timeline-text mt-1 mb-2">
                      Value to search for
                    </p>
                  </VTimelineItem>
                </VTimeline>
              </VCardText>
            </VCard>
          </VWindowItem>

          <!-- 👉 Executions -->
          <VWindowItem value="tab-2">
            <VAlert
              v-if="flowExecutions.length === 0"
              color="info"
              variant="tonal"
            >
              No Executions found for this Flow
            </VAlert>

            <div v-else>
              <VCombobox
                v-model="executionSelected"
                chips
                clearable
                multiple
                closable-chips
                clear-icon="ri-close-circle-line"
                :items="executionItems"
                label="Filter by Action Type"
                prepend-icon="ri-filter-3-line"
                class="mb-4 mt-2"
              />

              <VList
                lines="two"
                border
              >
                <template
                  v-for="(execution, index) in filteredFlowExecutions"
                  :key="execution.id"
                >
                  <VListItem class="py-2">
                    <template #prepend>
                      <VAvatar
                        size="36"
                        rounded
                        variant="tonal"
                        :icon="getExecutionIcon(execution)"
                        :color="getExecutionColor(execution)"
                      />
                    </template>
                    <VListItemTitle>
                      <span>{{ execution.type.toUpperCase() }}</span>
                      <VBadge
                        dot
                        location="start center"
                        offset-x="2"
                        :color="getExecutionColor(execution)"
                        class="me-3 ms-1"
                      >
                        <span class="ms-4">{{ getExecutionStatus(execution) }}</span>
                      </VBadge>
                    </VListItemTitle>

                    <VListItemSubtitle class="mt-1">
                      <span>Execution ID</span>
                      <span class="text-xs text-disabled ms-2">{{ execution.id }}</span>
                    </VListItemSubtitle>

                    <VListItemSubtitle class="mt-1">
                      <span>Payload ID</span>
                      <span class="text-xs text-disabled ms-2">{{ execution.payload_id }}</span>
                    </VListItemSubtitle>

                    <VListItemSubtitle class="mt-1">
                      <span>Executed At</span>
                      <span class="text-xs text-disabled ms-2">{{ new Date(execution.executed_at).toLocaleString() }}</span>
                    </VListItemSubtitle>

                    <VListItemSubtitle class="mt-1">
                      <span>Finished At</span>
                      <span class="text-xs text-disabled ms-2">{{ new Date(execution.finished_at).toLocaleString() }}</span>
                    </VListItemSubtitle>

                    <template #append>
                      <VBtn
                        variant="tonal"
                        @click="showPayload(execution)"
                      >
                        Show Payload
                        <VIcon
                          end
                          icon="ri-home-7-line"
                        />
                      </VBtn>
                      <VBtn
                        variant="tonal"
                        color="error"
                        class="ms-2"
                      >
                        <VIcon icon="ri-home-7-line" />
                      </VBtn>
                    </template>
                  </VListItem>
                  <VDivider v-if="index !== flowExecutions.length - 1" />
                </template>
              </VList>
            </div>
          </VWindowItem>
          <VWindowItem value="tab-3">
            <VAlert
              v-if="flowPayloads.length === 0"
              color="info"
              variant="tonal"
            >
              No Payloads found for this Flow
            </VAlert>
            <div v-else>
              <VExpansionPanels
                variant="accordion"
                class="expansion-panels-width-border"
              >
                <VExpansionPanel
                  v-for="(payload) in paginated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))"
                  :key="payload.id"
                >
                  <VExpansionPanelTitle>
                    <span class="text-info me-2"> {{ new Date(payload.created_at).toLocaleString() }} </span> -> {{ payload.id }}
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <VCodeBlock
                      :code="payload.payload"
                      label="Payload"
                      :indent="2"
                      lang="json"
                      highlightjs
                      theme="tokyo-night-dark"
                      :copy-button="false"
                      code-block-radius="0rem"
                    />
                  </VExpansionPanelText>
                </VExpansionPanel>
              </VExpansionPanels>

              <VPagination
                v-model="payloadsListCurrent"
                :length="flowPayloads.length / payloadsSize + 1"
                :total-visible="$vuetify.display.mdAndUp ? 7 : 3"
                class="mt-4"
              />
            </div>
          </VWindowItem>
        </VWindow>
      </VCardText>
    </VCard>
  </div>
  <div>
    <VDialog
      :model-value="createFlowDialog"
      max-width="900"
      min-height="590"
      @update:model-value="dialogVisibleUpdate"
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
            Create a new Flow Action
          </h4>

          <VRow>
            <VCol
              cols="12"
              sm="5"
              md="4"
              lg="3"
            >
              <AppStepper
                v-model:current-step="currentStep"
                direction="vertical"
                :items="createActionsCategories"
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
                  v-model="currentStep"
                  class="disable-tab-transition stepper-content"
                >
                  <!-- 👉 ACTIONS -->
                  <VWindowItem>
                    <CustomRadiosWithIcon
                      v-model:selected-radio="createAction.type"
                      :radio-content="createActionSelects"
                      :grid-column="{ sm: '4', cols: '12' }"
                    />

                    <VRow
                      v-if="createAction.type !== ''"
                      class="mt-6"
                      no-gutters
                    >
                      <!-- 👉 First Name -->
                      <VCol
                        cols="12"
                        md="3"
                        class="d-flex align-items-center"
                      >
                        <label class="v-label text-body-2 text-high-emphasis">Status</label>
                      </VCol>

                      <VCol
                        cols="12"
                        md="9"
                      >
                        <VCheckbox
                          v-model="createAction.active"
                          color="success"
                          :label="createAction.active === true ? 'Active' : 'Inactive'"
                        />
                      </VCol>
                    </VRow>
                  </VWindowItem>

                  <!-- 👉 PATTERN -->
                  <VWindowItem>
                    <h5 class="text-h5 mb-1">
                      Select the object where your label is located
                    </h5>
                    <VRadioGroup
                      v-model="createAction.patternGroup"
                      inline
                    >
                      <VRadio
                        label="groupLabels"
                        value="groupLabels"
                      />
                      <VRadio
                        label="commonLabels"
                        value="commonLabels"
                      />
                      <VRadio
                        label="alertLabels"
                        value="alertLabels"
                      />
                    </VRadioGroup>

                    <VDivider class="my-4" />

                    <VRow>
                      <VCol cols="12">
                        <VRow no-gutters>
                          <!-- 👉 First Name -->
                          <VCol
                            cols="12"
                            md="3"
                            class="d-flex align-items-center"
                          >
                            <label
                              class="v-label text-body-2 text-high-emphasis"
                              for="patternLabelKey"
                            >Label Key</label>
                          </VCol>

                          <VCol
                            cols="12"
                            md="9"
                          >
                            <AppTextField
                              id="patternLabelKey"
                              v-model="createAction.patternLabelKey"
                              placeholder="Label Key"
                              persistent-placeholder
                            />
                          </VCol>
                        </VRow>
                      </VCol>

                      <VCol cols="12">
                        <VRow no-gutters>
                          <!-- 👉 First Name -->
                          <VCol
                            cols="12"
                            md="3"
                            class="d-flex align-items-center"
                          >
                            <label
                              class="v-label text-body-2 text-high-emphasis"
                              for="patternLabelValue"
                            >Label Value</label>
                          </VCol>

                          <VCol
                            cols="12"
                            md="9"
                          >
                            <AppTextField
                              id="patternLabelValue"
                              v-model="createAction.patternLabelValue"
                              placeholder="Label Value"
                              persistent-placeholder
                            />
                          </VCol>
                        </VRow>
                      </VCol>
                    </VRow>
                  </VWindowItem>

                  <VWindowItem class="text-center">
                    <h5 class="text-h5 mb-1">
                      Create it 🚀
                    </h5>
                    <p class="text-sm mb-4">
                      Create the new Action.
                    </p>

                    <VImg
                      :src="laptopGirl"
                      width="176"
                      class="mx-auto"
                    />
                  </VWindowItem>
                </VWindow>

                <div class="d-flex justify-space-between mt-6">
                  <VBtn
                    variant="tonal"
                    color="secondary"
                    :disabled="currentStep === 0"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-home-7-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    v-if="createActionsCategories.length - 1 === currentStep"
                    color="success"
                    :loading="createActionSubmitLoading"
                    @click="createActions"
                  >
                    Create
                  </VBtn>

                  <div v-else>
                    <VBtn
                      color="info"
                      variant="tonal"
                      class="me-4"
                      @click="createActionsCategories.push({ icon: 'ri-home-7-line', title: `ACTION ${createActions.actionCategories.length + 1}`, subtitle: 'Action to perform' })"
                    >
                      Create Another Action

                      <VIcon
                        icon="ri-home-7-line"
                        end
                        class="flip-in-rtl"
                      />
                    </VBtn>

                    <VBtn @click="currentStep++">
                      Next

                      <VIcon
                        icon="ri-home-7-line"
                        class="flip-in-rtl"
                      />
                    </VBtn>
                  </div>
                </div>
              </VForm>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- 👉 Execution PAYLOAD Dialog -->
    <VDialog
      v-model="executionPayloadDialogVisible"
      class="v-dialog-sm"
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="executionPayloadDialogVisible = !executionPayloadDialogVisible" />

      <!-- Dialog Content -->
      <VCard title="Payload">
        <VCardText>
          <VCodeBlock
            :code="executionPayload.payload"
            :indent="2"
            lang="json"
            highlightjs
            theme="tokyo-night-dark"
            :copy-button="false"
            code-block-radius="0rem"
          />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
