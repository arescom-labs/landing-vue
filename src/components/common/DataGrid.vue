<script setup lang="ts" generic="TData">
import { AgGridVue } from 'ag-grid-vue3'
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridOptions,
} from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

interface Props {
  rowData: TData[]
  columnDefs: ColDef<TData>[]
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
})

const gridOptions: GridOptions<TData> = {
  defaultColDef: {
    sortable: true,
    resizable: true,
    //minWidth: 100,

    // 모든 헤더 가운데 정렬
    headerClass: '[&_.ag-header-cell-label]:!justify-center',
  },

  // AG Grid 기본 메시지 한글화
  localeText: {
    noRowsToShow: '데이터가 없습니다.',
  },

  suppressCellFocus: true,
}
</script>

<template>
  <div class="h-full w-full" :style="{ height: props.height }">
    <AgGridVue
      class="h-full w-full"
      :theme="themeQuartz"
      :row-data="props.rowData"
      :column-defs="props.columnDefs"
      :grid-options="gridOptions"
    />
  </div>
</template>
