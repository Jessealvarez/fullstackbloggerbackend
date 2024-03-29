//A lot of this went over my head -- will come back and review at a later time to make sure I understand it

const serverCheckBlogIsValid = (reqBody) => {
  if (
    !reqBody.hasOwnProperty("title") &&
    !typeof reqBody.title === String &&
    reqBody.title < 1
  ) {
    return false;
  }
  if (
    !reqBody.hasOwnProperty("text") ||
    !typeof reqBody.text === String ||
    reqBody.text < 1
  ) {
    return false;
  }
  if (
    !reqBody.hasOwnProperty("author") ||
    !typeof reqBody.author === String ||
    reqBody.author < 1
  ) {
    return false;
  }
  if (
    !reqBody.hasOwnProperty("category") ||
    !typeof reqBody.category === String ||
    reqBody.category < 1
  ) {
    return false;
  }

  return true;
};

module.exports = {
  serverCheckBlogIsValid,
};
