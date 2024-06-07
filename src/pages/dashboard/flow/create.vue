<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm';

const apiError = ref(false)

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
    title: 'Actions',
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
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)
const isCurrentStepValid = ref(true)
const refAccountForm = ref<VForm>()
const refPersonalForm = ref<VForm>()
const refSocialLinkForm = ref<VForm>()

const accountForm = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
})

const projectList = <any>ref([])
const runnerList = <any>ref([])
const runnerData = <any>ref([])
const actionList = <any>ref([])

const actionConditions = ref([
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
])

const flow = ref({
  name: '',
  description: '',
  project_id: '',
  runner_id: '',
  active: true,
  actions_details: {
    pattern_type: '',
    pattern: {
      react_on: 'firing',
      group: 'alerts',
      key: '',
      value: '',
    },
  },
  actions: [
    {
      name: '',
      description: '',
      active: true,
      type: '',
      pattern: {
        react_on: 'firing',
        group: 'alerts',
        key: '',
        value: '',
      },
    },
  ],
  created_at: '',
  updated_at: '',
})

const personalForm = ref({
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
})

const socialForm = ref({
  twitter: '',
  facebook: '',
  googlePlus: '',
  LinkedIn: '',

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
      apiError.value = true
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
    console.error(err)
    apiError.value = true
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

  if (error.value) { console.error(error.value) }
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

  console.log(actions[0].available_actions)

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
      pattern: {
        react_on: 'firing',
        group: 'alerts',
        key: '',
        value: '',
      },
    },
  )
}

const validateAccountForm = () => {
  refAccountForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const validatePersonalForm = () => {
  refPersonalForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    }
    else { isCurrentStepValid.value = false }
  })
}

const validateSocialLinkForm = () => {
  refSocialLinkForm.value?.validate().then(valid => {
    if (valid.valid) {
      isCurrentStepValid.value = true

      console.log({
        ...accountForm.value,
        ...personalForm.value,
        ...socialForm.value,
      })
    }
    else { isCurrentStepValid.value = false }
  })
}

onMounted(() => {
  getProjects()
})
</script>

<template>
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
            ref="refAccountForm"
            @submit.prevent="validateAccountForm"
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
            ref="refPersonalForm"
            @submit.prevent="validatePersonalForm"
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
            ref="refPersonalForm"
            @submit.prevent="validatePersonalForm"
          >
            <VRow>
              <VCol cols="12">
                <h6 class="text-h6">
                  Actions
                </h6>
                <p class="text-sm mb-0">
                  Select an Condition which should trigger the Action/s
                </p>
              </VCol>

              <VCol cols="12">
                <CustomRadiosWithIcon
                  v-model:selected-radio="flow.actions_details.pattern_type"
                  :radio-content="actionConditions"
                  :grid-column="{ cols: '12', sm: '6' }"
                />
              </VCol>

              <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'common'">
                <VSelect
                  v-model="flow.actions_details.pattern.react_on"
                  :items="['firing', 'resolved', 'both']"
                  placeholder="firing"
                  :rules="[requiredValidator]"
                  label="React On"
                />
              </VCol>

              <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'common'">
                <VSelect
                  v-model="flow.actions_details.pattern.group"
                  :items="['alerts', 'groupLabels', 'commonLabels', 'commonAnnotations']"
                  placeholder="alerts"
                  :rules="[requiredValidator]"
                  label="Object Group"
                />
              </VCol>

              <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'common'">
                <VTextField
                  v-model="flow.actions_details.pattern.key"
                  placeholder="alertname"
                  :rules="[requiredValidator]"
                  label="Object Key"
                />
              </VCol>

              <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'common'">
                <VTextField
                  v-model="flow.actions_details.pattern.value"
                  placeholder="MyAlarm"
                  :rules="[requiredValidator]"
                  label="Object Value"
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
            ref="refPersonalForm"
            @submit.prevent="validatePersonalForm"
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

                      <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'custom'">
                        <VSelect
                          v-model="flow.actions[index].pattern.react_on"
                          :items="['firing', 'resolved', 'both']"
                          placeholder="firing"
                          :rules="[requiredValidator]"
                          label="React On"
                        />
                      </VCol>

                      <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'custom'">
                        <VSelect
                          v-model="flow.actions[index].pattern.group"
                          :items="['alerts', 'groupLabels', 'commonLabels', 'commonAnnotations']"
                          placeholder="alerts"
                          :rules="[requiredValidator]"
                          label="Object Group"
                        />
                      </VCol>

                      <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'custom'">
                        <VTextField
                          v-model="flow.actions[index].pattern.key"
                          placeholder="alertname"
                          :rules="[requiredValidator]"
                          label="Object Key"
                        />
                      </VCol>

                      <VCol cols="12" md="6" v-if="flow.actions_details.pattern_type === 'custom'">
                        <VTextField
                          v-model="flow.actions[index].pattern.value"
                          placeholder="MyAlarm"
                          :rules="[requiredValidator]"
                          label="Object Value"
                        />
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
            ref="refSocialLinkForm"
            @submit.prevent="validateSocialLinkForm"
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
                          {{ flow.actions_details.pattern_type === 'common' ? 'Common Pattern for all Actions' : 'Custom Pattern per Action' }}
                        </p>
                      </td>
                    </tr>
                    <tr v-if="flow.actions_details.pattern_type === 'common'">
                      <td class="pe-6">
                        Pattern React On:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ flow.actions_details.pattern.react_on }}
                        </p>
                      </td>
                    </tr>
                    <tr v-if="flow.actions_details.pattern_type === 'common'">
                      <td class="pe-6">
                        Pattern Group:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ flow.actions_details.pattern.group }}
                        </p>
                      </td>
                    </tr>
                    <tr v-if="flow.actions_details.pattern_type === 'common'">
                      <td class="pe-6">
                        Pattern Key:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ flow.actions_details.pattern.key }}
                        </p>
                      </td>
                    </tr>
                    <tr v-if="flow.actions_details.pattern_type === 'common'">
                      <td class="pe-6">
                        Pattern Value:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ flow.actions_details.pattern.value }}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h6 class="text-h6 mt-6 mb-4">
                  {{ flow.actions.length }} Actions
                </h6>

                <table class="text-body-1">
                  <tbody
                    v-for="(action, index) in flow.actions"
                    :key="index"
                  >
                    <tr>
                      <td class="pe-6">
                        Name:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ action.name }}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td class="pe-6">
                        Description:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ action.description }}
                        </p>
                      </td>
                    </tr>
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
                    <tr v-if="flow.actions_details.pattern_type === 'custom'">
                      <td class="pe-6">
                        Pattern React on:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ action.pattern.react_on }}
                        </p>
                      </td>
                    </tr>
                    <tr v-if="flow.actions_details.pattern_type === 'custom'">
                      <td class="pe-6">
                        Pattern Group:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ action.pattern.group }}
                        </p>
                      </td>
                    </tr>
                    <tr v-if="flow.actions_details.pattern_type === 'custom'">
                      <td class="pe-6">
                        Pattern Key:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ action.pattern.key }}
                        </p>
                      </td>
                    </tr>
                    <tr v-if="flow.actions_details.pattern_type === 'custom'">
                      <td class="pe-6">
                        Pattern Value:
                      </td>
                      <td>
                        <p class="mb-0 text-wrap me-4">
                          {{ action.pattern.value }}
                        </p>
                      </td>
                    </tr>
                    <VDivider class="mt-4 mb-2" />
                  </tbody>
                </table>
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
