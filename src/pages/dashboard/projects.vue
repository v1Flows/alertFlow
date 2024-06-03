<script setup lang="ts">
import { uuid } from 'vue-uuid'

definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const apiError = ref(false)

const projects = ref([])
const loadingProjects = ref(false)

const createProjectLoading = ref(false)
const createProjectDialog = ref(false)

const createProjectData = ref({
  id: uuid.v4(),
  name: '',
  description: '',
  members: [{ email: useCookie('userData').value.email, role: 'Owner' }],
})

const projectMemberToAdd = ref('')

const editProjectDialog = ref(false)
const editProjectLoading = ref(false)

const editProjectData = ref({
  id: null,
  name: null,
  description: null,
  members: null,
  alertflow_runners: null,
})

const deleteProjectDialog = ref(false)
const deleteProjectLoading = ref(false)
const projectToDelete = ref('')

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

    projects.value = await JSON.parse(data.value).projects
    loadingProjects.value = false
  }
  catch (err) {
    console.error(err)
    loadingProjects.value = false
    apiError.value = true
  }
}

const editAddProjectMember = (projectMember: string) => {
  editProjectData.value.members.push({ email: projectMember, role: 'Viewer' })
  projectMemberToAdd.value = ''
}

const editRemoveProjectMember = (memberIndex: number) => {
  editProjectData.value.members.splice(memberIndex, 1)
}

const addProjectMember = (projectMember: string) => {
  createProjectData.value.members.push({ email: projectMember, role: 'Viewer' })
  projectMemberToAdd.value = ''
}

const removeProjectMember = (memberIndex: number) => {
  createProjectData.value.members.splice(memberIndex, 1)
}

const createProject = async (project: any) => {
  createProjectLoading.value = true
  console.log(project)

  try {
    const { data, error } = await useFetch('https://alertflow.justlab.xyz/api/projects/', {
      method: 'POST',
      body: JSON.stringify(project),
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      apiError.value = true
      createProjectDialog.value = false
      createProjectLoading.value = false
      console.error(error.value)
    }
    else if (data.value) {
      apiError.value = false
      createProjectDialog.value = false
      createProjectLoading.value = false
      getProjects()
    }
  }
  catch (err) {
    console.error(err)
    createProjectDialog.value = false
    createProjectLoading.value = false
    apiError.value = true
  }
}

const editProjectFn = async () => {
  editProjectLoading.value = true

  const { error } = await useFetch(`https://alertflow.justlab.xyz/api/projects/${editProjectData.value.id}`, {
    method: 'PUT',
    headers: {
      'Authorization': useCookie('accessToken').value,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: editProjectData.value.name,
      description: editProjectData.value.description,
      members: editProjectData.value.members,
      alertflow_runners: editProjectData.value.alertflow_runners,
    }),
  })

  if (error.value) {
    apiError.value = true
    editProjectLoading.value = false
    console.error(error.value)
  }
  else {
    editProjectLoading.value = false
    getProjects()
  }
}

const editProject = (project: any) => {
  editProjectData.value = {
    id: project.id,
    name: project.name,
    description: project.description,
    members: project.members,
    alertflow_runners: project.alertflow_runners,
  }
  editProjectDialog.value = true
}

const deleteProjectFn = (projectID: string) => {
  deleteProjectDialog.value = true
  projectToDelete.value = projectID
}

const deleteProject = async (projectID: string) => {
  deleteProjectLoading.value = true
  try {
    const { data, error } = await useFetch(`https://alertflow.justlab.xyz/api/projects/${projectID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': useCookie('accessToken').value,
        'Content-Type': 'application/json',
      },
    })

    if (error.value) {
      apiError.value = true
      deleteProjectDialog.value = false
      deleteProjectLoading.value = false
      console.error(error.value)
    }
    else if (data.value) {
      apiError.value = false
      deleteProjectDialog.value = false
      deleteProjectLoading.value = false
      getProjects()
    }
  }
  catch (err) {
    console.error(err)
    apiError.value = true
    deleteProjectDialog.value = false
    deleteProjectLoading.value = false
  }
}

onMounted(async () => {
  await getProjects()
})
</script>

<template>
  <VAlert
    v-model="apiError"
    title="Error communicating with API"
    text="Please try again later"
    type="error"
    variant="tonal"
  />

  <div>
    <VRow class="match-height">
      <VCol
        cols="12"
        md="6"
        sm="6"
        align="left"
      >
        <p class="text-2xl mb-0">
          Projects
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
          prepend-icon="ri-add-line"
          variant="tonal"
          @click="createProjectDialog = true"
        >
          Create Project
        </VBtn>
      </VCol>
    </VRow>

    <VRow>
      <VCol
        v-for="project in projects"
        :key="project.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <VCard>
          <VCardText class="d-flex align-center pb-4">
            <span>Total of {{ project.members ? project.members.length : 0 }} users in this project</span>
          </VCardText>

          <VCardText>
            <div class="d-flex justify-space-between align-end">
              <div>
                <h5 class="text-h5 mb-1">
                  {{ project.name }}
                </h5>

                <p class="text-body-1">
                  {{ project.description }}
                </p>
              </div>
            </div>
          </VCardText>

          <VCardText>
            <VRow class="match-height">
              <VCol
                cols="12"
                md="7"
              >
                <RouterLink :to="`/dashboard/project/${project.id}`">
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
                md="3"
              >
                <VBtn
                  color="warning"
                  variant="outlined"
                  rounded
                  block
                  @click="editProject(project)"
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
                  variant="outlined"
                  rounded
                  block
                  @click="deleteProjectFn(project.id)"
                />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>

  <!-- 👉 Add Project Dialog -->
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900 "
    :model-value="createProjectDialog"
    persistent
  >
    <VCard class="pa-sm-11 pa-3">
      <VCardText class="pt-5">
        <!-- 👉 dialog close btn -->
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="createProjectDialog = false"
        />

        <!-- 👉 Title -->
        <div class="text-center mb-6">
          <h4 class="text-h4 mb-2">
            Create Project
          </h4>

          <p class="text-body-1">
            Within an Project you can see Payloads, create Flows and add Actions
          </p>
        </div>

        <!-- 👉 Form -->
        <VForm>
          <VRow>
            <!-- 👉 Project Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="createProjectData.name"
                label="Name of the Project"
                placeholder="My Project"
              />
            </VCol>

            <!-- 👉 Project Description -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="createProjectData.description"
                label="Description"
                placeholder="My Project Description"
              />
            </VCol>

            <VCol cols="12">
              <h2 class="text-lg font-weight-medium">
                Members
              </h2>
            </VCol>

            <VCol cols="10">
              <VTextField
                v-model="projectMemberToAdd"
                label="Members of the Project (Enter Mail Address)"
                placeholder="firstname.lastname@company.com"
              />
            </VCol>

            <VCol cols="2">
              <VBtn
                color="primary"
                variant="tonal"
                class="me-3 mt-1"
                @click="addProjectMember(projectMemberToAdd)"
              >
                Add Member
              </VBtn>
            </VCol>

            <VCol cols="12">
              <VList class="card-list mb-6">
                <VListItem
                  v-for="(member, index) in createProjectData.members"
                  :key="index"
                >
                  <template #prepend>
                    <VAvatar
                      icon="ri-user-3-line"
                      class="me-1"
                    />
                  </template>

                  <VListItemTitle class="text-high-emphasis">
                    {{ member.email }}
                  </VListItemTitle>

                  <template #append>
                    <VBtn
                      variant="text"
                      color="secondary"
                      :icon="$vuetify.display.xs"
                    >
                      <template v-if="!$vuetify.display.xs">
                        {{ member.role }}
                      </template>
                      <VIcon
                        end
                        icon="ri-arrow-down-s-line"
                        size="16"
                        :class="$vuetify.display.xs ? 'ms-0' : ''"
                      />

                      <VMenu activator="parent">
                        <VList :selected="[member.role]">
                          <VListItem
                            v-for="(item, index) in ['Owner', 'Editor', 'Viewer']"
                            :key="index"
                            :value="item"
                            @click="member.role = item"
                          >
                            <VListItemTitle>{{ item }}</VListItemTitle>
                          </VListItem>
                        </VList>
                      </VMenu>
                    </VBtn>
                    <VBtn
                      icon="ri-close-line"
                      variant="plain"
                      class="ms-2"
                      @click="removeProjectMember(index)"
                    />
                  </template>
                </VListItem>
              </VList>
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
                :loading="createProjectLoading"
                @click="async () => { await createProject(createProjectData); createProjectDialog = false; }"
              >
                submit
              </VBtn>

              <VBtn
                variant="outlined"
                color="secondary"
                @click="createProjectDialog = false"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- 👉 Edit Project Dialog -->
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900 "
    :model-value="editProjectDialog"
    persistent
  >
    <VCard class="pa-sm-11 pa-3">
      <VCardText class="pt-5">
        <!-- 👉 dialog close btn -->
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="editProjectDialog = false"
        />

        <!-- 👉 Title -->
        <div class="text-center mb-6">
          <h4 class="text-h4 mb-2">
            Edit Project
          </h4>

          <p class="text-body-1">
            Within an Project you can see Payloads, create Flows and add Actions
          </p>
        </div>

        <!-- 👉 Form -->
        <VForm>
          <VRow>
            <!-- 👉 Project Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="editProjectData.name"
                label="Name of the Project"
                placeholder="My Project"
              />
            </VCol>

            <!-- 👉 Project Description -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="editProjectData.description"
                label="Description"
                placeholder="My Project Description"
              />
            </VCol>

            <VCol cols="12">
              <h5 class="text-h5">
                Project Settings
              </h5>
            </VCol>

            <VCol cols="12">
              <p class="text-body-1 mb-0">
                Enable AlertFlow Hosted Runners:
              </p>
              <VSwitch
                v-model="editProjectData.alertflow_runners"
                :label="editProjectData.alertflow_runners ? 'Enabled' : 'Disabled'"
                :true-value="true"
                :false-value="false"
                color="success"
              />
            </VCol>

            <VCol cols="12">
              <h5 class="text-h5">
                Project Members
              </h5>
            </VCol>

            <VCol cols="10">
              <VTextField
                v-model="projectMemberToAdd"
                label="Members of the Project (Enter Mail Address)"
                placeholder="firstname.lastname@company.com"
              />
            </VCol>

            <VCol cols="2">
              <VBtn
                color="primary"
                variant="tonal"
                class="me-3 mt-1"
                @click="editAddProjectMember(projectMemberToAdd)"
              >
                Add Member
              </VBtn>
            </VCol>

            <VCol cols="12">
              <VList class="card-list mb-6">
                <VListItem
                  v-for="(member, index) in editProjectData.members"
                  :key="index"
                >
                  <template #prepend>
                    <VAvatar
                      icon="ri-user-3-line"
                      class="me-1"
                    />
                  </template>

                  <VListItemTitle class="text-high-emphasis">
                    {{ member.email }}
                  </VListItemTitle>

                  <template #append>
                    <VBtn
                      variant="text"
                      color="secondary"
                      :icon="$vuetify.display.xs"
                    >
                      <template v-if="!$vuetify.display.xs">
                        {{ member.role }}
                      </template>
                      <VIcon
                        end
                        icon="ri-arrow-down-s-line"
                        size="16"
                        :class="$vuetify.display.xs ? 'ms-0' : ''"
                      />

                      <VMenu activator="parent">
                        <VList :selected="[member.role]">
                          <VListItem
                            v-for="(item, index) in ['Owner', 'Editor', 'Viewer']"
                            :key="index"
                            :value="item"
                            @click="member.role = item"
                          >
                            <VListItemTitle>{{ item }}</VListItemTitle>
                          </VListItem>
                        </VList>
                      </VMenu>
                    </VBtn>
                    <VBtn
                      icon="ri-close-line"
                      variant="plain"
                      class="ms-2"
                      @click="editRemoveProjectMember(index)"
                    />
                  </template>
                </VListItem>
              </VList>
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
                :loading="editProjectLoading"
                @click="async () => { await editProjectFn(); editProjectDialog = false; }"
              >
                submit
              </VBtn>

              <VBtn
                variant="outlined"
                color="secondary"
                @click="editProjectDialog = false"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- Delete Project Dialog -->
  <VDialog
    v-model="deleteProjectDialog"
    persistent
    class="v-dialog-sm"
  >
    <!-- Dialog Content -->
    <VCard title="Delete Project">
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="deleteProjectDialog = false"
      />

      <VCardText>
        Are you sure you want to delete this Project?
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-4">
        <VBtn
          color="secondary"
          @click="deleteProjectDialog = false"
        >
          Cancel
        </VBtn>
        <VBtn
          color="error"
          @click="deleteProject(projectToDelete)"
        >
          Delete
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
