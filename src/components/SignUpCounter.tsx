import { useEffect, useState } from 'react';

const SignupCounter = ({ goalCount, updateInterval }: { goalCount: number, updateInterval: number }) => {
  const [count, setCount] = useState(0);
  const [animateCount, setAnimateCount] = useState(false);
  
  const progressPercentage = (count / goalCount) * 100;
  
  useEffect(() => {
    // Initialize the since date to 1 hour ago
    const initialSince = new Date().toISOString();
    
    const fetchSignups = async (since: string) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/internal/live_stream_signup_count/get?since=${encodeURIComponent(since)}`
        );
        const data = await response.json();
        const newSignups = data.live_stream_signup_counts.new_signups;
        
        setCount(prevCount => {
          const newCount = prevCount + newSignups;
          if (newCount !== prevCount) {
            setAnimateCount(true);
            setTimeout(() => setAnimateCount(false), 500);
          }
          return newCount;
        });
        
        return data.live_stream_signup_counts.latest_signup_at;
      } catch (error) {
        console.error('Error fetching signup data:', error);
        return since;
      }
    };

    let lastSince = initialSince;
    const interval = setInterval(async () => {
      lastSince = await fetchSignups(lastSince);
    }, updateInterval);

    // Initial fetch
    fetchSignups(initialSince);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent p-8">
      <div className={`w-full max-w-xl transition-all duration-500 ${animateCount ? 'scale-105' : 'scale-100'}`}>
        {/* Removed background container for full transparency */}
        <div className="p-6">
          <div className="text-8xl font-bold text-white text-center mb-6 drop-shadow-lg">
            {count}
          </div>
          
          <div className="relative pt-1">
            {/* Progress percentage */}
            <div className="flex mb-2 items-center justify-between">
              <div className="text-right w-full">
                <span className="text-2xl font-bold inline-block text-white drop-shadow-lg">
                  {Math.min(Math.round(progressPercentage), 100)}%
                </span>
              </div>
            </div>
            
            {/* Progress bar with glow effect */}
            <div className="overflow-hidden h-8 mb-4 text-xs flex rounded-full bg-black bg-opacity-50 shadow-lg">
              <div
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                className="transition-all duration-1000 ease-out shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              />
            </div>
            
            {/* Counter text */}
            <div className="text-xl text-white text-center font-bold drop-shadow-lg">
              {count} / {goalCount} signups
            </div>
          </div>
          
          {/* Goal completion message */}
          {count >= goalCount && (
            <div className="mt-4 text-2xl text-white text-center font-bold animate-bounce drop-shadow-lg">
              Goal Reached! 🎉
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupCounter;