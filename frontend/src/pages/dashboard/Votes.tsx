import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FiThumbsUp, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { getMyVotes } from '@/services/api/users.api';

export default function Votes() {
  const [votes, setVotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVotes() {
      setIsLoading(true);
      try {
        const response = await getMyVotes();
        setVotes(response.data || []);
      } catch (error) {
        console.error('Failed to fetch votes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVotes();
  }, []);

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
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-grey rounded-xl animate-pulse" />
          ))
        ) : votes.length > 0 ? (
          votes.map((vote) => (
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
                      {vote.deal?.title || 'Unknown Deal'}
                    </h3>
                    <p className="text-sm text-light-grey">
                      Voted on {new Date(vote.createdAt).toLocaleDateString()}
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
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="bg-grey rounded-xl p-12 text-center text-light-grey border border-dashed border-white/10">
            <FiThumbsUp className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium mb-1">No votes yet</p>
            <p>Your votes on deals will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
