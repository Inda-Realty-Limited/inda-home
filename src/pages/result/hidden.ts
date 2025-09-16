import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const reqUrl = ctx.req.url || "";
  const qsIndex = reqUrl.indexOf("?");
  const qs = qsIndex >= 0 ? reqUrl.slice(qsIndex + 1) : "";
  const destination = qs ? `/result?${qs}` : "/result";
  return {
    redirect: { destination, permanent: false },
  };
};

export default function HiddenRedirect() {
  return null;
}
