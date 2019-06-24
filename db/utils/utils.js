exports.formatDate = list => {
  return list.map(item => {
    const { created_at, ...restOfItem } = item;
    const dataObj = { ...restOfItem };
    dataObj.created_at = new Date(created_at);
    return dataObj;
  });
};

exports.makeRefObj = (list, refKey, refValue) => {
  const dataObj = {};
  list.forEach(item => {
    dataObj[item[refKey]] = item[refValue];
  });
  return dataObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(item => {
    const { belongs_to, created_by, created_at, ...restOfItem } = item;
    const dataObj = { ...restOfItem };
    dataObj.article_id = articleRef[belongs_to];
    dataObj.author = created_by;
    dataObj.created_at = new Date(created_at);
    return dataObj;
  });
};
