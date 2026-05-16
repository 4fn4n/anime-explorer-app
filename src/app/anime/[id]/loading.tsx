export default function AnimeDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-6 h-6 w-20 rounded bg-gray-200 dark:bg-gray-700" />

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full md:w-1/3">
          <div className="aspect-3/4 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>

        <div className="w-full md:w-2/3 space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />

          <div className="flex gap-3 pt-2">
            <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 rounded bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="space-y-2 pt-4">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
