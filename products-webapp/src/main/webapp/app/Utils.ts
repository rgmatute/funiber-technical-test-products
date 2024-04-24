export default function buildPaginationQueryOptsUtils(paginationQuery) {
    if (paginationQuery) {
      let sorts = '';
      for (const idx of Object.keys(paginationQuery.sort)) {
        if (sorts.length > 0) {
          sorts += '&';
        }
        sorts += 'sort=' + paginationQuery.sort[idx];
      }
      return `${sorts}&page=${paginationQuery.page}&size=${paginationQuery.size}&key=${paginationQuery.key}&value=${paginationQuery.value??''}`;
    }
    return '';
  }