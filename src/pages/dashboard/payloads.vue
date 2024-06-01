<script setup lang="ts">
import { VCodeBlock } from '@wdns/vue-code-block'

definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

interface Payload {
  id: string
  created_at: string
  payload: string
}

const apiError = ref(false)

const payloads = ref<Payload[]>([])
const payloadsToday = ref<Payload[]>([])
const payloadsLast7Days = ref<Payload[]>([])
const payloadsLast30Days = ref<Payload[]>([])
const showPayloadDialog = ref(false)
const showPayloadData = ref({})

const getTodaysPayloads = () => {
  const now = new Date()

  payloadsToday.value = payloads.value.filter(payload => new Date(payload.created_at) >= now)
}

const getLast7DaysPayloads = () => {
  const now = new Date()
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  payloadsLast7Days.value = payloads.value.filter(payload => new Date(payload.created_at) >= last7Days)
}

const getLast30DaysPayloads = () => {
  const now = new Date()
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  payloadsLast30Days.value = payloads.value.filter(payload => new Date(payload.created_at) >= last30Days)
}

const getPayloads = async () => {
  const { data, error } = await useFetch('https://alertflow-api.justlab.xyz/api/payloads/', {
    headers: {
      'Authorization': useCookie('accessToken').value,
      'Content-Type': 'application/json',
    },
  })

  if (error.value) {
    apiError.value = true
    console.error(error.value)
  }
  else if (data.value) {
    apiError.value = false
    payloads.value = JSON.parse(data.value).payloads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    getTodaysPayloads()
    getLast7DaysPayloads()
    getLast30DaysPayloads()
  }
}

const showPayload = (payload: string) => {
  showPayloadData.value = JSON.stringify(payload)
  showPayloadDialog.value = true
}

onMounted(() => getPayloads())
</script>

<template>
  <div>
    <p class="text-2xl mb-6">
      Payloads
    </p>
    <VAlert
      v-model="apiError"
      title="Error receiving payloads from API"
      text="Please try again later"
      type="error"
      variant="tonal"
    />
    <div class="mb-6">
      <VRow>
        <VCol
          sm="3"
          cols="12"
        >
          <VCard>
            <VCardText class="d-flex align-center">
              <VAvatar
                size="40"
                rounded="lg"
                color="success"
                variant="tonal"
                class="me-4"
              >
                <VIcon
                  icon="ri-numbers-line"
                  size="24"
                />
              </VAvatar>

              <div class="d-flex flex-column">
                <div class="d-flex align-center flex-wrap gap-x-2">
                  <h5 class="text-h5">
                    {{ payloads.length }}
                  </h5>
                </div>
                <div class="text-body-1">
                  Payloads total
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          sm="3"
          cols="12"
        >
          <VCard>
            <VCardText class="d-flex align-center">
              <VAvatar
                size="40"
                rounded="lg"
                color="success"
                variant="tonal"
                class="me-4"
              >
                <VIcon
                  icon="ri-number-1"
                  size="24"
                />
              </VAvatar>

              <div class="d-flex flex-column">
                <div class="d-flex align-center flex-wrap gap-x-2">
                  <h5 class="text-h5">
                    {{ payloadsToday.length }}
                  </h5>
                </div>
                <div class="text-body-1">
                  Payloads today
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          sm="3"
          cols="12"
        >
          <VCard>
            <VCardText class="d-flex align-center">
              <VAvatar
                size="40"
                rounded="lg"
                color="success"
                variant="tonal"
                class="me-4"
              >
                <VIcon
                  icon="ri-number-7"
                  size="24"
                />
              </VAvatar>

              <div class="d-flex flex-column">
                <div class="d-flex align-center flex-wrap gap-x-2">
                  <h5 class="text-h5">
                    {{ payloadsLast7Days.length }}
                  </h5>
                </div>
                <div class="text-body-1">
                  Payloads last 7 days
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          sm="3"
          cols="12"
        >
          <VCard>
            <VCardText class="d-flex align-center">
              <VAvatar
                size="40"
                rounded="lg"
                color="success"
                variant="tonal"
                class="me-4"
              >
                <VIcon
                  icon="ri-replay-30-line"
                  size="24"
                />
              </VAvatar>

              <div class="d-flex flex-column">
                <div class="d-flex align-center flex-wrap gap-x-2">
                  <h5 class="text-h5">
                    {{ payloadsLast30Days.length }}
                  </h5>
                </div>
                <div class="text-body-1">
                  Payloads last 30 days
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </div>
    <VCard>
      <VCardText>
        <VList class="card-list">
          <VListItem
            v-for="payload in payloads"
            :key="payload.id"
          >
            <template #prepend>
              <VIcon icon="ri-git-repository-commits-line" />
            </template>
            <template #title>
              <div class="text-h6 me-4 mb-2 text-truncate">
                {{ payload.id }}
              </div>
            </template>

            <VListItemSubtitle>{{ new Date(payload.created_at).toLocaleString() }}</VListItemSubtitle>
            <template #append>
              <VBtn
                variant="tonal"
                color="secondary"
                class="rounded"
                size="34"
                @click="showPayload(payload.payload)"
              >
                <VIcon
                  icon="ri-arrow-right-s-line"
                  size="20"
                  class="flip-in-rtl"
                />
              </VBtn>
            </template>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
    <VDialog
      v-model="showPayloadDialog"
      class="v-dialog-sm"
    >
      <VCard title="Payload Data">
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="showPayloadDialog = false"
        />

        <VCardText>
          <VCodeBlock
            :code="showPayloadData"
            :indent="2"
            lang="json"
            highlightjs
            theme="tokyo-night-dark"
            :copy-button="false"
            code-block-radius="0rem"
          />
        </VCardText>

        <VCardText class="d-flex justify-end flex-wrap gap-4">
          <VBtn
            color="info"
            variant="tonal"
            @click="showPayloadDialog = false"
          >
            Close
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 1.5rem;
}
</style>
