<template>
  <header class="flex justify-between p-3 bg-gray-200">
    <div class="items-center flex">
      <CryptocurrencyMth class="text-cool-gray-400 text-[1rem]" />
      <p class="text-[1rem] ml-4 font-semibold font-mono">mt ┗|｀O′|┛ 嗷~~</p>
    </div>
    <div class="w-[100px] flex justify-around cursor-pointer items-center">
      <ic:round-refresh class="text-[1rem]" title="刷新页面"></ic:round-refresh>
      <icon-park-outline:setting-two class="text-[0.8rem]"></icon-park-outline:setting-two>
      <mdi:close-circle-outline class="text-[1rem]" @click="close" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { sendMessage } from 'webext-bridge'
function close() {
  // 发送给background 然后在给到content
  chrome.runtime.sendMessage({ context: 'background' })
  sendMessage('close-popup', {}, { context: 'background', tabId: 0 })
}
</script>
