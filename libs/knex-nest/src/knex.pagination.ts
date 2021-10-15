export function knexPaginate({
  perPage = 10,
  currentPage = 1,
  isLengthAware = false,
  dataKey = 'data',
}) {
  if (isNaN(perPage)) {
    throw new Error('Paginate error: perPage must be a number.');
  }

  if (isNaN(currentPage)) {
    throw new Error('Paginate error: currentPage must be a number.');
  }

  if (typeof isLengthAware !== 'boolean') {
    throw new Error('Paginate error: isLengthAware must be a boolean.');
  }

  const shouldFetchTotals = isLengthAware;
  let pagination = {};
  let countQuery = null;

  if (currentPage < 1) {
    currentPage = 1;
  }

  const offset = (currentPage - 1) * perPage;
  const limit = perPage;

  const postProcessResponse =
    typeof this.client.config.postProcessResponse === 'function'
      ? this.client.config.postProcessResponse
      : function (key) {
          return key;
        };

  if (shouldFetchTotals) {
    countQuery = new this.constructor(this.client)
      .count('* as total')
      .from(this.clone().offset(0).clearOrder().as('count__query__'))
      .first()
      .debug(this._debug);
  }

  // This will paginate the data itself
  this.offset(offset).limit(limit);

  return this.client.transaction(async (trx) => {
    const result = await this.transacting(trx);

    if (shouldFetchTotals) {
      const countResult = await countQuery.transacting(trx);
      const total = +(countResult.TOTAL || countResult.total);

      pagination = {
        total,
        lastPage: Math.ceil(total / perPage),
      };
    }

    // Add pagination data to paginator object
    pagination = postProcessResponse({
      ...pagination,
      currentPage,
      perPage,
      from: offset + 1,
      to: offset + result.length,
    });

    return { [dataKey]: result, pagination };
  });
}
