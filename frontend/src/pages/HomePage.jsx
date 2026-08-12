function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800">
          University Question Bank Portal
        </h2>

        <p className="mt-4 text-lg text-slate-600">
          Your university question papers in one place.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <div className="rounded-xl bg-white px-6 py-4 shadow">
            <p className="font-semibold">Students</p>
          </div>

          <div className="rounded-xl bg-white px-6 py-4 shadow">
            <p className="font-semibold">Faculty</p>
          </div>

          <div className="rounded-xl bg-white px-6 py-4 shadow">
            <p className="font-semibold">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;