<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm';

const router = useRouter()

const apiErrors = ref({
  get_projects: false,
  fetch_runners: false,
  create_flow: false,
})

const numberedSteps = [
  {
    title: 'Details',
    subtitle: 'Setup Details',
  },
  {
    title: 'Runner',
    subtitle: 'Select Runner',
  },
  {
    title: 'Action Conditions',
    subtitle: 'Select Action Conditions',
  },
  {
    title: 'Actions',
    subtitle: 'Add Actions',
  },
  {
    title: 'Summary',
    subtitle: 'Flow Summary',
  },
]

const currentStep = ref(0)
const isCurrentStepValid = ref(true)
const refFlowDetailsForm = ref<VForm>()
const refRunnerForm = ref<VForm>()
const refActionConditionForm = ref<VForm>()
const refActionsForm = ref<VForm>()
const refSummaryForm = ref<VForm>()

const projectList = <any>ref([])
const runnerList = <any>ref([])
const runnerData = <any>ref([])
const actionList = <any>ref([])

const actionConditions = ref(
  [
    {
      title: "No Pattern",
      desc: "Don't check for any Pattern and execute Action right away",
      value: "none",
      icon: "ri-close-large-line"
    },
    {
      title: "Common Pattern",
      desc: "All Actions will be executed based on this pattern",
      value: "common",
      icon: "ri-creative-commons-nd-line"
    },
    {
      title: "Per Action Pattern",
      desc: "Each Action will have an individual configurable pattern option",
      value: "custom",
      icon: "ri-puzzle-2-line"
    }
  ]
)

const flow = ref({
  name: '',
  description: '',
  project_id: '',
  runner_id: '',
  action_details: {
    pattern_type: '',
    patterns: {
      match: [
        {
          react_on: 'firing',
          group: 'alerts',
          key: '',
          value: '',
        },
      ],
      exclude: [],
    },
  },
  actions: [
    {
      name: '',
      description: '',
      active: true,
      type: '',
      patterns: {
        match: [],
        exclude: [],
      },
    },
  ],
})

const getProjects = async () => {
  try {
    const { data, error } = await useFetch('https://alertflow.justlab.xyz/api/projects/', {
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    if (error.value) {
      apiErrors.value.get_projects = true
      console.error(error.value)
    }

    for (const project of JSON.parse(data.value).projects) {
      projectList.value.push({
        title: project.name,
        desc: project.description,
        value: project.id,
        icon: 'ri-stack-line',
      })
    }
  }
  catch (err) {
    apiErrors.value.get_projects = true
    console.error(err)
  }
}

const fetchRunners = async () => {
  const { data, error } = await useFetch<any>(`https://alertflow.justlab.xyz/api/projects/${flow.value.project_id}/runners`, {
    headers: {
      'Authorization': useCookie('accessToken').value,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  if (error.value) {
    apiErrors.value.fetch_runners = true
    console.error(error.value)
  }
  else {
    runnerData.value = JSON.parse(data.value).runners
    runnerList.value = []
    for (const runner of JSON.parse(data.value).runners) {
      runnerList.value.push({
        title: runner.name,
        value: runner.id,
        icon: 'ri-remix-run-line',
      })
    }
  }
}

const formatActions = () => {
  const actions = runnerData.value.filter(runner => runner.id === flow.value.runner_id)

  for (const action of actions[0].available_actions) {
    actionList.value.push({
      title: action.name,
      desc: action.description,
      value: action.type,
    })
  }
}

const removeAction = () => {
  flow.value.actions.pop()
}

const addAction = () => {
  flow.value.actions.push(
    {
      name: '',
      description: '',
      active: true,
      type: '',
      patterns: {
        match: [],
        exclude: [],
      }
    },
  )
}

const removeCommonMatchPattern = () => {
  flow.value.action_details.patterns.match.pop()
}

const addCommonMatchPattern = () => {
  flow.value.action_details.patterns.match.push(
    {
      react_on: 'firing',
      group: 'alerts',
      key: '',
      value: '',
    },
  )
}

const removeCommonExcludePattern = () => {
  flow.value.action_details.patterns.exclude.pop()
}

const addCommonExcludePattern = () => {
  flow.value.action_details.patterns.exclude.push(
    {
      react_on: 'firing',
      group: 'alerts',
      key: '',
      value: '',
    },
  )
}

const removeActionMatchPattern = (index) => {
  flow.value.actions[index].patterns.match.pop()
}

const addActionMatchPattern = (index) => {
  flow.value.actions[index].patterns.match.push(
    {
      react_on: 'firing',
      group: 'alerts',
      key: '',
      value: '',
    },
  )
}

const removeActionExcludePattern = (index) => {
  flow.value.actions[index].patterns.exclude.pop()
}

const addActionExcludePattern = (index) => {
  flow.value.actions[index].patterns.exclude.push(
    {
      react_on: 'firing',
      group: 'alerts',
      key: '',
      value: '',
    },
  )
}

const validateFlowDetailsForm = () => {
  refFlowDetailsForm.value?.validate().then(valid => {
    if (valid.valid) {
      if (flow.value.project_id === '') {
        isCurrentStepValid.value = false
      } else {
        currentStep.value++
        isCurrentStepValid.value = true
      }
    }
    else { isCurrentStepValid.value = false }
  })
}

const validateRunnerForm = () => {
  if (flow.value.runner_id === '') {
    isCurrentStepValid.value = false
  } else {
    currentStep.value++
    isCurrentStepValid.value = true
  }
}

const validateActionConditionForm = () => {
  if (flow.value.action_details.pattern_type === '') {
    isCurrentStepValid.value = false
  } else {
    currentStep.value++
    isCurrentStepValid.value = true
  }
}

const validateActionsForm = () => {
  refActionsForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const createFlow = async () => {
  try {
    const { data, error } = await useFetch('https://alertflow.justlab.xyz/api/flows/', {
      method: 'POST',
      body: JSON.stringify(flow.value),
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      apiErrors.value.create_flow = true
      console.error(error.value)
    }
    else if (data.value) {
      router.push({ name: 'dashboard-flows' })
    }
  }
  catch (err) {
    apiErrors.value.create_flow = true
    console.error(err)
  }
}

onMounted(() => {
  getProjects()
})
</script>

<template>
  <VAlert
    v-model="apiErrors.get_projects"
    color="error"
    icon="ri-error-warning-line"
    class="mb-4"
    closable
  >
    Error receiving project data from API
  </VAlert>
  <VAlert
    v-model="apiErrors.fetch_runners"
    color="error"
    icon="ri-error-warning-line"
    class="mb-4"
    closable
  >
    Error receiving runner data from API
  </VAlert>
  <VAlert
    v-model="apiErrors.create_flow"
    color="error"
    icon="ri-error-warning-line"
    class="mb-4"
    closable
  >
    Error creating flow in API
  </VAlert>
  <VCard>
    <VCardText>
      <!-- 👉 Stepper -->
      <AppStepper
        v-model:current-step="currentStep"
        :items="numberedSteps"
        :is-active-step-valid="isCurrentStepValid"
      />
    </VCardText>

    <VDivider />

    <VCardText>
      <!-- 👉 stepper content -->

      <VWindow
        v-model="currentStep"
        class="disable-tab-transition"
      >
        <VWindowItem>
          <VForm
            ref="refFlowDetailsForm"
            @submit.prevent="validateFlowDetailsForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Flow Details
                </h6>
                <p class="text-sm mb-0">
                  Enter your Flow Details
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="flow.name"
                  placeholder="My Flow"
                  :rules="[requiredValidator]"
                  label="Name"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="flow.description"
                  placeholder="Description"
                  :rules="[requiredValidator]"
                  label="Description"
                />
              </VCol>

              <VCol cols="12">
                <H7 class="text-h7">
                  To which project do you want to assign the flow to?
                </H7>
              </VCol>

              <VCol cols="12">
                <!-- 👉 User Type  -->
                <CustomRadiosWithIcon
                  v-model:selected-radio="flow.project_id"
                  :radio-content="projectList"
                  :grid-column="{ cols: '12', sm: '4' }"
                  @update:selected-radio="fetchRunners"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="outlined"
                    disabled
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refRunnerForm"
            @submit.prevent="validateRunnerForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Runner
                </h6>
                <p class="text-sm mb-0">
                  Select an Runner where Actions should be executed on
                </p>
              </VCol>

              <VCol cols="12">
                <CustomRadiosWithIcon
                  v-model:selected-radio="flow.runner_id"
                  :radio-content="runnerList"
                  :grid-column="{ cols: '12', sm: '4' }"
                  @update:selected-radio="formatActions"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refActionConditionForm"
            @submit.prevent="validateActionConditionForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Action Conditions
                </h6>
                <p class="text-sm mb-0">
                  Select an Pattern which is checked before any Action execution
                </p>
              </VCol>

              <VCol cols="12">
                <CustomRadiosWithIcon
                  v-model:selected-radio="flow.action_details.pattern_type"
                  :radio-content="actionConditions"
                  :grid-column="{ cols: '12', sm: '4' }"
                />
              </VCol>

              <VCol cols="12" v-if="flow.action_details.pattern_type === 'common'">
                <h6 class="text-h6 text-success">
                  Patterns to Match
                </h6>
                <p class="text-sm mb-0">
                  The Action/s will be triggered when the following pattern is matched
                </p>
                
                <div class="d-flex flex-wrap gap-4">
                  <VBtn class="mt-4" color="success" variant="outlined" size="small" @click="addCommonMatchPattern">
                    Add Pattern
                  </VBtn>
                  <VBtn class="mt-4" color="error" variant="outlined" size="small" @click="removeCommonMatchPattern">
                    Remove Pattern
                  </VBtn>
                </div>
              </VCol>

              <VCol cols=12 v-if="flow.action_details.pattern_type === 'common'">
                <VExpansionPanels multiple>
                  <VExpansionPanel
                    v-for="(pattern, index) in flow.action_details.patterns.match"
                    :key="index"
                  >
                    <VExpansionPanelTitle class="mb-2">
                      Match Pattern {{ index +1 }}
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VRow>
                        <VCol cols="12" md="6">
                          <VSelect
                            v-model="flow.action_details.patterns.match[index].react_on"
                            :items="['firing', 'resolved', 'both']"
                            placeholder="firing"
                            :rules="[requiredValidator]"
                            label="React On"
                          />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VSelect
                            v-model="flow.action_details.patterns.match[index].group"
                            :items="['none', 'alerts', 'groupLabels', 'commonLabels', 'commonAnnotations']"
                            placeholder="alerts"
                            :rules="[requiredValidator]"
                            label="Object Group"
                          />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField
                            v-model="flow.action_details.patterns.match[index].key"
                            placeholder="alertname"
                            :rules="[requiredValidator]"
                            label="Object Key"
                          />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField
                            v-model="flow.action_details.patterns.match[index].value"
                            placeholder="MyAlarm"
                            :rules="[requiredValidator]"
                            label="Object Value"
                          />
                        </VCol>
                      </VRow>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCol>

              <VCol cols="12" v-if="flow.action_details.pattern_type === 'common'">
                <h6 class="text-h6 text-error">
                  Patterns to Exclude
                </h6>
                <p class="text-sm mb-0">
                  The Action/s will be skipped when the following pattern is matched
                </p>

                <div class="d-flex flex-wrap gap-4">
                  <VBtn class="mt-4" color="success" variant="outlined" size="small" @click="addCommonExcludePattern">
                    Add Pattern
                  </VBtn>
                  <VBtn class="mt-4" color="error" variant="outlined" size="small" @click="removeCommonExcludePattern">
                    Remove Pattern
                  </VBtn>
                </div>
              </VCol>

              <VCol cols=12 v-if="flow.action_details.pattern_type === 'common'">
                <VExpansionPanels multiple>
                  <VExpansionPanel
                    v-for="(pattern, index) in flow.action_details.patterns.exclude"
                    :key="index"
                  >
                    <VExpansionPanelTitle class="mb-2">
                      Exclude Pattern {{ index + 1 }}
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VRow>
                        <VCol cols="12" md="6">
                          <VSelect
                            v-model="flow.action_details.patterns.exclude[index].react_on"
                            :items="['firing', 'resolved', 'both']"
                            placeholder="firing"
                            :rules="[requiredValidator]"
                            label="React On"
                          />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VSelect
                            v-model="flow.action_details.patterns.exclude[index].group"
                            :items="['none', 'alerts', 'groupLabels', 'commonLabels', 'commonAnnotations']"
                            placeholder="alerts"
                            :rules="[requiredValidator]"
                            label="Object Group"
                          />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField
                            v-model="flow.action_details.patterns.exclude[index].key"
                            placeholder="alertname"
                            :rules="[requiredValidator]"
                            label="Object Key"
                          />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField
                            v-model="flow.action_details.patterns.exclude[index].value"
                            placeholder="MyAlarm"
                            :rules="[requiredValidator]"
                            label="Object Value"
                          />
                        </VCol>
                      </VRow>
                    </VExpansionPanelText>
                  </VExpansionPanel>
                </VExpansionPanels>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refActionsForm"
            @submit.prevent="validateActionsForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Actions
                </h6>
                <p class="text-sm mb-0">
                  Setup Actions
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
                v-for="(action, index) in flow.actions"
                :key="index"
              >
                <AppCardActions
                  :title="`Action ${index + 1}`"
                  color="#19182a"
                  action-collapsed
                >
                  <VCardItem>
                    <VRow class="mt-2">
                      <VCol
                        cols="12"
                        md="6"
                      >
                        <VTextField
                          v-model="flow.actions[index].name"
                          placeholder="My Action"
                          :rules="[requiredValidator]"
                          label="Name"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <VTextField
                          v-model="flow.actions[index].description"
                          placeholder="Description"
                          :rules="[requiredValidator]"
                          label="Description"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                      >
                        <VSelect
                          :items="runnerData.filter(runner => runner.id === flow.runner_id)[0].available_actions.map(action => action.type)"
                          label="Select Action"
                          placeholder="Log"
                          eager
                          v-model="flow.actions[index].type"
                        />
                      </VCol>

                      <VCol cols="12" v-if="flow.action_details.pattern_type === 'custom'">
                        <h6 class="text-h6 text-success">
                          Patterns to Match
                        </h6>
                        <p class="text-sm mb-0">
                          The Action will be triggered when the following pattern is matched
                        </p>
                        
                        <div class="d-flex flex-wrap gap-4">
                          <VBtn class="mt-4" color="success" variant="outlined" size="small" @click="addActionMatchPattern(index)">
                            Add Pattern
                          </VBtn>
                          <VBtn class="mt-4" color="error" variant="outlined" size="small" @click="removeActionMatchPattern(index)">
                            Remove Pattern
                          </VBtn>
                        </div>
                      </VCol>

                      <VCol cols=12 v-if="flow.action_details.pattern_type === 'custom'">
                        <VExpansionPanels multiple>
                          <VExpansionPanel
                            v-for="(pattern, patternIndex) in flow.actions[index].patterns.match"
                            :key="patternIndex"
                          >
                            <VExpansionPanelTitle class="mb-2">
                              Match Pattern {{ patternIndex +1 }}
                            </VExpansionPanelTitle>
                            <VExpansionPanelText>
                              <VRow>
                                <VCol cols="12" md="6">
                                  <VSelect
                                    v-model="flow.actions[index].patterns.match[patternIndex].react_on"
                                    :items="['firing', 'resolved', 'both']"
                                    placeholder="firing"
                                    :rules="[requiredValidator]"
                                    label="React On"
                                  />
                                </VCol>
                                <VCol cols="12" md="6">
                                  <VSelect
                                    v-model="flow.actions[index].patterns.match[patternIndex].group"
                                    :items="['none', 'alerts', 'groupLabels', 'commonLabels', 'commonAnnotations']"
                                    placeholder="alerts"
                                    :rules="[requiredValidator]"
                                    label="Object Group"
                                  />
                                </VCol>
                                <VCol cols="12" md="6">
                                  <VTextField
                                    v-model="flow.actions[index].patterns.match[patternIndex].key"
                                    placeholder="alertname"
                                    :rules="[requiredValidator]"
                                    label="Object Key"
                                  />
                                </VCol>
                                <VCol cols="12" md="6">
                                  <VTextField
                                    v-model="flow.actions[index].patterns.match[patternIndex].value"
                                    placeholder="MyAlarm"
                                    :rules="[requiredValidator]"
                                    label="Object Value"
                                  />
                                </VCol>
                              </VRow>
                            </VExpansionPanelText>
                          </VExpansionPanel>
                        </VExpansionPanels>
                      </VCol>

                      <VCol cols="12" v-if="flow.action_details.pattern_type === 'custom'">
                        <h6 class="text-h6 text-error">
                          Patterns to Exclude
                        </h6>
                        <p class="text-sm mb-0">
                          The Action will be skipped when the following pattern is matched
                        </p>

                        <div class="d-flex flex-wrap gap-4">
                          <VBtn class="mt-4" color="success" variant="outlined" size="small" @click="addActionExcludePattern(index)">
                            Add Pattern
                          </VBtn>
                          <VBtn class="mt-4" color="error" variant="outlined" size="small" @click="removeActionExcludePattern(index)">
                            Remove Pattern
                          </VBtn>
                        </div>
                      </VCol>

                      <VCol cols=12 v-if="flow.action_details.pattern_type === 'custom'">
                        <VExpansionPanels multiple>
                          <VExpansionPanel
                            v-for="(pattern, excludePatternIndex) in flow.actions[index].patterns.exclude"
                            :key="excludePatternIndex"
                          >
                            <VExpansionPanelTitle class="mb-2">
                              Exclude Pattern {{ excludePatternIndex + 1 }}
                            </VExpansionPanelTitle>
                            <VExpansionPanelText>
                              <VRow>
                                <VCol cols="12" md="6">
                                  <VSelect
                                    v-model="flow.actions[index].patterns.exclude[excludePatternIndex].react_on"
                                    :items="['firing', 'resolved', 'both']"
                                    placeholder="firing"
                                    :rules="[requiredValidator]"
                                    label="React On"
                                  />
                                </VCol>
                                <VCol cols="12" md="6">
                                  <VSelect
                                    v-model="flow.actions[index].patterns.exclude[excludePatternIndex].group"
                                    :items="['none', 'alerts', 'groupLabels', 'commonLabels', 'commonAnnotations']"
                                    placeholder="alerts"
                                    :rules="[requiredValidator]"
                                    label="Object Group"
                                  />
                                </VCol>
                                <VCol cols="12" md="6">
                                  <VTextField
                                    v-model="flow.actions[index].patterns.exclude[excludePatternIndex].key"
                                    placeholder="alertname"
                                    :rules="[requiredValidator]"
                                    label="Object Key"
                                  />
                                </VCol>
                                <VCol cols="12" md="6">
                                  <VTextField
                                    v-model="flow.actions[index].patterns.exclude[excludePatternIndex].value"
                                    placeholder="MyAlarm"
                                    :rules="[requiredValidator]"
                                    label="Object Value"
                                  />
                                </VCol>
                              </VRow>
                            </VExpansionPanelText>
                          </VExpansionPanel>
                        </VExpansionPanels>
                      </VCol>
                    </VRow>
                  </VCardItem>
                </AppCardActions>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    color="error"
                    variant="outlined"
                    @click="removeAction"
                  >
                    <VIcon icon="ri-subtract-line" />
                    Remove Action
                  </VBtn>

                  <VBtn
                    color="info"
                    variant="outlined"
                    @click="addAction"
                  >
                    <VIcon icon="ri-add-line" />
                    Add Action
                  </VBtn>

                  <VBtn type="submit">
                    Next
                    <VIcon
                      icon="ri-arrow-right-line"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>

        <VWindowItem>
          <VForm
            ref="refSummaryForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Summary
                </h6>
                <p class="text-sm mb-0">
                  Flow Summary
                </p>
              </VCol>

              <VCol
                cols="12"
              >
                <table class="text-body-1">
                  <tbody>
                    <tr>
                      <td class="pe-6">
                        Name:
                      </td>
                      <td>{{ flow.name }}</td>
                    </tr>
                    <tr>
                      <td class="pe-6">
                        Description:
                      </td>
                      <td>{{ flow.description }}</td>
                    </tr>
                    <tr>
                      <td class="pe-6">
                        Project:
                      </td>
                      <td>{{ projectList.filter(project => project.value === flow.project_id)[0].title }} (ID: {{ flow.project_id }})</td>
                    </tr>
                    <tr>
                      <td class="pe-6">
                        Runner:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ runnerList.filter(runner => runner.value === flow.runner_id)[0].title }} (ID: {{ flow.runner_id }})
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="pe-6">
                        Action Pattern Type:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ flow.action_details.pattern_type === 'common' ? 'Common Pattern for all Actions' : 'Custom Pattern per Action' }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <VCard title="Patterns" v-if="flow.action_details.pattern_type === 'common'">
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

                <VCard :title="`${flow.actions.length} Actions`">
                  <VCardText>
                    <VTimeline
                      side="end"
                      align="start"
                      line-inset="9"
                      truncate-line="start"
                      density="compact"
                    >
                      <VTimelineItem
                        dot-color="primary"
                        size="x-small"
                        v-for="(action, index) in flow.actions"
                        :key="index"
                      >
                        <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-2">
                          <span class="app-timeline-title">
                            {{ action.name }}
                          </span>
                        </div>

                        <div class="app-timeline-text mt-1 mb-1">
                          {{ action.description }}
                        </div>

                        <table class="text-body-1 mb-1">
                          <tbody>
                            <tr>
                              <td class="pe-6">
                                Type:
                              </td>
                              <td>
                                <p class="mb-0 text-wrap me-4">
                                  {{ action.type }}
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>

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
                      </VTimelineItem>
                    </VTimeline>
                  </VCardText>
                </VCard>
              </VCol>

              <VCol cols="12">
                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="ri-arrow-left-line"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    color="success"
                    type="submit"
                    @click="createFlow"
                  >
                    submit
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VWindowItem>
      </VWindow>
    </VCardText>
  </VCard>
</template>
