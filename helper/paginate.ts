const qs = require("query-string");

// return order variable for graphql query
export function getOrderBy(ctx) {
  let output: any = {};
  let currentQs = ctx.$route.query;

  // sort
  if (typeof currentQs["order_by"] !== "undefined") {
    output = {};

    const orderArr = currentQs["order_by"].split(',');
    orderArr.map(item => {
      let [sortBy, sortType] = item.split(".");
      output[sortBy] = sortType;
    })
  } else {
    output = {
      'id': 'desc'
    }
  }

  return output;
}

// return filter variable for graphql query
export function getFilterBy(ctx) {  
  let output: any = {}
  let currentQs = ctx.$route.query;

  // filter
  if (typeof currentQs["filter_by"] !== "undefined") {    
    const filterDecoded = Buffer.from(currentQs["filter_by"], 'base64').toString();
    
    output = JSON.parse(filterDecoded);
  }

  return output
}

// return variable for ant design table
export function initQs(ctx) {
  let currentQs = ctx.$route.query;
  let sorter = {};
  let filters = {};
  let q = '';
  let sr = '';

  // sort
  if (typeof currentQs["order_by"] !== "undefined") {
    const orderArr = currentQs["order_by"].split(',');

    // because ant not support multi sort, get first sort condition
    let [sortBy, sortType] = orderArr[0].split(".");

    switch (sortType) {
      case 'desc':
        sortType = 'descend';
        break;
      case 'asc':
        sortType = 'ascend';
        break;
    }

    sorter = {
      columnKey: sortBy,
      order: sortType
    }
  }
  
  // filters
  if (typeof currentQs["filter_by"] !== "undefined") {
    const filterDecoded = Buffer.from(currentQs["filter_by"], 'base64').toString();
    // console.log(filterDecoded);
    
    filters = JSON.parse(filterDecoded);
  }


  // search
  if (typeof currentQs["q"] !== "undefined") {
    q = currentQs["q"];
    sr = currentQs["sr"]
  }

  return {
    currentSort: sorter,
    currentFilters: filters,
    currentSearchText: q,
    currentSearchResult: sr
  };
}

export function createUrl(sorter: {}, filters: {}, searcher: {}, ctx) {
  let currentQs = qs.parse(window.location.search, { arrayFormat: "comma" });
  
  if (Object.keys(sorter).length !== 0) {
    let sortOder = '';
    
    switch (sorter['order']) {
      case 'descend':
        sortOder = 'desc';
        break;
      case 'ascend':
        sortOder = 'asc';
        break;
    }

    const sortKey = sorter['columnKey'] + "." + sortOder;
    currentQs["order_by"] = sortKey;

    if (typeof sorter['order'] === 'undefined') {
      delete currentQs["order_by"];
    }
  }

  if (Object.keys(filters).length !== 0) {
    const filterEncoded = btoa(JSON.stringify(filters));

    currentQs["filter_by"] = filterEncoded;
  }

  if (Object.keys(searcher).length !== 0) {
    if (searcher["q"] !== "") {
      currentQs["q"] = searcher["q"].trim();
    } else {
      delete currentQs["q"];
    }

    delete currentQs["page"];
  }
  
  return qs.stringify(currentQs, { arrayFormat: "comma" });
}