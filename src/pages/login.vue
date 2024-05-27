<script setup lang="ts">
import { useGenerateImageVariant } from '@/@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png'
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

const route = useRoute()
const router = useRouter()
const ability = useAbility()

const form = ref({
  email: '',
  password: '',
})

const loadingLogin = ref(false)
const apiError = ref(false)

definePage({
  meta: {
    layout: 'blank',
  },
})

const isPasswordVisible = ref(false)
const authV2LoginMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)
const authV2LoginIllustration = useGenerateImageVariant (authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)

const login = async () => {
  loadingLogin.value = true

  interface Response {
    User: {
      access_token: string
      token_type: string
      expires_in: number
      refresh_token: string
      user: {
        id: string
        aud: string
        role: string
        email: string
        invited_at: string
        confirmed_at: string
        confirmation_sent_at: string
        app_metadata: JSON
        user_metadata: JSON
        created_at: string
        updated_at: string
      }
      provider_token: string
      provider_refresh_token: string
    }
    result: string
  }

  try {
    const { data, error } = await useFetch<Response>('https://alertflow-api.justlab.xyz/auth/login', {
      method: 'POST',
      body: JSON.stringify(form.value),
    })

    if (error.value) {
      loadingLogin.value = false
      apiError.value = true
      console.error(error.value)
    }
    else if (data.value) {
      loadingLogin.value = false
      useCookie('userAbilityRules').value = JSON.parse(data.value).User.user.role === 'authenticated' ? 'all' : 'Comment'

      ability.update([{
        action: 'manage',
        subject: JSON.parse(data.value).User.user.role === 'authenticated' ? 'all' : 'Comment',
      }])

      useCookie('userData').value = JSON.parse(data.value).User.user
      useCookie('accessToken').value = JSON.parse(data.value).User.access_token

      await nextTick(() => {
        router.replace(route.query.to ? String(route.query.to) : '/')
      })
    }
  }
  catch (error) {
    console.error(error)
    loadingLogin.value = false
    apiError.value = true
  }
}
</script>

<template>
  <RouterLink to="/">
    <div class="app-logo auth-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="app-logo-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex align-center justify-center position-relative"
    >
      <div class="d-flex align-center justify-center pa-10">
        <img
          :src="authV2LoginIllustration"
          class="auth-illustration w-100"
          alt="auth-illustration"
        >
      </div>
      <VImg
        :src="authV2LoginMask"
        class="d-none d-md-flex auth-footer-mask"
        alt="auth-mask"
      />
    </VCol>
    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-5 pa-lg-7"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to <span class="text-capitalize">{{ themeConfig.app.title }}! 👋🏻</span>
          </h4>

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="() => {}">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  autofocus
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap my-6 gap-x-2">
                  <a
                    class="text-primary"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <!-- login button -->
                <VBtn
                  block
                  type="submit"
                  :loading="loadingLogin"
                  @click="login"
                >
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
