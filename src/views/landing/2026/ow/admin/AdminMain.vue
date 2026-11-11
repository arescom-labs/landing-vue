<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search } from '@lucide/vue'
import {
  Pencil,
  Trash2,
  RefreshCw,
  Download,
  LogOut,
  Users,
  UserPlus,
  CalendarDays,
  ClipboardList,
} from 'lucide-vue-next'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

import { adminApi } from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

import DataGrid from '@/components/common/DataGrid.vue'
import ColumnAction from '@/components/common/ColumnAction.vue'
import MiceroPagination from '@/core/page/components/LandingPagination.vue'

import { ALIGN } from '@/constants/style'
import { Card, CardContent } from '@/components/ui/card'

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

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const EVENT_TITLE = '2026 한반도해상풍력 연말 초청 만찬'
const EVENT_DATE = new Date('2026-12-15T16:00:00+09:00')
const EVENT_DATE_TEXT = '2026. 12. 15 (화) 16:00'
const EVENT_LOCATION = '송도컨벤시아'

const PAGE_SIZE_DEFAULT = 10

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

const API = {
  list: '/list',
  summary: '/summary',
  insert: '/insert',
  update: '/update',
  delete: '/delete',
  excel: '/excel',
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface Adhrnc {
  adhrncNo: number
  adhrncNm: string
  moblphon: string
  custNm01: string
  custNm02: string
  rgtrSe: string
  regDt: string
  useYn: 'Y' | 'N'
}

interface AdhrncSearch {
  keyword: string
  sortType: string
}

interface AdhrncForm {
  adhrncNo: number | null
  adhrncNm: string
  moblphon: string
  custNm01: string
  custNm02: string
  rgtrSe: string
}

interface AdhrncSummary {
  totalCount: number
  todayCount: number
  recentCount: number
  adminCount: number
}

interface ListResponse {
  list: Adhrnc[]
  totalCount: number
}

interface ApiResult {
  result: 'success' | 'fail'
  message: string
}

// -----------------------------------------------------------------------------
// Router / Store
// -----------------------------------------------------------------------------

const router = useRouter()
const authStore = useAuthStore()

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const searchForm = ref<AdhrncSearch>({
  keyword: '',
  sortType: 'new',
})

const rowData = ref<Adhrnc[]>([])

const summary = ref<AdhrncSummary>({
  totalCount: 0,
  todayCount: 0,
  recentCount: 0,
  adminCount: 0,
})

const currentPage = ref(1)
const pageSize = ref(PAGE_SIZE_DEFAULT)
const totalCount = ref(0)

const isSearching = ref(false)
const isExcelDownloading = ref(false)

const isDialogOpen = ref(false)
const isEditMode = ref(false)
const isSaveConfirmOpen = ref(false)
const isSaving = ref(false)

const isDeleteConfirmOpen = ref(false)
const isDeleting = ref(false)

const selectedDeleteRow = ref<Adhrnc | null>(null)

const lastUpdated = ref('')

const formData = ref<AdhrncForm>({
  adhrncNo: null,
  adhrncNm: '',
  moblphon: '',
  custNm01: '',
  custNm02: '',
  rgtrSe: '',
})

// -----------------------------------------------------------------------------
// Computed
// -----------------------------------------------------------------------------

const dDayText = computed(() => {
  const today = new Date()
  const eventDay = new Date(EVENT_DATE)

  today.setHours(0, 0, 0, 0)
  eventDay.setHours(0, 0, 0, 0)

  const diff = Math.ceil((eventDay.getTime() - today.getTime()) / 86400000)

  if (diff > 0) return `D-${diff}`
  if (diff === 0) return 'D-DAY'

  return '종료'
})

const statCards = computed(() => [
  {
    title: '총 신청자',
    value: summary.value.totalCount,
    unit: '명',
    description: '현재 등록된 신청자',
    icon: Users,
    primary: true,
  },
  {
    title: '오늘 신청',
    value: summary.value.todayCount,
    unit: '명',
    description: '오늘 신규 등록',
    icon: UserPlus,
    primary: false,
  },
  {
    title: '최근 7일 신청',
    value: summary.value.recentCount,
    unit: '명',
    description: '오늘 포함 최근 7일',
    icon: CalendarDays,
    primary: false,
  },
  {
    title: '관리자 등록 인원',
    value: summary.value.adminCount,
    unit: '명',
    description: '관리자가 직접 등록한 신청자',
    icon: ClipboardList,
    primary: false,
  },
])

const pageTitle = computed(() => {
  return isEditMode.value ? '신청자 정보 수정' : '신규 신청자 등록'
})

// -----------------------------------------------------------------------------
// Format
// -----------------------------------------------------------------------------

const formatNumber = (value: number): string => {
  return value.toLocaleString('ko-KR')
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  const pad = (number: number): string => {
    return String(number).padStart(2, '0')
  }

  return [
    `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join(' ')
}

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '')

  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return value
}

// 연락처 입력 시 숫자만 허용하고 하이픈 자동 적용
const handleMoblphonInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const digits = target.value.replace(/\D/g, '').slice(0, 11)

  let formatted = digits

  if (digits.length > 7) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  } else if (digits.length > 3) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  formData.value.moblphon = formatted
  target.value = formatted
}

const getCurrentDateText = (): string => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}

// -----------------------------------------------------------------------------
// Form
// -----------------------------------------------------------------------------

const resetForm = (): void => {
  formData.value = {
    adhrncNo: null,
    adhrncNm: '',
    moblphon: '',
    custNm01: '',
    custNm02: '',
    rgtrSe: '',
  }
}

const openAddDialog = (): void => {
  resetForm()
  isEditMode.value = false
  isDialogOpen.value = true
}

const openEditDialog = (data: Adhrnc): void => {
  formData.value = {
    adhrncNo: data.adhrncNo,
    adhrncNm: data.adhrncNm,
    moblphon: formatPhone(data.moblphon ?? ''),
    custNm01: data.custNm01,
    custNm02: data.custNm02,
    rgtrSe: data.rgtrSe,
  }

  isEditMode.value = true
  isDialogOpen.value = true
}

const closeDialog = (): void => {
  if (isSaving.value) return

  isDialogOpen.value = false
  isEditMode.value = false
  resetForm()
}

const isAlertOpen = ref(false)
const alertMessage = ref('')

const validateForm = (): boolean => {
  const adhrncNm = formData.value.adhrncNm.trim()
  const moblphon = formData.value.moblphon.replace(/\D/g, '')
  const custNm01 = formData.value.custNm01.trim()

  if (!adhrncNm) {
    alertMessage.value = '성명을 입력해 주세요.'
    isAlertOpen.value = true
    return false
  }

  if (adhrncNm.length > 50) {
    alertMessage.value = '성명은 50자 이내로 입력해 주세요.'
    isAlertOpen.value = true
    return false
  }

  if (!moblphon) {
    alertMessage.value = '연락처를 입력해 주세요.'
    isAlertOpen.value = true
    return false
  }

  if (!/^01[016789]\d{7,8}$/.test(moblphon)) {
    alertMessage.value = '올바른 휴대전화 번호를 입력해 주세요. (예: 010-1234-5678)'
    isAlertOpen.value = true
    return false
  }

  if (!custNm01) {
    alertMessage.value = '소속을 입력해 주세요.'
    isAlertOpen.value = true
    return false
  }

  if (custNm01.length > 200) {
    alertMessage.value = '소속은 200자 이내로 입력해 주세요.'
    isAlertOpen.value = true
    return false
  }

  if (formData.value.custNm02.trim().length > 200) {
    alertMessage.value = '선박명은 200자 이내로 입력해 주세요.'
    isAlertOpen.value = true
    return false
  }

  return true
}

const save = (): void => {
  if (!validateForm()) return

  isSaveConfirmOpen.value = true
}

const confirmSave = async (): Promise<void> => {
  if (isSaving.value) return

  isSaving.value = true

  try {
    const payload = {
      ...formData.value,
      adhrncNm: formData.value.adhrncNm.trim(),
      moblphon: formData.value.moblphon.trim(),
      custNm01: formData.value.custNm01.trim(),
      custNm02: formData.value.custNm02.trim(),
    }

    const response = isEditMode.value
      ? await adminApi.post<ApiResult>(API.update, payload)
      : await adminApi.post<ApiResult>(API.insert, payload)

    if (response.data?.result !== 'success') {
      alertMessage.value = response.data?.message || '저장에 실패했습니다.'
      isAlertOpen.value = true
      return
    }

    isSaveConfirmOpen.value = false
    isDialogOpen.value = false

    alertMessage.value = response.data.message
    isAlertOpen.value = true

    resetForm()
    isEditMode.value = false

    await search()
  } catch (error) {
    console.error('[AdminMain] 저장 실패:', error)
    alertMessage.value = '저장에 실패했습니다.'
    isAlertOpen.value = true
  } finally {
    isSaving.value = false
  }
}

// -----------------------------------------------------------------------------
// Delete
// -----------------------------------------------------------------------------

const openDeleteDialog = (data: Adhrnc): void => {
  selectedDeleteRow.value = data
  isDeleteConfirmOpen.value = true
}

const confirmDelete = async (): Promise<void> => {
  const data = selectedDeleteRow.value

  if (!data?.adhrncNo || isDeleting.value) return

  isDeleting.value = true

  try {
    const response = await adminApi.post<ApiResult>(API.delete, {
      adhrncNo: data.adhrncNo,
    })

    if (response.data?.result !== 'success') {
      alertMessage.value = response.data?.message || '삭제에 실패했습니다.'
      isAlertOpen.value = true
      return
    }

    isDeleteConfirmOpen.value = false
    selectedDeleteRow.value = null

    alertMessage.value = response.data.message
    isAlertOpen.value = true

    await search()
  } catch (error) {
    console.error('[AdminMain] 삭제 실패:', error)

    alertMessage.value = '삭제에 실패했습니다.'
    isAlertOpen.value = true
  } finally {
    isDeleting.value = false
  }
}

const closeDeleteDialog = (): void => {
  if (isDeleting.value) return

  isDeleteConfirmOpen.value = false
  selectedDeleteRow.value = null
}

// -----------------------------------------------------------------------------
// AG Grid
// -----------------------------------------------------------------------------

const columnDefs: ColDef<Adhrnc>[] = [
  {
    headerName: '번호',
    width: 75,
    flex: 0,
    pinned: 'left',
    sortable: false,
    filter: false,
    valueGetter: (params) => {
      return (params.node?.rowIndex ?? 0) + 1 + (currentPage.value - 1) * pageSize.value
    },
    cellStyle: ALIGN.center,
  },
  {
    headerName: '신청일시',
    field: 'regDt',
    width: 175,
    cellStyle: ALIGN.center,
    valueFormatter: (params) => formatDate(params.value),
  },
  {
    headerName: '성명',
    field: 'adhrncNm',
    width: 120,
    cellStyle: ALIGN.center,
  },
  {
    headerName: '전화번호',
    field: 'moblphon',
    width: 150,
    cellStyle: ALIGN.center,
    valueFormatter: (params) => {
      return formatPhone(params.value ?? '')
    },
  },
  {
    headerName: '소속',
    field: 'custNm01',
    minWidth: 180,
    flex: 1,
    cellStyle: ALIGN.center,
  },
  {
    headerName: '선박명',
    field: 'custNm02',
    minWidth: 150,
    flex: 1,
    cellStyle: ALIGN.center,
    valueFormatter: (params) => params.value || '-',
  },
  {
    headerName: '등록구분',
    field: 'rgtrSe',
    pinned: 'right',
    width: 100,
    cellStyle: ALIGN.center,
    valueFormatter: (params) => params.value || '-',
  },
  {
    headerName: 'Action',
    width: 120,
    flex: 0,
    pinned: 'right',
    sortable: false,
    filter: false,
    cellStyle: ALIGN.center,
    cellRenderer: ColumnAction,
    cellRendererParams: {
      actions: [
        {
          key: 'edit',
          tooltip: '수정',
          icon: Pencil,
          onClick: async (params: ICellRendererParams<Adhrnc>) => {
            if (params.data) openEditDialog(params.data)
          },
        },
        {
          key: 'delete',
          tooltip: '삭제',
          icon: Trash2,
          variant: 'destructive',
          onClick: async (params: ICellRendererParams<Adhrnc>) => {
            if (params.data) openDeleteDialog(params.data)
          },
        },
      ],
    },
  },
]

// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------

const search = async (): Promise<void> => {
  if (isSearching.value) return

  isSearching.value = true

  try {
    const [listResponse, summaryResponse] = await Promise.all([
      adminApi.post<ListResponse>(API.list, {
        ...searchForm.value,
        page: currentPage.value,
        pageSize: pageSize.value,
      }),
      adminApi.post<AdhrncSummary>(API.summary),
    ])

    rowData.value = listResponse.data?.list ?? []
    totalCount.value = listResponse.data?.totalCount ?? 0

    summary.value = {
      totalCount: summaryResponse.data?.totalCount ?? 0,
      todayCount: summaryResponse.data?.todayCount ?? 0,
      recentCount: summaryResponse.data?.recentCount ?? 0,
      adminCount: summaryResponse.data?.adminCount ?? 0,
    }

    lastUpdated.value = formatDate(new Date().toISOString())
  } catch (error) {
    console.error('[AdminMain] 목록 조회 실패:', error)

    rowData.value = []
    totalCount.value = 0

    alertMessage.value = '신청자 목록 조회에 실패했습니다.'
    isAlertOpen.value = true
  } finally {
    isSearching.value = false
  }
}

const handleSearch = (): void => {
  currentPage.value = 1
  search()
}

const changePage = (page: number): void => {
  currentPage.value = page
  search()
}

const changePageSize = (size: number): void => {
  pageSize.value = size
  currentPage.value = 1
  search()
}

const refresh = (): void => {
  search()
}

// -----------------------------------------------------------------------------
// Excel Download
// -----------------------------------------------------------------------------
interface ExcelColumn {
  columnName: string
  headerName: string
}

const excelColumns: ExcelColumn[] = [
  { columnName: 'REG_DT', headerName: '신청일시' },
  { columnName: 'ADHRNC_NM', headerName: '성명' },
  { columnName: 'MOBLPHON', headerName: '연락처' },
  { columnName: 'CUST_NM_01', headerName: '소속' },
  { columnName: 'CUST_NM_02', headerName: '선박명' },
]

const handleExcelDownload = async (): Promise<void> => {
  if (isExcelDownloading.value) return

  isExcelDownloading.value = true

  try {
    const response = await adminApi.post(
      API.excel,
      {
        searchVO: {
          keyword: searchForm.value.keyword.trim(),
          sortType: searchForm.value.sortType,
        },
        columns: excelColumns,
      },
      {
        responseType: 'blob',
      },
    )

    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `신청자목록_${getCurrentDateText()}.xlsx`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('[AdminMain] 엑셀 다운로드 실패:', error)

    alertMessage.value = '엑셀 다운로드에 실패했습니다.'
    isAlertOpen.value = true
  } finally {
    isExcelDownloading.value = false
  }
}

// -----------------------------------------------------------------------------
// Logout
// -----------------------------------------------------------------------------

const handleLogout = async (): Promise<void> => {
  authStore.clearAuth()
  await router.replace('/admin')
}

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

onMounted(() => {
  search()
})
</script>

<template>
  <div class="admin-main flex min-h-full flex-col bg-[#f3f5f7]">
    <!-- 상단 헤더 -->
    <header class="admin-header shrink-0">
      <div class="admin-header-inner">
        <div class="flex min-w-0 items-center gap-4">
          <div class="ow-logo">
            <span>OW</span>
          </div>

          <div class="min-w-0">
            <p class="truncate text-[15px] font-bold text-white">
              {{ EVENT_TITLE }}
            </p>
            <p class="mt-0.5 text-xs text-slate-300">참가 신청 관리</p>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-4">
          <div class="admin-info">
            <div class="admin-avatar">
              <Users class="h-4 w-4" />
            </div>
            <span>{{ authStore.adminId || '관리자' }}</span>
          </div>

          <button
            type="button"
            class="cursor-pointer logout-button disabled:cursor-not-allowed"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 본문 -->
    <main class="mx-auto w-full max-w-[1200px] flex-1 px-6 py-7 max-sm:px-4 max-sm:py-5">
      <!-- 페이지 제목 -->
      <section class="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-[25px] font-bold tracking-tight text-[#11262f]">신청자 목록</h1>

          <p class="mt-1.5 text-xs text-[#6f7f88]">마지막 업데이트 {{ lastUpdated || '-' }}</p>
        </div>

        <div class="event-info">
          <div class="event-dday">
            {{ dDayText }}
          </div>

          <div class="min-w-0">
            <p class="text-xs font-semibold text-[#24364a]">
              {{ EVENT_DATE_TEXT }}
            </p>
            <p class="mt-0.5 text-xs text-[#6f7f88]">
              {{ EVENT_LOCATION }}
            </p>
          </div>
        </div>
      </section>

      <!-- 통계 카드 -->
      <section class="mb-6 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:gap-3">
        <Card
          v-for="item in statCards"
          :key="item.title"
          :class="[
            'stat-card relative overflow-hidden rounded-xl border shadow-none',
            item.primary
              ? 'border-[#1d2937] bg-[#1d2937] text-white'
              : 'border-[#e3e7eb] bg-white text-[#11262f]',
          ]"
        >
          <CardContent class="p-5 max-sm:p-4">
            <div class="flex items-start justify-between gap-2">
              <p
                :class="[
                  'text-sm font-semibold',
                  item.primary ? 'text-slate-200' : 'text-[#6f7f88]',
                ]"
              >
                {{ item.title }}
              </p>

              <component
                :is="item.icon"
                :class="['h-5 w-5', item.primary ? 'text-[#ffe500]' : 'text-[#8a9aa4]']"
              />
            </div>

            <div class="mt-4 flex items-baseline gap-1.5">
              <strong
                :class="[
                  'text-[32px] font-bold tracking-tight tabular-nums max-sm:text-[26px]',
                  item.primary ? 'text-[#ffe500]' : 'text-[#11262f]',
                ]"
              >
                {{ formatNumber(item.value) }}
              </strong>

              <span :class="['text-sm', item.primary ? 'text-slate-300' : 'text-[#6f7f88]']">
                {{ item.unit }}
              </span>
            </div>

            <p :class="['mt-2 text-xs', item.primary ? 'text-slate-300' : 'text-[#8a969d]']">
              {{ item.description }}
            </p>
          </CardContent>
        </Card>
      </section>

      <!-- 신청자 목록 -->
      <Card class="overflow-hidden rounded-xl border border-[#e3e7eb] bg-white shadow-none">
        <CardContent class="p-4 max-sm:p-3">
          <!-- 목록 툴바 -->
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#1d2937] px-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#24364a] disabled:cursor-not-allowed"
                @click="openAddDialog"
              >
                <Plus class="h-4 w-4" />
                <span>신규 등록</span>
              </button>
              <button
                type="button"
                class="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#ffe500] px-3.5 text-sm font-bold text-[#1d2937] transition-colors hover:bg-[#f5dc00] disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isExcelDownloading"
                @click="handleExcelDownload"
              >
                <Download class="h-4 w-4" />
                <span>
                  {{ isExcelDownloading ? '다운로드 중' : '엑셀 다운로드' }}
                </span>
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a969d]" />

                <input
                  v-model="searchForm.keyword"
                  type="text"
                  class="h-9 w-[260px] rounded-lg border border-[#e3e7eb] bg-white pl-9 pr-3 text-sm text-[#1b2a35] outline-none transition placeholder:text-[#a4afb5] focus:border-[#1f5f84] focus:ring-2 focus:ring-[#1f5f84]/10 max-sm:w-full"
                  placeholder="성명, 소속, 전화번호 검색"
                  @keyup.enter="handleSearch"
                />
              </div>

              <select
                v-model="searchForm.sortType"
                class="h-9 rounded-lg border border-[#e3e7eb] bg-white px-3 text-sm text-[#1b2a35] outline-none focus:border-[#1f5f84]"
                @change="handleSearch"
              >
                <option value="new">최신 신청순</option>
                <option value="old">오래된 순</option>
                <option value="name">성명순</option>
                <option value="custNm01">소속순</option>
              </select>

              <button
                type="button"
                class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[#e3e7eb] text-[#6f7f88] transition hover:bg-slate-50 hover:text-[#1d2937] disabled:cursor-not-allowed"
                title="새로고침"
                :disabled="isSearching"
                @click="refresh"
              >
                <RefreshCw class="h-4 w-4" :class="{ 'animate-spin': isSearching }" />
              </button>
            </div>
          </div>

          <!-- AG Grid -->
          <div
            class="admin-grid-wrap min-h-[420px] overflow-hidden rounded-lg border border-[#e3e7eb]"
          >
            <DataGrid :row-data="rowData" :column-defs="columnDefs" height="420px" />
          </div>

          <!-- 페이징 -->
          <div class="mt-3">
            <MiceroPagination
              :current-page="currentPage"
              :page-size="pageSize"
              :total-count="totalCount"
              @update:page="changePage"
              @update:page-size="changePageSize"
            />
          </div>

          <!-- 조회 결과 없음 -->
          <div
            v-if="!isSearching && rowData.length === 0"
            class="py-8 text-center text-sm text-[#8a969d]"
          >
            등록된 신청자가 없습니다.
          </div>

          <!-- 안내 -->
          <div class="mt-4 border-t border-[#e3e7eb] pt-3">
            <p class="text-xs leading-relaxed text-[#8a969d]">
              ※ 수집된 개인정보는 행사 종료 후 관련 규정에 따라 안전하게 파기해야 합니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>

    <!-- 등록 / 수정 공통 다이얼로그 -->
    <div
      v-if="isDialogOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      @click.self="closeDialog"
    >
      <div
        class="w-full max-w-[560px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
      >
        <div class="border-b border-slate-200 px-6 py-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-[#11262f]">
                {{ pageTitle }}
              </h2>
              <p class="mt-1 text-sm text-[#6f7f88]">신청자 정보를 입력해 주세요.</p>
            </div>

            <button
              type="button"
              class="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
              :disabled="isSaving"
              @click="closeDialog"
            >
              <span class="text-xl leading-none">×</span>
            </button>
          </div>
        </div>

        <div class="space-y-4 px-6 py-6">
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-[#344653]">
              성명
              <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="formData.adhrncNm"
              type="text"
              maxlength="50"
              required
              placeholder="성명을 입력해 주세요."
              class="h-10 w-full rounded-lg border border-[#dfe5e9] px-3 text-sm outline-none transition focus:border-[#1f5f84] focus:ring-2 focus:ring-[#1f5f84]/10"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-[#344653]">
              연락처
              <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="formData.moblphon"
              type="tel"
              required
              inputmode="numeric"
              autocomplete="tel"
              maxlength="13"
              placeholder="010-1234-5678"
              class="h-10 w-full rounded-lg border border-[#dfe5e9] px-3 text-sm outline-none transition focus:border-[#1f5f84] focus:ring-2 focus:ring-[#1f5f84]/10"
              @input="handleMoblphonInput"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-semibold text-[#344653]">
              소속
              <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="formData.custNm01"
              type="text"
              maxlength="200"
              required
              placeholder="소속을 입력해 주세요."
              class="h-10 w-full rounded-lg border border-[#dfe5e9] px-3 text-sm outline-none transition focus:border-[#1f5f84] focus:ring-2 focus:ring-[#1f5f84]/10"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-semibold text-[#344653]"> 선박명 </label>
            <input
              v-model="formData.custNm02"
              type="text"
              maxlength="200"
              placeholder="선박명을 입력해 주세요."
              class="h-10 w-full rounded-lg border border-[#dfe5e9] px-3 text-sm outline-none transition focus:border-[#1f5f84] focus:ring-2 focus:ring-[#1f5f84]/10"
            />
          </div>
        </div>

        <div
          class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/70 px-6 py-4"
        >
          <button
            type="button"
            class="cursor-pointer h-9 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed"
            :disabled="isSaving"
            @click="closeDialog"
          >
            취소
          </button>

          <button
            type="button"
            class="cursor-pointer h-9 rounded-lg bg-[#1d2937] px-5 text-sm font-semibold text-white transition hover:bg-[#24364a] disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isSaving"
            @click="save"
          >
            {{ isEditMode ? '수정' : '등록' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 안내 및 검증 메시지 -->
    <AlertDialog :open="isAlertOpen" @update:open="(open) => (isAlertOpen = open)">
      <AlertDialogContent class="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle> 안내 </AlertDialogTitle>

          <AlertDialogDescription class="whitespace-pre-line">
            {{ alertMessage }}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction
            class="cursor-pointer bg-[#1d2937] text-white hover:bg-[#24364a]"
            @click="isAlertOpen = false"
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- 등록 / 수정 확인 -->
    <AlertDialog
      :open="isSaveConfirmOpen"
      @update:open="(open) => !isSaving && (isSaveConfirmOpen = open)"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {{ isEditMode ? '수정 확인' : '등록 확인' }}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {{ isEditMode ? '신청자 정보를 수정하시겠습니까?' : '신청자를 신규 등록하시겠습니까?' }}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            class="cursor-pointer disabled:cursor-not-allowed"
            :disabled="isSaving"
          >
            취소
          </AlertDialogCancel>

          <AlertDialogAction
            class="cursor-pointer disabled:cursor-not-allowed"
            :disabled="isSaving"
            @click="confirmSave"
          >
            {{ isSaving ? '처리 중...' : '확인' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- 삭제 확인 -->
    <AlertDialog
      :open="isDeleteConfirmOpen"
      @update:open="(open) => !isDeleting && !open && closeDeleteDialog()"
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> 신청자 삭제 </AlertDialogTitle>

          <AlertDialogDescription>
            <strong class="font-semibold text-slate-800">
              {{ selectedDeleteRow?.adhrncNm }}
            </strong>
            신청자를 삭제하시겠습니까?
            <br />
            삭제된 신청자는 일반 목록에서 제외됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            class="cursor-pointer disabled:cursor-not-allowed"
            :disabled="isDeleting"
          >
            취소
          </AlertDialogCancel>

          <AlertDialogAction
            class="cursor-pointer disabled:cursor-not-allowed bg-destructive text-destructive-foreground hover:bg-destructive/90"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            {{ isDeleting ? '삭제 중...' : '삭제' }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style scoped>
.admin-main {
  font-family:
    Pretendard,
    'Pretendard Variable',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

/* 페이지 내부의 모든 버튼에 포인터 커서 적용 */
.admin-main :deep(button) {
  cursor: pointer;
}

.admin-main :deep(button:disabled) {
  cursor: not-allowed;
}

.admin-header {
  height: 68px;
  background: #1d2937;
}

.admin-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1248px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
}

.ow-logo {
  display: flex;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #ffe500;
  color: #1d2937;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -1px;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
}

.admin-avatar {
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #34485d;
  color: #ffe500;
}

.logout-button {
  display: flex;
  height: 34px;
  align-items: center;
  gap: 6px;
  padding: 0 11px;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 7px;
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}

.logout-button:hover {
  background: rgb(255 255 255 / 9%);
}

.event-info {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 14px;
  border: 1px solid #e3e7eb;
  border-radius: 10px;
  background: white;
}

.event-dday {
  display: flex;
  min-width: 58px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  background: #1d2937;
  color: #ffe500;
  font-size: 12px;
  font-weight: 800;
}

.stat-card {
  min-height: 150px;
}

.stat-card:first-child::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: #ffe500;
  content: '';
}

@media (max-width: 640px) {
  .admin-header {
    height: 60px;
  }

  .admin-header-inner {
    padding: 0 16px;
  }

  .ow-logo {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
    font-size: 15px;
  }

  .admin-info {
    display: none;
  }

  .logout-button {
    height: 32px;
    padding: 0 8px;
  }

  .stat-card {
    min-height: 130px;
  }

  .event-info {
    width: 100%;
  }

  .admin-grid-wrap {
    min-height: 360px;
  }
}
</style>
