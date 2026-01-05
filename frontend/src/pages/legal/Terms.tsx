import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#49b99f] to-[#3d9c85] tracking-tighter uppercase mb-4">
        Terms of Service
      </h1>
      <div className="prose prose-invert max-w-none text-light-grey space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
          <p>
            Welcome to our platform. By accessing or using our website, you
            agree to be bound by these terms of service and all applicable laws
            and regulations.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            2. User Accounts
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to accept responsibility for all
            activities that occur under your account.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            3. Content and Use
          </h2>
          <p>
            Users may post deals and coupons. You represent that you have the
            right to post such content and that it does not violate any
            third-party rights.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            4. Limitation of Liability
          </h2>
          <p>
            We shall not be liable for any direct, indirect, incidental, special
            or consequential damages resulting from the use or inability to use
            the service.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
