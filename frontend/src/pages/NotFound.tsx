

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-9xl font-extrabold text-[#111111] opacity-10">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-[#777777] mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <a href="/" className="bg-[#FF3B30] text-white px-8 py-3 rounded-full font-medium hover:bg-[#e6352b] transition-colors">
        Back to Home
      </a>
    </div>
  );
};

export default NotFound;
