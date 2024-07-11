<template>
  <div
    class="11111"
    role="separator"
  >
    <div
    >
    11111111111111
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { computed } from 'vue'
// import { useNamespace } from '@element-plus/hooks'
// import { dividerProps } from './divider'
// import type { CSSProperties } from 'vue'

defineOptions({
  name: 'ElDivider',
})
// const props = defineProps(dividerProps)
// const ns = useNamespace('divider')
// const dividerStyle = computed(() => {
//   return ns.cssVar({
//     'border-style': props.borderStyle,
//   }) as CSSProperties
// })
</script>
