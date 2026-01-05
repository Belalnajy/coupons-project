import React from 'react';

const Cookies: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#49b99f] to-[#3d9c85] tracking-tighter uppercase mb-4">
        Cookie Policy
      </h1>
      <div className="prose prose-invert max-w-none text-light-grey space-y-6">
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            What are cookies?
          </h2>
          <p>
            Cookies are small text files that are stored on your computer or
            mobile device when you visit a website.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            How we use cookies
          </h2>
          <p>
            We use cookies to understand how you use our website and to improve
            your experience. This includes keeping you logged in and remembering
            your preferences.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Managing cookies
          </h2>
          <p>
            Most web browsers allow you to control cookies through their
            settings. However, if you limit the ability of websites to set
            cookies, you may worsen your overall user experience.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Cookies;
