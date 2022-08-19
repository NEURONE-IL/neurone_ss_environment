// Auxiliary MatPaginator translation file
// Source: https://stackblitz.com/edit/angular-5mgfxh?file=app%2Fdutch-paginator-intl.ts

import { MatPaginatorIntl } from '@angular/material/paginator';

const rangeLabel = (page: number, pageSize: number, length: number) => {
  let ofWord = $localize`:Translation of the word of in the MatPaginator text:of`
  if (length == 0 || pageSize == 0) { return `0 ${ofWord} ${length}`; }
  
  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

  return `${startIndex + 1} – ${endIndex} ${ofWord} ${length}`;
}

export function getMatPaginatorIntl() {
  const matPaginatorIntl = new MatPaginatorIntl();
  
  matPaginatorIntl.itemsPerPageLabel = $localize`:MatPaginator text:Items per page` + ':';
  matPaginatorIntl.firstPageLabel = $localize`:MatPaginator text:First page`;
  matPaginatorIntl.previousPageLabel = $localize`:MatPaginator text:Previous page`;
  matPaginatorIntl.nextPageLabel = $localize`:MatPaginator text:Next page`;
  matPaginatorIntl.lastPageLabel = $localize`:MatPaginator text:Last page`;
  matPaginatorIntl.getRangeLabel = rangeLabel;
  
  return matPaginatorIntl;
}