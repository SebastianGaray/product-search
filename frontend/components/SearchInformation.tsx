export default function SearchInformation({ searchInformation }: any) {
  const totalHits = searchInformation?.total_hits;
  const timeTaken = searchInformation?.time_taken;

  function formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds - minutes * 60);
    const microseconds = Math.floor((timeInSeconds - Math.floor(timeInSeconds)) * 1000)
      .toString()
      .padStart(3, '0');
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s ${microseconds}ms`;
  }
  console.log("searchInformation:");
  console.log(searchInformation);
  return (
    <div className="flex justify-center mt-8">
      <p className="text-gray-500 text-sm">
        Showing {totalHits} results. Time taken in backend: {formatTime(timeTaken)}
      </p>
    </div>
  );
}