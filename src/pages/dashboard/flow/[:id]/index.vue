<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block'
import { uuid } from 'vue-uuid'

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
  project_id: string
  runner_id: string
  active: boolean
  action_details: JSON
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
  project_id: '',
  runner_id: '',
  active: false,
  action_details: {
    pattern_type: '',
    patterns: {
      match: [],
      exclude: [],
    }
  },
  actions: <any>[],
  created_at: '',
  updated_at: '',
})

const loadingFlow = ref(false)

// Flow // Edit
const editFlowLoading = ref(false)
const editFlowDialog = ref(false)

// Project
const loadingProject = ref(false)
const project = ref({})

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

// Tabs
const currentTab = ref('tab-1')

const getProject = async () => {
  loadingProject.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow.justlab.xyz/api/projects/${flow.value.project_id}`, {
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

const getFlow = async () => {
  loadingFlow.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow.justlab.xyz/api/flows/${flowID}`, {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      apiError.value = true
      console.error(error.value)
    }

    flow.value = await JSON.parse(data.value).flow
    console.log(flow.value)
    getProject()
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
    const { data, error } = await useFetch(`https://alertflow.justlab.xyz/api/flows/${flowID}/executions`, {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

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
    const { data, error } = await useFetch(`https://alertflow.justlab.xyz/api/flows/${flowID}/payloads`, {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

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

  const { error } = await useFetch(`https://alertflow.justlab.xyz/api/flows/${flowID}`, {
    method: 'PUT',
    headers: {
      'Authorization': useCookie('accessToken').value,
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

onMounted(async () => {
  await getFlow()
  await getFlowExecutions()
  await getFlowPayloads()
})

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
          Flow ID: {{ flow.id }}
        </VChip>
        <VChip
          color="info"
          label
          class="mb-0 mx-2"
        >
          Project: {{ project.name }}
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
        <span>Actions</span>
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
        <VRow>
          <VCol cols="12" md="3" v-if="flow.action_details.pattern_type === 'common'">
            <VCard class="mb-6" title="Common Pattern">
              <VCardText>
                <VTimeline
                  side="end"
                  align="start"
                  line-inset="9"
                  truncate-line="start"
                  density="compact"
                >
                  <VTimelineItem
                    dot-color="error"
                    size="x-small"
                    v-for="(pattern, index) in flow.action_details.patterns.exclude"
                    :key="index"
                  >
                    <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                      <span class="app-timeline-title text-error">
                        {{ index + 1 }}. Exclude Pattern
                      </span>
                    </div>

                    <table class="text-body-1">
                      <tbody>
                        <tr>
                          <td class="pe-6">
                            React On:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.react_on }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="pe-6">
                            Group:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.group }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="pe-6">
                            Key:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.key }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="pe-6">
                            Value:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.value }}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </VTimelineItem>
                  <VTimelineItem
                    dot-color="success"
                    size="x-small"
                    v-for="(pattern, index) in flow.action_details.patterns.match"
                    :key="index"
                  >
                    <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                      <span class="app-timeline-title text-success">
                        {{ index + 1 }}. Match Pattern
                      </span>
                    </div>

                    <table class="text-body-1">
                      <tbody>
                        <tr>
                          <td class="pe-6">
                            React On:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.react_on }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="pe-6">
                            Group:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.group }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="pe-6">
                            Key:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.key }}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td class="pe-6">
                            Value:
                          </td>
                          <td>
                            <p class="mb-0 text-wrap me-4">
                              {{ pattern.value }}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </VTimelineItem>
                </VTimeline>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="12" :md="flow.action_details.pattern_type === 'common' ? 9 : 12">
            <VCard class="mb-6">
              <VCardText>
                <div class="d-flex justify-space-between pb-5 flex-wrap align-center gap-y-4 gap-x-6">
                  <h5 class="text-h5">
                    Actions
                  </h5>
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
                    </div>
                    <VExpandTransition>
                      <div v-show="show[index]">
                        <VRow class="px-12 pb-3">
                          <VCol
                            cols="12"
                          >
                            <VTable class="mb-2">
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
                            <VTimeline
                              side="end"
                              align="start"
                              line-inset="9"
                              truncate-line="start"
                              density="compact"
                              v-if="flow.action_details.pattern_type === 'custom'"
                            >
                              <VTimelineItem
                                dot-color="error"
                                size="x-small"
                                v-for="(pattern, index) in action.patterns.exclude"
                                :key="index"
                              >
                                <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                                  <span class="app-timeline-title text-error">
                                    {{ index + 1 }}. Exclude Pattern
                                  </span>
                                </div>

                                <table class="text-body-1">
                                  <tbody>
                                    <tr>
                                      <td class="pe-6">
                                        React On:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.react_on }}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pe-6">
                                        Group:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.group }}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pe-6">
                                        Key:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.key }}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pe-6">
                                        Value:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.value }}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </VTimelineItem>
                              <VTimelineItem
                                dot-color="success"
                                size="x-small"
                                v-for="(pattern, index) in action.patterns.match"
                                :key="index"
                              >
                                <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                                  <span class="app-timeline-title text-success">
                                    {{ index + 1 }}. Match Pattern
                                  </span>
                                </div>

                                <table class="text-body-1">
                                  <tbody>
                                    <tr>
                                      <td class="pe-6">
                                        React On:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.react_on }}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pe-6">
                                        Group:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.group }}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pe-6">
                                        Key:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.key }}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="pe-6">
                                        Value:
                                      </td>
                                      <td>
                                        <p class="mb-0 text-wrap me-4">
                                          {{ pattern.value }}
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </VTimelineItem>
                            </VTimeline>
                          </VCol>
                        </VRow>
                      </div>
                    </VExpandTransition>
                    <VDivider v-if="index !== flow.actions.length - 1" class="mt-11 mb-6" />
                  </div>
                </template>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
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
  </div>
</template>
