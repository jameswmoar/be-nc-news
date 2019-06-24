exports.formatDate = list => {
  return list.map(item => {
  item.created_at = new Date(item.created_at)
  console.log(item)
  return item
  })
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
