// Add nunjuck custom filters here
module.exports = {
  padNumber: num => (num < 10 ? '0' + num : num),
}
