// TEMPORARY REDIRECT - REMOVE AFTER [Date/Reason]
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/for-professionals',
      permanent: false,
    },
  };
}

// Original root page content (commented out for temporary redirect)
// export { default } from "@/views";

// Placeholder component for Next.js page
export default function HomePage() {
  return null;
}
