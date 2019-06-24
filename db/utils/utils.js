exports.formatDate = list => {
  return list.map(item => {
    item.created_at = new Date(item.created_at);
    return item;
  });
};

exports.makeRefObj = (list, refKey, refValue) => {
  const dataObj = {};
  list.forEach(item => {
    dataObj[item[refKey]] = item[refValue];
  });
  return dataObj;
};

exports.formatComments = (comments, articleRef) => {};
