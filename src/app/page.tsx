import Link from "next/link";

const Home = () => {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4 text-foreground">AI Debate Platform</h1>
      <p className="mb-8 text-foreground">
        Engage in live, role-based debates and let AI summarize the key
        insights.
      </p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="button  font-medium text-slate-100 px-4 py-2 rounded-md"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="button font-medium text-slate-900 px-4 py-2 rounded-md "
        >
          Register
        </Link>
      </div>
    </main>
  );
};

export default Home;
