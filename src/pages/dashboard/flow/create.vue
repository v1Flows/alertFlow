<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'

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
    subtitle: 'Add Actions',
  },
  {
    title: 'Summary',
    subtitle: 'Summary',
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

const projectList = ref([])
const runnerList = ref([])
const actionList = ref([])

const flow = ref({
  name: '',
  description: '',
  project_id: '',
  runner_id: '',
  active: true,
  actions: [
    {
      name: '',
      description: '',
      active: true,
      type: 'log',
      react_on: null,
      patternGroup: null,
      patternLabelKey: '',
      patternLabelValue: '',
      webhookUrl: '',
      webhookAuthToken: '',
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
  const actions = runnerList.value.filter(runner => runner.value === flow.value.runner_id)

  console.log(actions)

  for (const action of actions) {
    actionList.value.push({
      title: action.title,
      value: action.value,
    })
  }
}

const removeAction = () => {
  flow.value.actions.pop()
}

const addAction = () => {
  flow.value.actions.push({})
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
                  Setup Actions
                </p>
              </VCol>

              <VCol cols="12">
                <VExpansionPanels multiple>
                  <VExpansionPanel
                    v-for="(action, index) in flow.actions"
                    :key="index"
                  >
                    <VExpansionPanelTitle>
                      #{{ index + 1 }} Action
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <CustomRadiosWithIcon
                        v-model:selected-radio="flow.actions[index].type"
                        :radio-content="actionList"
                        :grid-column="{ cols: '12', sm: '4' }"
                      />
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
                  Social Links
                </h6>
                <p class="text-sm mb-0">
                  Add Social Links
                </p>
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.twitter"
                  placeholder="https://twitter.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Twitter"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.facebook"
                  placeholder="https://facebook.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Facebook"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.googlePlus"
                  placeholder="https://plus.google.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="Google+"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VTextField
                  v-model="socialForm.LinkedIn"
                  placeholder="https://likedin.com/abc"
                  :rules="[requiredValidator, urlValidator]"
                  label="LinkedIn"
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
