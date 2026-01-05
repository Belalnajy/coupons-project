import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#49b99f] to-[#3d9c85] tracking-tighter uppercase mb-4">
        Privacy Policy
      </h1>
      <div className="prose prose-invert max-w-none text-light-grey space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            1. Data Collection
          </h2>
          <p>
            We collect information you provide directly to us when you create an
            account, post content, or communicate with us.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            2. Use of Information
          </h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, and to communicate with you about updates and offers.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">3. Data Sharing</h2>
          <p>
            We do not share your personal information with third parties except
            as described in this policy or with your consent.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            4. Your Security
          </h2>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
