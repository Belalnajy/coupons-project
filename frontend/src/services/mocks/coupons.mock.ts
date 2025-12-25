import type { Coupon } from '@/lib/types';

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 1,
    title: 'Extra 20% Off Electronics',
    store: 'Amazon',
    code: 'SAVE20',
    badge: '20% OFF',
    expiresIn: '3 days',
    usedTimes: '156 times',
    storeIcon: 'amazon',
  },
  {
    id: 2,
    title: 'Free Delivery on Orders Over £25',
    store: 'Amazon',
    code: 'FREESHIP',
    badge: 'Free shipping',
    expiresIn: '7 days',
    usedTimes: '98 times',
    storeIcon: 'amazon',
  },
  {
    id: 3,
    title: '£10 Off Your First Order',
    store: 'Amazon',
    code: 'WELCOME10',
    badge: '£10 OFF',
    expiresIn: '14 days',
    usedTimes: '234 times',
    storeIcon: 'amazon',
  },
  {
    id: 4,
    title: '15% Off Fashion Items',
    store: 'Amazon',
    code: 'STYLE15',
    badge: '15% OFF',
    expiresIn: '5 days',
    usedTimes: '67 times',
    storeIcon: 'amazon',
  },
];
