<script setup lang="ts">
import illustrationJohnDark from '@images/cards/illustration-john-dark.png'
import illustrationJohnLight from '@images/cards/illustration-john-light.png'

import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'

definePage({
  meta: {
    action: 'create',
    subject: 'all',
  },
})

const johnImage = useGenerateImageVariant(illustrationJohnLight, illustrationJohnDark)
</script>

<template>
  <div>
    <div class="pe-3">
      <div class="mb-2">
        <span class="text-h5">
          Welcome back,
        </span>
        <span class="text-h4">
          {{ useCookie('userData').value.username }} 👋🏻
        </span>
      </div>

      <div
        class="text-wrap text-body-1 mb-4"
        style="max-inline-size: 400px;"
      >
        Let's take a look at some of your numbers.
      </div>

      <div class="d-flex justify-space-between flex-wrap gap-6 flex-column flex-md-row">
        <div
          v-for="{ title, value, icon, color } in [
            { title: 'Received Payloads', value: '34', icon: 'ri-file-list-3-line', color: 'primary' },
            { title: 'Executed Actions', value: '82', icon: 'ri-hammer-line', color: 'info' },
            { title: 'Completed Executions', value: '14', icon: 'ri-terminal-line', color: 'success' },
            { title: 'Failed Executions', value: '2', icon: 'ri-emotion-unhappy-line', color: 'error' },
          ]"
          :key="title"
        >
          <div class="d-flex">
            <VAvatar
              variant="tonal"
              :color="color"
              rounded
              size="54"
              class="text-primary me-4"
            >
              <VIcon
                :icon="icon"
                size="38"
              />
            </VAvatar>
            <div>
              <h6 class="text-h6 text-medium-emphasis">
                {{ title }}
              </h6>
              <h4
                class="text-h4"
                :class="`text-${color}`"
              >
                {{ value }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
