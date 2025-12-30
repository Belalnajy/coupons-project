import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FiClock,
  FiExternalLink,
  FiThumbsUp,
  FiThumbsDown,
  FiCopy,
  FiFacebook,
  FiTwitter,
  FiLink,
  FiGrid,
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { IoTimerOutline } from 'react-icons/io5';
import { getDealById, getDeals, voteDeal, getVoteStatus } from '@/services/api';
import type { Deal } from '@/lib/types';
import { mapDealToFrontend } from '@/lib/mappers';
import { DealCard } from '@/components/features/deals';
import { CommentSection } from '@/components/features/coupons';
import { useAuth } from '@/context/AuthContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function DealsDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [userVote, setUserVote] = useState<'hot' | 'cold' | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVote = async (type: 'hot' | 'cold') => {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: 'Sign in Required',
        text: 'Please sign in to vote. Go to sign in page?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#49b99f',
        cancelButtonColor: '#333',
        confirmButtonText: 'Yes, go to Sign In',
        background: '#222',
        color: '#fff',
      });

      if (result.isConfirmed) {
        navigate('/signin');
      }
      return;
    }

    if (!id || isVoting || !deal) return;

    setIsVoting(true);
    try {
      const response = await voteDeal(id, type);
      if (response) {
        const { action, temperature } = response;

        // Update deal state locally
        setDeal((prev) => {
          if (!prev) return null;
          const votes = { ...prev.votes };
          votes.temperature = temperature;

          // Adjust counts based on action
          if (action === 'created') {
            if (type === 'hot') votes.up = (votes.up || 0) + 1;
            else votes.down = (votes.down || 0) + 1;
            toast.success(`Marked as ${type === 'hot' ? 'Hot' : 'Cold'}!`);
          } else if (action === 'removed') {
            if (type === 'hot') votes.up = Math.max(0, (votes.up || 0) - 1);
            else votes.down = Math.max(0, (votes.down || 0) - 1);
            toast('Vote removed', { icon: '🗑️' });
          } else if (action === 'changed') {
            if (type === 'hot') {
              votes.up = (votes.up || 0) + 1;
              votes.down = Math.max(0, (votes.down || 0) - 1);
            } else {
              votes.up = Math.max(0, (votes.up || 0) - 1);
              votes.down = (votes.down || 0) + 1;
            }
            toast.success(`Changed to ${type === 'hot' ? 'Hot' : 'Cold'}!`);
          }

          return {
            ...prev,
            votes: {
              ...votes,
              up: votes.up as number,
              down: votes.down as number,
              temperature: votes.temperature as number,
            },
          };
        });

        // Update user vote status
        setUserVote(action === 'removed' ? null : type);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      toast.error('Failed to cast vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const dealData = await getDealById(id);
        if (dealData) {
          setDeal(mapDealToFrontend(dealData));
        }

        if (isAuthenticated) {
          const voteStatus = await getVoteStatus(id);
          setUserVote(voteStatus.type);
        }

        const related = await getDeals({ limit: 4 });
        const relatedItems = Array.isArray(related.data) ? related.data : [];
        setRelatedDeals(relatedItems.map(mapDealToFrontend));
      } catch (error) {
        console.error('Failed to fetch deal details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-grey rounded-full mb-4"></div>
          <p>Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Deal not found</h2>
        <Button variant="outline" className="bg-grey" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  // Calculate savings for the badge
  const dealPriceVal = parseFloat(deal.price.replace('$', ''));
  const originalPriceVal = parseFloat(deal.originalPrice.replace('$', ''));
  const savingsAmount =
    originalPriceVal > dealPriceVal
      ? (originalPriceVal - dealPriceVal).toFixed(2)
      : '0.00';

  return (
    <div className="min-h-screen bg-background text-white pb-12">
      <div className="container mx-auto px-4 pt-6">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-white hover:text-green transition-colors">
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-white hover:text-green transition-colors">
                <Link to="/deals">{(deal as any).category || 'Deals'}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-green font-medium truncate max-w-[200px] md:max-w-none">
                {deal.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Deal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-4">
            <div className="bg-darker-grey aspect-video xl:aspect-4/3 max-h-[400px] rounded-lg flex items-center justify-center overflow-hidden border border-grey">
              {deal.images && deal.images.length > 0 ? (
                <img
                  src={deal.images[activeImageIndex]}
                  alt={deal.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-7xl opacity-20">📱</span>
              )}
            </div>
            {deal.images && deal.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {deal.images.map((img: string, i: number) => (
                  <div
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`bg-darker-grey aspect-square rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                      activeImageIndex === i
                        ? 'border-green opacity-100'
                        : 'border-grey opacity-50 hover:opacity-100'
                    }`}>
                    <img
                      src={img}
                      alt={`${deal.title} thumb ${i}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Deal Info */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-6">
            <div className="space-y-4">
              {deal.discount && (
                <Badge className="bg-red rounded-md text-lg py-1 px-3 hover:bg-red">
                  {deal.discount} off!
                </Badge>
              )}
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {deal.title}
              </h1>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-grey flex items-center justify-center overflow-hidden">
                  {deal.storeIcon || (
                    <span className="text-xs uppercase">
                      {(deal as any).store?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  <div className="text-light-white font-medium">
                    {(deal as any).store}
                  </div>
                  <Link
                    to={`/deals?store=${(deal as any).storeId}`}
                    className="text-green hover:underline text-xs">
                    View all deals from this store →
                  </Link>
                </div>
              </div>
            </div>

            {/* Voting Section */}
            <Separator className="bg-grey/50" />
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-row items-center justify-between w-full max-w-2xl mx-auto relative">
                {deal.isVotingFrozen && (
                  <div className="absolute inset-x-0 -top-8 text-center">
                    <span className="bg-grey px-3 py-1 rounded-full text-xs font-bold text-light-grey border border-white/10">
                      Voting checks are frozen
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleVote('hot')}
                  disabled={isVoting || deal.isVotingFrozen}
                  className={`flex items-center justify-center gap-2 px-6 py-3 w-[120px] md:w-[150px] text-white cursor-pointer rounded-md transition-colors ${
                    userVote === 'hot'
                      ? 'bg-red border-2 border-white/20'
                      : 'bg-red/80 hover:bg-red'
                  } ${
                    isVoting || deal.isVotingFrozen
                      ? 'opacity-50 cursor-not-allowed grayscale'
                      : ''
                  }`}>
                  <FiThumbsUp /> Hot {deal.votes?.up}
                </button>
                <div className="flex flex-col items-center justify-center px-4">
                  <div className="text-red rounded-full h-20 w-20 border-4 border-red bg-red/10 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <FaFire className="w-5 h-5 mb-0.5" />
                    <span className="font-bold text-lg">
                      {deal.votes?.temperature}°
                    </span>
                  </div>
                  <span className="text-[10px] text-light-grey mt-2">
                    {(deal.votes?.up || 0) + (deal.votes?.down || 0)} votes
                  </span>
                </div>
                <button
                  onClick={() => handleVote('cold')}
                  disabled={isVoting || deal.isVotingFrozen}
                  className={`flex items-center justify-center gap-2 px-6 py-3 w-[120px] md:w-[150px] text-white cursor-pointer rounded-md transition-colors ${
                    userVote === 'cold'
                      ? 'bg-blue-600 border-2 border-white/20'
                      : 'bg-blue-600/80 hover:bg-blue-700'
                  } ${
                    isVoting || deal.isVotingFrozen
                      ? 'opacity-50 cursor-not-allowed grayscale'
                      : ''
                  }`}>
                  <FiThumbsDown /> Cold {deal.votes?.down}
                </button>
              </div>
            </div>

            {/* Pricing */}
            <Separator className="bg-grey/50" />
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green">
                  {deal.price}
                </span>
                {deal.originalPrice && (
                  <span className="text-xl text-light-grey line-through">
                    {deal.originalPrice}
                  </span>
                )}
              </div>
              {deal.originalPrice && (
                <Badge className="bg-green/10 text-green border-green rounded-md px-3 py-1">
                  You save ${savingsAmount} ({deal.discount})
                </Badge>
              )}
            </div>

            {/* Coupon Code */}
            {(deal as any).couponCode && (
              <div className="p-5 border-2 border-dashed border-green bg-green/5 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-sm text-green font-semibold">
                  <FiClock className="w-4 h-4" /> Use Coupon Code
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 bg-white text-darker-grey font-mono font-bold text-xl flex items-center justify-center rounded-md border border-light-grey shadow-inner">
                    {(deal as any).couponCode}
                  </div>
                  <Button
                    onClick={() => handleCopy((deal as any).couponCode)}
                    className="bg-green hover:bg-green/90 gap-2 cursor-pointer h-auto py-3 px-6 font-bold">
                    <FiCopy /> {isCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs text-light-white opacity-80 italic">
                  📍 Copy this code and paste it at checkout to get your
                  discount
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-light-grey mt-6">
              <div className="flex items-center gap-3 bg-grey/30 p-3 rounded-lg">
                <FiClock className="text-green" />
                <span>
                  Posted {deal.timePosted} by{' '}
                  <span className="text-green font-medium">
                    {(deal as any).postedBy}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 bg-red/10 p-3 rounded-lg text-red-400">
                <IoTimerOutline />
                <span>{deal.timeLeft}</span>
              </div>
              <div className="flex items-center gap-3 bg-grey/30 p-3 rounded-lg">
                <FiExternalLink className="text-green" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-3 bg-grey/30 p-3 rounded-lg">
                <FiGrid className="text-green" />
                <span>Online {deal.category}</span>
              </div>
            </div>

            {/* Social */}
            <Separator className="bg-grey/50 pt-4" />
            <div className="flex flex-col gap-5 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium">Share:</span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-10 h-10 rounded-full bg-grey border-none hover:bg-grey/70 cursor-pointer">
                      <FiFacebook className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-10 h-10 rounded-full bg-grey border-none hover:bg-grey/70 cursor-pointer">
                      <FiTwitter className="w-5 h-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="w-10 h-10 rounded-full bg-grey border-none hover:bg-grey/70 cursor-pointer">
                      <FiLink className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <Button
                  asChild
                  className="bg-green hover:bg-green/90 py-6 px-8 text-lg font-bold gap-3 cursor-pointer shadow-lg shadow-green/20">
                  <a
                    href={(deal as any).dealUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer">
                    <FiExternalLink className="w-5 h-5" /> Get This Deal
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs (Simplified) */}
        <div className="mt-12 bg-grey rounded-lg p-8 border border-grey/50 space-y-8 shadow-xl">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green flex items-center gap-2">
              <FiGrid className="w-6 h-6" /> Deal Description
            </h2>
            <div className="space-y-4 text-light-white leading-relaxed text-lg">
              {deal.description ? (
                deal.description.split('\n').map((para, i) => (
                  <p
                    key={i}
                    className={i === 0 ? 'font-medium text-white text-xl' : ''}>
                    {i === 0 ? '🔥 ' : ''}
                    {para}
                  </p>
                ))
              ) : (
                <p>No description available for this deal.</p>
              )}
            </div>
          </div>

          {deal.whatsIncluded && deal.whatsIncluded.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-green">What's Included:</h3>
              <ul className="list-disc list-inside text-light-white space-y-2 ml-4 text-lg">
                {deal.whatsIncluded.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-darker-grey/50 p-6 rounded-lg border border-grey/30">
            <p className="text-light-white leading-relaxed text-lg">
              <span className="font-bold text-green text-xl inline-flex items-center gap-2 mr-2">
                How to Get This Deal:
              </span>{' '}
              {deal.howToGet}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection comments={deal.commentsList || []} dealId={deal.id} />
        </div>

        {/* Similar Deals */}
        <div className="mt-20 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">You Might Also Like</h2>
            <Link to="/deals" className="text-green hover:underline">
              View all deals →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedDeals.map((d) => (
              <DealCard key={d.id} deal={d} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
