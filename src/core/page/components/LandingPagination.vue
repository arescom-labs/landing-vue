<script setup lang="ts">
import { computed } from 'vue'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * =========================================================
 * Props
 * =========================================================
 */

interface Props {
  /**
   * 현재 페이지
   *
   * 1부터 시작
   */
  currentPage?: number

  /**
   * 페이지당 데이터 건수
   */
  pageSize?: number

  /**
   * 전체 데이터 건수
   */
  totalCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
})

/**
 * =========================================================
 * Emits
 * =========================================================
 */

const emit = defineEmits<{
  /**
   * 페이지 변경
   */
  (e: 'update:page', page: number): void

  /**
   * 페이지당 건수 변경
   *
   * 중요:
   * Select에서는 값이 문자열로 들어오지만
   * 부모의 pageSize는 number이므로
   * 여기서 number로 변환해서 전달한다.
   */
  (e: 'update:page-size', value: number): void
}>()

/**
 * =========================================================
 * 전체 페이지 수
 * =========================================================
 */

const totalPages = computed(() => {
  if (props.totalCount <= 0 || props.pageSize <= 0) {
    return 1
  }

  return Math.ceil(props.totalCount / props.pageSize)
})

/**
 * =========================================================
 * 표시할 페이지 번호
 *
 * 현재 페이지 기준 앞뒤 2개씩 표시
 *
 * 예)
 * 현재 1 -> 1 2 3 4 5
 * 현재 3 -> 1 2 3 4 5
 * 현재 5 -> 3 4 5 6 7
 * =========================================================
 */

const visiblePages = computed(() => {
  const pages: number[] = []

  const startPage = Math.max(1, props.currentPage - 2)
  const endPage = Math.min(totalPages.value, props.currentPage + 2)

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page)
  }

  return pages
})

/**
 * =========================================================
 * 페이지 이동
 * =========================================================
 */

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) {
    return
  }

  if (page === props.currentPage) {
    return
  }

  emit('update:page', page)
}

/**
 * =========================================================
 * 처음 페이지
 * =========================================================
 */

const goToFirstPage = () => {
  if (props.currentPage <= 1) {
    return
  }

  goToPage(1)
}

/**
 * =========================================================
 * 이전 페이지
 * =========================================================
 */

const goToPreviousPage = () => {
  if (props.currentPage <= 1) {
    return
  }

  goToPage(props.currentPage - 1)
}

/**
 * =========================================================
 * 다음 페이지
 * =========================================================
 */

const goToNextPage = () => {
  if (props.currentPage >= totalPages.value) {
    return
  }

  goToPage(props.currentPage + 1)
}

/**
 * =========================================================
 * 마지막 페이지
 * =========================================================
 */

const goToLastPage = () => {
  if (props.currentPage >= totalPages.value) {
    return
  }

  goToPage(totalPages.value)
}

/**
 * =========================================================
 * 페이지당 건수 변경
 * =========================================================
 *
 * Select의 값은 string으로 들어온다.
 *
 * 예:
 * "10"
 * "20"
 * "50"
 * "100"
 *
 * 이것을 number로 변환해서 부모에게 전달한다.
 * =========================================================
 */

const changePageSize = (value: unknown) => {
  if (typeof value !== 'string') {
    return
  }

  const nextPageSize = Number(value)

  if (!Number.isFinite(nextPageSize) || nextPageSize <= 0) {
    return
  }

  emit('update:page-size', nextPageSize)
}
</script>

<template>
  <div
    v-if="totalCount > 0"
    class="grid min-h-[40px] w-full grid-cols-[1fr_auto_1fr] items-center gap-4"
  >
    <TooltipProvider>
      <!-- ===================================================
           왼쪽 : 총 건수
           =================================================== -->
      <div class="justify-self-start pl-4 text-sm text-muted-foreground">
        총
        <span class="font-medium text-foreground">
          {{ totalCount.toLocaleString() }}
        </span>
        건
      </div>

      <!-- ===================================================
           중앙 : 페이징
           =================================================== -->
      <div class="flex items-center justify-center">
        <div class="flex items-center gap-1">
          <!-- ===============================================
               처음
               =============================================== -->
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8"
                  :class="currentPage <= 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'"
                  :aria-disabled="currentPage <= 1"
                  aria-label="처음"
                  @click="goToFirstPage"
                >
                  &lt;&lt;
                </Button>
              </span>
            </TooltipTrigger>

            <TooltipContent side="top"> 처음 </TooltipContent>
          </Tooltip>

          <!-- ===============================================
               이전
               =============================================== -->
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8"
                  :class="currentPage <= 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'"
                  :aria-disabled="currentPage <= 1"
                  aria-label="이전"
                  @click="goToPreviousPage"
                >
                  &lt;
                </Button>
              </span>
            </TooltipTrigger>

            <TooltipContent side="top"> 이전 </TooltipContent>
          </Tooltip>

          <!-- ===============================================
               앞쪽 생략
               =============================================== -->
          <span
            v-if="currentPage > 3"
            class="flex size-8 items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>

          <!-- ===============================================
               페이지 번호
               =============================================== -->
          <template v-for="pageNumber in visiblePages" :key="pageNumber">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8 cursor-pointer"
                  :class="
                    pageNumber === currentPage
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                      : ''
                  "
                  :aria-current="pageNumber === currentPage ? 'page' : undefined"
                  :aria-label="`${pageNumber}페이지`"
                  @click="goToPage(pageNumber)"
                >
                  {{ pageNumber }}
                </Button>
              </TooltipTrigger>

              <TooltipContent side="top"> {{ pageNumber }}페이지 </TooltipContent>
            </Tooltip>
          </template>

          <!-- ===============================================
               뒤쪽 생략
               =============================================== -->
          <span
            v-if="currentPage < totalPages - 2"
            class="flex size-8 items-center justify-center text-sm text-muted-foreground"
          >
            ...
          </span>

          <!-- ===============================================
               다음
               =============================================== -->
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8"
                  :class="
                    currentPage >= totalPages ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                  "
                  :aria-disabled="currentPage >= totalPages"
                  aria-label="다음"
                  @click="goToNextPage"
                >
                  &gt;
                </Button>
              </span>
            </TooltipTrigger>

            <TooltipContent side="top"> 다음 </TooltipContent>
          </Tooltip>

          <!-- ===============================================
               마지막
               =============================================== -->
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="inline-flex">
                <Button
                  variant="ghost"
                  size="icon"
                  class="size-8"
                  :class="
                    currentPage >= totalPages ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                  "
                  :aria-disabled="currentPage >= totalPages"
                  aria-label="마지막"
                  @click="goToLastPage"
                >
                  &gt;&gt;
                </Button>
              </span>
            </TooltipTrigger>

            <TooltipContent side="top"> 마지막 </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <!-- ===================================================
           오른쪽 : 페이지당 건수
           =================================================== -->
      <div class="flex items-center justify-self-end gap-2">
        <Label class="whitespace-nowrap text-sm text-muted-foreground"> 페이지당 건수 </Label>

        <Select :model-value="String(pageSize)" @update:model-value="changePageSize">
          <SelectTrigger class="w-[90px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="10"> 10 </SelectItem>

            <SelectItem value="20"> 20 </SelectItem>

            <SelectItem value="50"> 50 </SelectItem>

            <SelectItem value="100"> 100 </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </TooltipProvider>
  </div>
</template>
