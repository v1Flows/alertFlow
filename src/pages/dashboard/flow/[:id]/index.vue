<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block';
import { uuid } from 'vue-uuid';

definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

interface Flow {
  id: string
  name: string
  description: string
  active: boolean
  actions: JSON
  created_at: string
  updated_at: string
}

const apiError = ref(false)

// Flow
const flowID = useRoute().params.id

const flow = ref<Flow>({
  id: '',
  name: '',
  description: '',
  active: false,
  actions: <any>[],
  created_at: '',
  updated_at: '',
})

const loadingFlow = ref(false)

// Flow // Edit
const editFlowLoading = ref(false)
const editFlowDialog = ref(false)

// Executions
const flowExecutions = ref([])
const loadingExecutions = ref(false)
const executionSelected = ref('all')
const executionPage = ref(1)
const executionItems = ref([])
const executionItemsPerPage = ref(9)

// const executionItemsPerPage = ref(10)
const hideExecutionsCompleted = ref(false)

// Payloads
const flowPayloads = ref([])
const loadingPayloads = ref(false)
const payloadsSize = ref(10)
const payloadsListCurrent = ref(1)

// Action
const show = ref([true, false, false])
const isEditActionDialogVisible = ref(false)

// Action // Add
const addActionLoading = ref(false)
const addActionDialog = ref(false)

// Action // Delete
const deleteActionDialog = ref(false)
const deleteActionID = ref(0)
const deleteActionLoading = ref(false)

const addActionData = ref({
  id: uuid.v4(),
  name: '',
  description: '',
  type: 'log',
  react_on: null,
  active: true,
  patternGroup: null,
  patternLabelKey: '',
  patternLabelValue: '',
  webhookUrl: '',
  webhookAuthToken: '',
})

const addActionSelectableTyped = ref([
  {
    title: 'Log',
    desc: 'Print Log Message on API-Backend Server',
    value: 'log',
    icon: 'ri-article-line',
  },
  {
    title: 'Webhook',
    desc: 'Trigger Webhook',
    value: 'webhook',
    icon: 'ri-webhook-line',
  },
])

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

    const executionItemsUnique = new Set()

    for (let i = 0; i < flowExecutions.value.length; i++)
      executionItemsUnique.add(flowExecutions.value[i].type)

    executionItems.value = Array.from(executionItemsUnique).map(type => ({
      title: type === '' ? 'N/A' : type.charAt(0).toUpperCase() + type.slice(1),
      value: type,
    }))

    executionItems.value.unshift({ title: 'All', value: 'all' })

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

const getExecutionIcon = (execution: any) => {
  if (execution.type === 'log')
    return 'ri-article-line'

  else
    return 'ri-question-line'
}

const getExecutionColor = (execution: any) => {
  if (execution.no_match)
    return 'secondary'
  else
    if (execution.running && !execution.error)
      return 'warning'
    else
      if (execution.error)
        return 'error'
      else
        return 'success'
}

const getExecutionTextColor = (execution: any) => {
  if (execution.no_match)
    return 'text-secondary'
  else
    if (execution.running && !execution.error)
      return 'text-warning'
    else
      if (execution.error)
        return 'text-error'
      else
        return 'text-success'
}

const getExecutionStatus = (execution: any) => {
  if (execution.no_match)
    return 'No Action Matched'
  else
    if (execution.running && !execution.error)
      return 'Running'
    else
      if (execution.error)
        return 'Error'
      else
        return 'Finished Successfully'
}

const getExecutionStatusIcon = (execution: any) => {
  if (execution.no_match)
    return 'ri-indeterminate-circle-line'
  else
    if (execution.running && !execution.error)
      return 'ri-time-line'
    else
      if (execution.error)
        return 'ri-error-warning-line'
      else
        return 'ri-checkbox-circle-line'
}

const updateFlow = async () => {
  editFlowLoading.value = true

  const { error } = await useFetch(`https://alertflow-api.justlab.xyz/flow/${flowID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: flow.value.name,
      description: flow.value.description,
      active: flow.value.active,
    }),
  })

  if (error.value) {
    apiError.value = true
    editFlowLoading.value = false
    console.error(error.value)
  }
  else {
    editFlowLoading.value = false
    getFlow()
  }
}

const addFlowAction = async () => {
  addActionLoading.value = true

  if (!Array.isArray(flow.value.actions)) {
    flow.value.actions = []
  }

  flow.value.actions.push(addActionData.value)

  const { error } = await useFetch(`https://alertflow-api.justlab.xyz/flow/${flowID}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      actions: flow.value.actions,
    }),
  })

  if (error.value) {
    apiError.value = true
    addActionLoading.value = false
    console.log(error.value)
  }
  else {
    apiError.value = false
    addActionLoading.value = false
  }
}

const deleteActionDialogFn = async (index: number) => {
  deleteActionDialog.value = true
  deleteActionID.value = index
}

const deleteAction = async () => {
  deleteActionLoading.value = true
  
  flow.value.actions = flow.value.actions.filter((_, i) => i !== deleteActionID.value)

  const { error } = await useFetch(`https://alertflow-api.justlab.xyz/flow/${flowID}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      actions: flow.value.actions,
    }),
  })

  if (error.value) {
    apiError.value = true
    deleteActionLoading.value = false
    deleteActionDialog.value = false
    console.log(error.value)
  }
  else {
    apiError.value = false
    deleteActionDialog.value = false
    deleteActionLoading.value = false
  }
}

onMounted(() => getFlow() && getFlowExecutions() && getFlowPayloads())

const filteredFlowExecutionsIndexStart = computed(() => (executionPage.value - 1) * executionItemsPerPage.value)
const filteredFlowExecutionsIndexEnd = computed(() => executionPage.value * executionItemsPerPage.value)

const filteredFlowExecutions = computed(() => {
  if (hideExecutionsCompleted.value) {
    if (executionSelected.value !== 'all')
      return flowExecutions.value.filter(execution => executionSelected.value === execution.type && execution.running === true || execution.error === true).sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime()).slice(filteredFlowExecutionsIndexStart.value, filteredFlowExecutionsIndexEnd.value)
    else   
      return flowExecutions.value.filter(execution => execution.running === true || execution.error === true).sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime()).slice(filteredFlowExecutionsIndexStart.value, filteredFlowExecutionsIndexEnd.value)
  }
  else
    if (executionSelected.value === 'all') {
      return flowExecutions.value.sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime()).slice(filteredFlowExecutionsIndexStart.value, filteredFlowExecutionsIndexEnd.value)
    }

    else {
      return flowExecutions.value.filter(execution => executionSelected.value === execution.type).sort((a, b) => new Date(b.executed_at).getTime() - new Date(a.executed_at).getTime()).slice(filteredFlowExecutionsIndexStart.value, filteredFlowExecutionsIndexEnd.value)
    }
})

const payloadIndexStart = computed(() => (payloadsListCurrent.value - 1) * payloadsSize.value)
const payloadIndexEnd = computed(() => payloadIndexStart.value + payloadsSize.value)
const paginated = computed(() => flowPayloads.value.slice(payloadIndexStart.value, payloadIndexEnd.value))
</script>

<template>
  <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
    <div>
      <h4 class="text-h4 mb-1">
        {{ flow.name }}
        <VChip
          color="secondary"
          label
          class="mb-0 mx-2"
        >
          {{ flow.id }}
        </VChip>
      </h4>
      <p class="text-body-1 mb-0">
        {{ flow.description }}
      </p>
    </div>
    <div class="d-flex gap-4 align-center flex-wrap">
      <VBtn
        variant="outlined"
        color="warning"
        @click="editFlowDialog = true"
      >
        Edit Flow
      </VBtn>
      <VBtn
        prepend-icon="ri-arrow-left-s-line"
        variant="tonal"
        color="success"
        :to="{ name: 'dashboard-flows' }"
      >
        Back to Flows
      </VBtn>
    </div>
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
        sm="3"
      >
        <div>
          <VCard :loading="apiError">
            <VCardText>
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex flex-column">
                  <span
                    class="text-h5 mb-1"
                    :class="flow.active ? 'text-success' : 'text-error'"
                  >{{ flow.active ? 'Active' : 'Inactive' }}</span>
                  <span class="text-sm">Flow Status</span>
                </div>
                <VAvatar
                  icon="ri-check-double-line"
                  variant="tonal"
                  :color="flow.active ? 'success' : 'error'"
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
                  <span class="text-h5 mb-1">{{ flowExecutions.length }}</span>
                  <span class="text-sm">Executions</span>
                </div>
                <VAvatar
                  icon="ri-terminal-line"
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
                  <span class="text-h5 mb-1">{{ flowPayloads.length }}</span>
                  <span class="text-sm">Injected Payloads</span>
                </div>
                <VAvatar
                  icon="ri-git-repository-commits-line"
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
                  <span class="text-h5 mb-1">{{ new Date(flow.updated_at).toLocaleString() }}</span>
                  <span class="text-sm">Last Flow Update</span>
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
      <VTab prepend-icon="ri-hammer-line">
        <span>Flow Actions</span>
      </VTab>

      <VTab prepend-icon="ri-terminal-line">
        <span>Executions</span>
      </VTab>

      <VTab prepend-icon="ri-git-repository-commits-line">
        <span>Payloads</span>
      </VTab>
    </VTabs>

    <VWindow v-model="currentTab">
      <!-- 👉 Actions -->
      <VWindowItem value="tab-1">
        <VCard class="mb-6">
          <VCardText>
            <div class="d-flex justify-space-between pb-5 flex-wrap align-center gap-y-4 gap-x-6">
              <h5 class="text-h5">
                Actions
              </h5>
              <VBtn
                variant="outlined"
                size="small"
                @click="addActionDialog = !addActionDialog"
              >
                Add new Action
              </VBtn>
            </div>
            <template
              v-for="(action, index) in flow.actions"
              :key="action.id"
            >
              <div>
                <div class="d-flex justify-space-between my-3 gap-y-2 flex-wrap align-center">
                  <div class="d-flex align-center gap-x-2">
                    <IconBtn
                      density="comfortable"
                      @click="show[index] = !show[index]"
                    >
                      <VIcon
                        :icon="show[index] ? 'ri-arrow-down-s-line' : 'ri-arrow-right-s-line'"
                        class="flip-in-rtl text-high-emphasis"
                      />
                    </IconBtn>
                    <div>
                      <div class="d-flex gap-2 mb-1">
                        <h6 class="text-h6">
                          {{ action.name }}
                        </h6>
                        <VChip
                          :color="action.active ? 'success' : 'error'"
                          density="comfortable"
                        >
                          {{ action.active ? 'Active' : 'Inactive' }}
                        </VChip>
                      </div>
                      <p class="text-body-1 mb-0">
                        {{ action.description }}
                      </p>
                    </div>
                  </div>
                  <div class="ms-5">
                    <IconBtn @click="isEditActionDialogVisible = !isEditActionDialogVisible">
                      <VIcon
                        icon="ri-pencil-line"
                        class="flip-in-rtl"
                      />
                    </IconBtn>
                    <IconBtn>
                      <VIcon
                        icon="ri-delete-bin-5-line"
                        class="flip-in-rtl"
                        @click="deleteActionDialogFn(index)"
                      />
                    </IconBtn>
                  </div>
                </div>
                <VExpandTransition>
                  <div v-show="show[index]">
                    <VRow class="px-12 pb-3">
                      <VCol
                        cols="6"
                        md="3"
                      >
                        <VTable>
                          <tr>
                            <td
                              class="text-sm pb-1"
                              style="inline-size: 100px;"
                            >
                              ID
                            </td>
                            <td class="text-sm text-high-emphasis font-weight-medium">
                              {{ action.id }}
                            </td>
                          </tr>
                          <tr>
                            <td
                              class="text-sm pb-1"
                              style="inline-size: 100px;"
                            >
                              Typ
                            </td>
                            <td class="text-sm text-high-emphasis font-weight-medium">
                              {{ action.type }}
                            </td>
                          </tr>
                          <tr>
                            <td class="text-sm pb-1">
                              Active
                            </td>
                            <td class="text-sm text-high-emphasis font-weight-medium">
                              {{ action.active }}
                            </td>
                          </tr>
                        </VTable>
                      </VCol>
                      <VDivider vertical />
                      <VCol
                        cols="6"
                        md="3"
                      >
                        <VTable>
                          <tr>
                            <td
                              class="text-sm pb-1"
                              style="inline-size: 100px;"
                            >
                              React On
                            </td>
                            <td class="text-sm text-high-emphasis font-weight-medium">
                              {{ action.react_on }}
                            </td>
                          </tr>
                          <tr>
                            <td
                              class="text-sm pb-1"
                              style="inline-size: 100px;"
                            >
                              Object Group
                            </td>
                            <td class="text-sm text-high-emphasis font-weight-medium">
                              {{ action.patternGroup }}
                            </td>
                          </tr>
                          <tr>
                            <td class="text-sm pb-1">
                              Key
                            </td>
                            <td class="text-sm text-high-emphasis font-weight-medium">
                              {{ action.patternLabelKey }}
                            </td>
                          </tr>
                          <tr>
                            <td class="text-sm pb-1">
                              Value
                            </td>
                            <td class="text-sm text-high-emphasis font-weight-medium">
                              {{ action.patternLabelValue }}
                            </td>
                          </tr>
                        </VTable>
                      </VCol>
                    </VRow>
                  </div>
                </VExpandTransition>
                <VDivider v-if="index !== flow.actions.length - 1" />
              </div>
            </template>
          </VCardText>
        </VCard>
      </VWindowItem>

      <!-- 👉 Executions -->
      <VWindowItem value="tab-2">
        <VCard class="mb-6">
          <VCardText>
            <!-- 👉 Header -->
            <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
              <div>
                <h5 class="text-h5">
                  Executions
                </h5>
                <div class="text-body-1">
                  {{ flowExecutions.length }} Flow Executions found
                </div>
              </div>

              <div class="d-flex flex-wrap align-center gap-y-4 gap-x-6">
                <VSelect
                  v-model="executionSelected"
                  density="compact"
                  :items="executionItems"
                  style="min-inline-size: 250px;"
                />
                <VSwitch
                  v-model="hideExecutionsCompleted"
                  label="Hide Completed"
                />
              </div>
            </div>

            <!-- 👉 Course List -->
            <div class="mb-6">
              <VRow class="match-height">
                <template
                  v-for="execution in filteredFlowExecutions"
                  :key="execution.id"
                >
                  <VCol
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <VCard
                      flat
                      border
                    >
                      <VCardText class="pt-3">
                        <div class="d-flex justify-space-between align-center mb-4">
                          <VChip
                            variant="tonal"
                            :color="getExecutionColor(execution)"
                            size="small"
                          >
                            {{ getExecutionStatus(execution) }}
                          </VChip>
                          <div class="d-flex align-center">
                            <VIcon
                              :icon="getExecutionIcon(execution)"
                              color="secondary"
                              size="24"
                              class="me-2"
                            />
                          </div>
                        </div>

                        <h5 class="text-h5 mb-1">
                          {{ execution.type.charAt(0).toUpperCase() + execution.type.slice(1) }}
                        </h5>
                        <p>
                          {{ execution.id }}
                        </p>
                        <p>
                          {{ new Date(execution.executed_at).toLocaleString() }}
                        </p>

                        <div class="d-flex align-center mb-1">
                          <VIcon
                            icon="ri-time-line"
                            size="20"
                            class="me-1"
                          />
                          <div class="text-body-1 my-auto">
                            {{ execution.finished_at ? Math.floor(new Date(execution.finished_at) - new Date(execution.executed_at)) / 1000 : 0 }}s
                          </div>
                        </div>
                        <div class="mb-2">
                          <VIcon
                            :icon="getExecutionStatusIcon(execution)"
                            :color="getExecutionColor(execution)"
                            class="me-1"
                          />
                          <span
                            class="text-body-1"
                            :class="getExecutionTextColor(execution)"
                          >{{ getExecutionStatus(execution) === 'No Action Matched' ? execution.no_match_reason : getExecutionStatus(execution) }}</span>
                        </div>

                        <VProgressLinear
                          :model-value="getExecutionStatus(execution) === 'Finished Successfully' ? 100 : getExecutionStatus(execution) === 'Error' ? 100 : 0"
                          :indeterminate="getExecutionStatus(execution) === 'Running'"
                          rounded
                          rounded-bar
                          :color="getExecutionColor(execution)"
                          height="8"
                          class="mb-4"
                        />

                        <div class="d-flex flex-wrap gap-4">
                          <RouterLink :to="`/dashboard/flow/${flow.id}/execution/${execution.id}`">
                            <VBtn
                              variant="tonal"
                              color="primary"
                              class="flex-grow-1"
                            >
                              <template #prepend>
                                <VIcon
                                  icon="ri-corner-down-right-line"
                                  class="flip-in-rtl"
                                />
                              </template>
                              Get Details
                            </VBtn>
                          </RouterLink>
                        </div>
                      </VCardText>
                    </VCard>
                  </VCol>
                </template>
              </VRow>
            </div>

            <VPagination
              v-model="executionPage"
              rounded
              color="primary"
              :length="Math.ceil(flowExecutions.length / executionItemsPerPage)"
            />
          </VCardText>
        </VCard>
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
  </div>
  <div>
    <!-- 👉 Edit Flow Dialog -->
    <VDialog
      v-model="editFlowDialog"
      max-width="600"
    >
      <!-- Dialog Content -->
      <VCard title="Flow">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="async () => { await getFlow(); editFlowDialog = false; }"
        />

        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="flow.name"
                label="Name"
                placeholder="Name"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="flow.description"
                label="Description"
                placeholder="Description"
              />
            </VCol>
            <VCol cols="12">
              <p class="mb-0">
                Status
              </p>
              <VSwitch
                v-model="flow.active"
                label="Active"
                :value="flow.active"
                :true-value="true"
                :false-value="false"
                color="success"
              />
            </VCol>
          </VRow>
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="error"
            variant="outlined"
            @click="async () => { await getFlow(); editFlowDialog = false; }"
          >
            Close
          </VBtn>
          <VBtn
            color="success"
            variant="tonal"
            :loading="editFlowLoading"
            @click="async () => { await updateFlow(); editFlowDialog = false; }"
          >
            Save
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- 👉 Add Action Dialog -->
    <VDialog
      :width="$vuetify.display.smAndDown ? 'auto' : 900 "
      :model-value="addActionDialog"
      persistent
    >
      <VCard class="pa-sm-11 pa-3">
        <VCardText class="pt-5">
          <!-- 👉 dialog close btn -->
          <DialogCloseBtn
            variant="text"
            size="default"
            @click="addActionDialog = false"
          />

          <!-- 👉 Title -->
          <div class="text-center mb-6">
            <h4 class="text-h4 mb-2">
              Add Flow Action
            </h4>

            <p class="text-body-1">
              Add an Action which is executed for this Flow if the conditions are met
            </p>
          </div>

          <CustomRadios
            v-model:selected-radio="addActionData.type"
            :radio-content="addActionSelectableTyped"
            :grid-column="{ sm: '6', cols: '12' }"
            class="mb-5"
          >
            <template #default="items">
              <div class="d-flex flex-column">
                <div class="d-flex mb-2 align-center gap-x-1">
                  <VIcon
                    :icon="items.item.icon"
                    size="20"
                    class="text-high-emphasis"
                  />
                  <div class="text-body-1 font-weight-medium text-high-emphasis">
                    {{ items.item.title }}
                  </div>
                </div>
                <p class="text-body-2 mb-0">
                  {{ items.item.desc }}
                </p>
              </div>
            </template>
          </CustomRadios>
          <!-- 👉 Form -->
          <VForm>
            <VRow>
              <!-- 👉 Action Name -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="addActionData.name"
                  label="Name"
                  placeholder="My Action"
                />
              </VCol>

              <!-- 👉 Action Description -->
              <VCol cols="12" md="6">
                <VTextField
                  v-model="addActionData.description"
                  label="Description"
                  placeholder="My Action Description"
                />
              </VCol>

              <!-- 👉 Select Action Status -->
              <VCol cols="12">
                <VSwitch
                  v-model="addActionData.active"
                  label="Activate Action"
                  :value-true="true"
                  :value-false="false"
                  color="success"
                />
              </VCol>

              <VCol cols="12">
                <VDivider />
              </VCol>

              <VCol cols="12">
                <h2 class="text-lg font-weight-medium">
                  Action Conditions
                </h2>
              </VCol>

              <!-- 👉 Select React on Firing or Resolved -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="addActionData.react_on"
                  label="Select Alert-Group Status"
                  placeholder="Select an Alert-Group Status to react on"
                  :items="['firing', 'resolved', 'both']"
                />
              </VCol>

              <!-- 👉 Select Object Group -->
              <VCol cols="12" md="6">
                <VSelect
                  v-model="addActionData.patternGroup"
                  label="Select Object Group"
                  placeholder="Select Object Group"
                  :items="['alerts', 'groupLabels', 'commonLabels', 'commonAnnotations']"
                />
              </VCol>

              <!-- 👉 Object Key -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="addActionData.patternLabelKey"
                  label="Object Key"
                  placeholder="alertname"
                />
              </VCol>

              <!-- 👉 Object Value -->
              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="addActionData.patternLabelValue"
                  label="Object Value"
                  placeholder="myAlarm"
                />
              </VCol>

              <VCol
                v-if="addActionData.type !== 'log'"
                cols="12"
              >
                <VDivider />
              </VCol>

              <VCol
                v-if="addActionData.type !== 'log'"
                cols="12"
              >
                <h2 class="text-lg font-weight-medium">
                  {{ addActionData.type.charAt(0).toUpperCase() + addActionData.type.slice(1) }} Details
                </h2>
              </VCol>

              <VCol
                v-if="addActionData.type === 'webhook'"
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="addActionData.webhookUrl"
                  label="Webhook URL"
                  placeholder="https://my-server.com/webhook"
                />
              </VCol>

              <VCol
                v-if="addActionData.type === 'webhook'"
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="addActionData.webhookAuthToken"
                  label="Webhook Auth Token"
                  placeholder="Bearer 1234567890"
                />
              </VCol>

              <!-- 👉 Submit and Cancel button -->
              <VCol
                cols="12"
                class="text-center"
              >
                <VBtn
                  type="submit"
                  class="me-3"
                  :loading="addActionLoading"
                  @click="async () => { await addFlowAction(); addActionDialog = false; }"
                >
                  submit
                </VBtn>

                <VBtn
                  variant="outlined"
                  color="secondary"
                  @click="addActionDialog = false"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Delete Action Dialog -->
    <VDialog
      v-model="deleteActionDialog"
      persistent
      class="v-dialog-sm"
    >
      <!-- Dialog Content -->
      <VCard title="Delete Action">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="deleteActionDialog = false"
        />

        <VCardText>
          Are you sure you want to delete this Action?
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="secondary"
            @click="deleteActionDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            :loading="deleteActionLoading"
            @click="deleteAction"
          >
            Delete
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>
