type ESLintReport = {
  node: any,
  message: string,
};

type ESLintContext = {
  report: (ESLintReport) => void,
};
