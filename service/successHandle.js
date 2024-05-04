const successHandle = (res, data) => {
  res.status(200).json({
    "status": "success",
    data
  });
}
module.exports = successHandle;