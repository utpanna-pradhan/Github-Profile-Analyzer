import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CommitData {
  date: string;
  day: string;
  commits: number;
}

interface DailyCommitsChartProps {
  owner: string;
  repoName: string;
  className?: string;
}

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const DailyCommitsChart = ({ owner, repoName, className }: DailyCommitsChartProps) => {
  const [commitData, setCommitData] = useState<CommitData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommitActivity = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = import.meta.env.VITE_GITHUB_TOKEN;

        const headers: HeadersInit = {
          Accept: 'application/vnd.github.v3+json',
        };

        if (token) {
          headers.Authorization = `token ${token}`;
        }

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repoName}/stats/commit_activity`,
          { headers }
        );

        if (response.status === 202) {
          // GitHub is computing the data, retry after a delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          return fetchCommitActivity();
        }

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format from GitHub');
        }

        // Get the most recent week of data
        const lastWeek = data[data.length - 1];
        if (!lastWeek) {
          setCommitData([]);
          return;
        }

        // Convert to daily data
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyCommits = lastWeek.days.map((count: number, index: number) => {
          const date = new Date(lastWeek.week * 1000);
          date.setDate(date.getDate() + index);

          return {
            date: date.toLocaleDateString(),
            day: days[index],
            commits: count
          };
        });

        setCommitData(dailyCommits);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load commit data');
        console.error('Error fetching commit activity:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommitActivity();
  }, [owner, repoName]);

  if (isLoading) {
    return (
      <div className={className}>
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>
          Error loading commit data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (commitData.length === 0) {
    return (
      <div className={className}>
        <p className="text-muted-foreground text-center py-8">
          No commit data available for this repository
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">Daily Commits (Last Week)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={commitData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`${value} commits`, 'Commits']}
              labelFormatter={(label) => {
                const date = commitData.find(d => d.day === label)?.date;
                return date ? `Date: ${date}` : label;
              }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Bar dataKey="commits" name="Commits">
              {commitData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
