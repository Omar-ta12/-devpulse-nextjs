export function getUserStats(users) {
  const bizUserList = users.filter((user) =>
    user.email.endsWith(".biz")
  );

  const companyNames = [
    ...new Set(users.map((user) => user.company.name)),
  ];

  return {
    totalUsers: users.length,

    bizUsers: bizUserList.length,
    bizUserList,                    // ✅ actual user objects for cards

    companies: companyNames.length,
    companyList: companyNames,      // ✅ actual names for badges

    hasWebsite: users.filter((u) => u.website).length, // ✅ boolean check
  };
}