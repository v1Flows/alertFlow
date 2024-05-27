<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import avatar1 from '@images/avatars/avatar-1.png'

const router = useRouter()
const ability = useAbility()

const userData = useCookie<any>('userData')
const logoutLoading = ref(false)
const apiError = ref(false)

const logout = async () => {
  logoutLoading.value = true

  const requestBody = ref({
    token: useCookie('accessToken').value,
  })

  try {
    const { data, error } = await useFetch('https://alertflow-api.justlab.xyz/auth/logout', {
      method: 'POST',
      body: JSON.stringify(requestBody.value),
    })

    if (error.value) {
      logoutLoading.value = false
      apiError.value = true
      console.log(useCookie('accessToken').value)
      console.error(error.value)
    }
    else if (data.value) {
      logoutLoading.value = false
      apiError.value = false

      // Remove "accessToken" from cookie
      useCookie('accessToken').value = null

      // Remove "userData" from cookie
      useCookie('userData').value = null

      // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
      // Remove "userAbilities" from cookie
      useCookie('userAbilityRules').value = null

      // Reset ability to initial ability
      ability.update([])

      // Redirect to login page
      await router.push('/login')

      console.log(data.value)
    }
  }
  catch (error) {
    console.error(error)
    logoutLoading.value = false
    apiError.value = true
  }
}

const userProfileList = [
  { type: 'divider' },
  {
    type: 'navItem',
    icon: 'ri-user-line',
    title: 'Profile',
    href: '#',
  },
  {
    type: 'navItem',
    icon: 'ri-settings-4-line',
    title: 'Settings',
    href: '#',
  },
]
</script>

<template>
  <VBadge
    dot
    bordered
    location="bottom right"
    offset-x="2"
    offset-y="2"
    color="success"
    class="user-profile-badge"
  >
    <VAvatar
      class="cursor-pointer"
      size="38"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="15px"
      >
        <VList>
          <VListItem class="px-4">
            <div class="d-flex gap-x-2 align-center">
              <div>
                <div class="text-body-2 font-weight-medium text-high-emphasis">
                  {{ userData.email }}
                </div>
                <div class="text-capitalize text-caption text-disabled">
                  Admin
                </div>
              </div>
            </div>
          </VListItem>

          <PerfectScrollbar :options="{ wheelPropagation: false }">
            <template
              v-for="item in userProfileList"
              :key="item.title"
            >
              <VListItem
                v-if="item.type === 'navItem'"
                :href="item.href"
                class="px-4"
              >
                <template #prepend>
                  <VIcon
                    :icon="item.icon"
                    size="22"
                  />
                </template>

                <VListItemTitle>{{ item.title }}</VListItemTitle>

                <template
                  v-if="item.chipsProps"
                  #append
                >
                  <VChip
                    v-bind="item.chipsProps"
                    variant="elevated"
                  />
                </template>
              </VListItem>

              <VDivider
                v-else
                class="my-1"
              />
            </template>

            <VListItem class="px-4">
              <VBtn
                block
                color="error"
                size="small"
                append-icon="ri-logout-box-r-line"
                @click="logout"
              >
                Logout
              </VBtn>
            </VListItem>
          </PerfectScrollbar>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<style lang="scss">
.user-profile-badge {
  &.v-badge--bordered.v-badge--dot .v-badge__badge::after {
    color: rgb(var(--v-theme-background));
  }
}
</style>
