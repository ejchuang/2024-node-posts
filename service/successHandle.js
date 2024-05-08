const successHandle = (res, data) => {
  res.status(200).json({
    "status": "success",
    data
  }).end();
}
module.exports = successHandle;