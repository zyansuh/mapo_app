const pagination = (req, res, next) => {
  // 기본값 설정
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  // 페이지네이션 계산
  const skip = (page - 1) * limit;

  // 요청 객체에 페이지네이션 정보 추가
  req.pagination = {
    page,
    limit,
    skip,
    sort: { [sortBy]: sortOrder },
  };

  next();
};

module.exports = pagination;
