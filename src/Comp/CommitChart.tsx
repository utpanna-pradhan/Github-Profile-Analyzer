import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

interface CommitData {
  date: string;
  count: number;
}

interface CommitChartProps {
  data: CommitData[];
  username: string;
}

// ✅ Helper to fill missing days with 0 commits
function fillMissingDates(data: CommitData[], startDate: Date, endDate: Date): CommitData[] {
  const map = new Map(data.map(d => [d.date, d.count]));
  const filledData: CommitData[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    filledData.push({ date: dateStr, count: map.get(dateStr) || 0 });
  }

  return filledData;
}

const CommitChart: React.FC<CommitChartProps> = ({ data, username }) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);

  const filledData = fillMissingDates(data, startDate, endDate);

  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Contribution Chart
      </h3>
      <p className="text-center mb-4">Commit chart for: {username}</p>

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={filledData}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          if (value.count >= 4) return 'color-github-4';
          if (value.count >= 3) return 'color-github-3';
          if (value.count >= 2) return 'color-github-2';
          return 'color-github-1';
        }}
        tooltipDataAttrs={(value) => {
          return {
            'data-tip': `${value?.date} – ${value?.count || 0} commits`
          } as { [key: string]: string };
        }}
        showWeekdayLabels={true}
      />

      <ReactTooltip />

      {/* Optional: Add GitHub color styles */}
      <style>{`
        .color-empty { fill: #ebedf0; }
        .color-github-1 { fill: #c6e48b; }
        .color-github-2 { fill: #7bc96f; }
        .color-github-3 { fill: #239a3b; }
        .color-github-4 { fill: #196127; }
      `}</style>
    </div>
  );
};

export default CommitChart;
