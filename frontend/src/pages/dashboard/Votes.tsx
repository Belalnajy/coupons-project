import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiThumbsUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface UserVote {
  id: number;
  dealTitle: string;
  type: 'hot' | 'cold';
  date: string;
  score: number;
}

const MOCK_VOTES: UserVote[] = [
  {
    id: 1,
    dealTitle: 'Apple MacBook Air M2 - $899 at Amazon',
    type: 'hot',
    date: '2025-12-24',
    score: 145,
  },
  {
    id: 2,
    dealTitle: 'Sony WH-1000XM5 Headphones - $299',
    type: 'hot',
    date: '2025-12-23',
    score: 89,
  },
  {
    id: 3,
    dealTitle: 'Generic USB Cable - $19.99 (Overpriced)',
    type: 'cold',
    date: '2025-12-22',
    score: -12,
  },
];

export default function Votes() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Votes</h1>
          <p className="text-light-grey">
            Track your contributions to the community.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {MOCK_VOTES.map((vote) => (
          <Card
            key={vote.id}
            className="bg-grey border-none text-white overflow-hidden hover:bg-grey/80 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center',
                    vote.type === 'hot'
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-blue-500/10 text-blue-500'
                  )}>
                  {vote.type === 'hot' ? (
                    <FiArrowUp className="w-6 h-6" />
                  ) : (
                    <FiArrowDown className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {vote.dealTitle}
                  </h3>
                  <p className="text-sm text-light-grey">
                    Voted on {new Date(vote.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-light-grey uppercase font-bold tracking-wider mb-1">
                    Status
                  </p>
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-bold uppercase',
                      vote.type === 'hot'
                        ? 'bg-red-500/20 text-red-500'
                        : 'bg-blue-500/20 text-blue-500'
                    )}>
                    {vote.type === 'hot' ? 'Hot' : 'Cold'}
                  </span>
                </div>
                <div className="text-center w-16">
                  <p className="text-xs text-light-grey uppercase font-bold mb-1">
                    Deal Score
                  </p>
                  <p
                    className={cn(
                      'font-bold',
                      vote.score > 0 ? 'text-red-500' : 'text-blue-500'
                    )}>
                    {vote.score > 0 ? `+${vote.score}` : vote.score}°
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {MOCK_VOTES.length === 0 && (
        <div className="bg-grey rounded-xl p-12 text-center text-light-grey border border-dashed border-white/10">
          <FiThumbsUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-medium mb-1">No votes yet</p>
          <p>Your votes on deals will appear here.</p>
        </div>
      )}
    </div>
  );
}
