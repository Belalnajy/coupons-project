export default function Coupons() {
  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Exclusive Coupons</h1>
          <p className="text-light-grey">
            Browse and copy the latest coupon codes from top stores
          </p>
        </div>

        {/* Widget Container - Simple and Clean */}
        <div className="bg-grey rounded-lg overflow-hidden">
          <iframe
            src="https://coupons.dcmnetwork.com/widget?widgetId=fadd30b6-fa9c-4a60-83dc-a47ab15f115c"
            width="100%"
            height="800"
            style={{ border: 'none' }}
            title="Exclusive Coupons Widget"
            className="w-full min-h-[800px]"
          />
        </div>
      </div>
    </div>
  );
}
