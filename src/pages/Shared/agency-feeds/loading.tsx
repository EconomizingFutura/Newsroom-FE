export default function Loading() {
  return (
    <div className="flex-1 font-openSans py-16 h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading content...</p>
      </div>
    </div>
  );
}
