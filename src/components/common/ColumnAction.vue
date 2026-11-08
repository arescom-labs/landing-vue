<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import type { ICellRendererParams } from 'ag-grid-community'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ColumnActionConfirm {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
}

interface ColumnAction {
  key: string
  label?: string
  icon?: Component
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  class?: string
  tooltip?: string | ((params: ICellRendererParams) => string)
  visible?: boolean | ((params: ICellRendererParams) => boolean)
  disabled?: boolean | ((params: ICellRendererParams) => boolean)
  confirm?: ColumnActionConfirm
  onClick: (params: ICellRendererParams) => void | Promise<void>
}

interface ColumnActionParams extends ICellRendererParams {
  actions: ColumnAction[] | ((params: ColumnActionParams) => ColumnAction[])
}

const props = defineProps<{
  params: ColumnActionParams
}>()

/**
 * 현재 Action 목록
 */
const actions = computed<ColumnAction[]>(() => {
  const { actions } = props.params

  return typeof actions === 'function' ? actions(props.params) : actions
})

/**
 * 표시할 Action 목록
 */
const visibleActions = computed(() => {
  return actions.value.filter((action) => {
    if (typeof action.visible === 'function') {
      return action.visible(props.params)
    }

    return action.visible !== false
  })
})

/**
 * Action 비활성화 여부
 */
const isDisabled = (action: ColumnAction) => {
  if (typeof action.disabled === 'function') {
    return action.disabled(props.params)
  }

  return action.disabled === true
}

/**
 * Tooltip 내용
 */
const getTooltip = (action: ColumnAction) => {
  if (typeof action.tooltip === 'function') {
    return action.tooltip(props.params)
  }

  return action.tooltip
}

/**
 * Tooltip 표시 여부
 * label이 없고 tooltip 내용이 있을 때만 표시
 */
const hasTooltip = (action: ColumnAction) => {
  return !action.label && !!getTooltip(action)
}

/**
 * 현재 확인 대기 중인 Action
 */
const pendingAction = ref<ColumnAction | null>(null)

/**
 * 확인 Dialog 표시 여부
 */
const isConfirmOpen = ref(false)

/**
 * Action 클릭
 */
const handleClick = async (action: ColumnAction) => {
  if (isDisabled(action)) {
    return
  }

  if (!action.confirm) {
    await action.onClick(props.params)
    return
  }

  pendingAction.value = action
  isConfirmOpen.value = true
}

/**
 * 확인 버튼 클릭
 */
const handleConfirm = async () => {
  const action = pendingAction.value

  if (!action) {
    return
  }

  try {
    await action.onClick(props.params)
  } finally {
    pendingAction.value = null
    isConfirmOpen.value = false
  }
}

/**
 * 취소
 */
const handleCancel = () => {
  pendingAction.value = null
  isConfirmOpen.value = false
}
</script>

<template>
  <TooltipProvider>
    <div class="flex h-full items-center justify-center gap-1">
      <Tooltip v-for="action in visibleActions" :key="action.key" :disabled="!hasTooltip(action)">
        <TooltipTrigger as-child>
          <Button
            :variant="action.variant ?? 'outline'"
            :size="action.size ?? 'sm'"
            :class="action.class"
            :disabled="isDisabled(action)"
            @click="handleClick(action)"
          >
            <component :is="action.icon" v-if="action.icon" class="size-4 shrink-0" />

            <span v-if="action.label">
              {{ action.label }}
            </span>
          </Button>
        </TooltipTrigger>

        <TooltipContent v-if="hasTooltip(action)" side="top">
          {{ getTooltip(action) }}
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>

  <!-- Action 확인 Dialog -->
  <AlertDialog :open="isConfirmOpen" @update:open="(value) => !value && handleCancel()">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{ pendingAction?.confirm?.title }}
        </AlertDialogTitle>

        <AlertDialogDescription>
          {{ pendingAction?.confirm?.description }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">
          {{ pendingAction?.confirm?.cancelText ?? '취소' }}
        </AlertDialogCancel>

        <AlertDialogAction
          :class="
            pendingAction?.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : ''
          "
          @click="handleConfirm"
        >
          {{ pendingAction?.confirm?.confirmText ?? '확인' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
