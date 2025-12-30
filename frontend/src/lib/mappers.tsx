import { FaAmazon } from 'react-icons/fa';
import { HiOutlineShoppingBag, HiOutlineLightningBolt } from 'react-icons/hi';

const getStoreIcon = (slug?: string) => {
  switch (slug) {
    case 'amazon':
      return <FaAmazon className="w-5 h-5 text-white" />;
    case 'noon':
      return <HiOutlineLightningBolt className="w-5 h-5 text-[#FFEE00]" />;
    case 'hm':
      return <HiOutlineShoppingBag className="w-5 h-5 text-white" />;
    default:
      return null;
  }
};

/**
 * Maps a backend Deal entity (or any raw object representing it) to frontend DealProps
 */
export const mapDealToFrontend = (deal: any): any => {
  if (!deal) return null;

  const dealPrice = parseFloat(deal.dealPrice) || 0;
  const originalPrice = parseFloat(deal.originalPrice) || 0;

  const discountPercent =
    originalPrice > 0 ? Math.round((1 - dealPrice / originalPrice) * 100) : 0;

  // Handle store mapping safely (could be object or string)
  let storeName = 'Unknown Store';
  let storeSlug = undefined;
  let storeId = undefined;

  if (typeof deal.store === 'object' && deal.store !== null) {
    storeName = deal.store.name || 'Unknown Store';
    storeSlug = deal.store.slug;
    storeId = deal.store.id;
  } else if (typeof deal.store === 'string') {
    storeName = deal.store;
  } else if (deal.storeName) {
    storeName = deal.storeName;
  }

  return {
    ...deal,
    id: deal.id,
    title: deal.title,
    store: storeName,
    storeId: storeId || deal.storeId,
    price: `$${dealPrice.toFixed(2)}`,
    originalPrice: originalPrice > 0 ? `$${originalPrice.toFixed(2)}` : '',
    discount: discountPercent > 0 ? `${discountPercent}%` : '',
    commentsCount: parseInt(deal.commentsCount) || 0,
    comments: parseInt(deal.commentsCount) || 0,
    timePosted: deal.createdAt
      ? new Date(deal.createdAt).toLocaleDateString()
      : 'Just now',
    expiryDateFormatted: deal.expiryDate
      ? new Date(deal.expiryDate).toLocaleDateString()
      : null,
    timeLeft: deal.expiryDate
      ? (() => {
          const now = new Date();
          const end = new Date(deal.expiryDate);
          const diff = end.getTime() - now.getTime();
          if (diff <= 0) return 'Expired';
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          if (days > 30) return end.toLocaleDateString();
          if (days > 0) return `${days}d ${hours}h`;
          if (hours > 0)
            return `${hours}h ${Math.floor(
              (diff % (1000 * 60 * 60)) / (1000 * 60)
            )}m`;
          return 'Ending soon';
        })()
      : 'No expiry',
    category: deal.category?.name || 'Deals',
    verified: deal.isVerified === true,
    trending: (deal.temperature || 0) > 100,
    heatScore: deal.temperature || 0,
    isVotingFrozen: deal.isVotingFrozen,
    postedBy: deal.user?.username || 'Member',
    user: {
      name: deal.user?.username || 'Member',
      avatar:
        deal.user?.avatarUrl ||
        `https://api.dicebear.com/7.x/identicon/svg?seed=${deal.id}`,
    },
    images: deal.images?.map((img: any) => img.url) || [
      `https://api.dicebear.com/7.x/identicon/svg?seed=${deal.id}`,
    ],
    // For individual image view if needed
    imageUrl:
      deal.images?.[0]?.url ||
      `https://api.dicebear.com/7.x/identicon/svg?seed=${deal.id}`,
    storeIcon: deal.store?.logoUrl ? (
      <img
        src={deal.store.logoUrl}
        alt={storeName}
        className="w-full h-full object-cover"
      />
    ) : (
      getStoreIcon(storeSlug || deal.storeIcon)
    ),
    votes: {
      up: parseInt(deal.hotVotes) || 0,
      down: parseInt(deal.coldVotes) || 0,
      temperature: deal.temperature || 0,
    },
    description: deal.description || '',
    whatsIncluded: deal.whatsIncluded || [],
    howToGet:
      deal.howToGet ||
      'Click the "Get This Deal" button above to redeem this offer!',
    commentsList:
      deal.comments?.map((c: any) => ({
        id: c.id,
        user: {
          id: c.user?.id,
          name: c.user?.username || 'Anonymous',
          avatar:
            c.user?.avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.username}`,
        },
        text: c.content || c.text,
        likes: c.likesCount || 0,
        time: new Date(c.createdAt).toLocaleDateString(),
      })) || [],
  };
};
