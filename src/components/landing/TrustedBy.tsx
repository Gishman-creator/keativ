import React from 'react';
import americanGreetingsLogo from '@/public/brands/american-greetings-logo.webp';
import brandFetchLogo from '@/public/brands/brand-fetch-logo.png';
import brandfetch from '@/public/brands/brandfetch.svg';
import chobaniLogo from '@/public/brands/chobani-logo.webp';
import crumblLogo from '@/public/brands/crumbl-logo.webp';
import elPolloLocoLogo from '@/public/brands/el-pollo-loco-logo.webp';
import kraftHeinzLogo from '@/public/brands/kraft-heinz-logo.webp';
import rareBeautyLogo from '@/public/brands/rare-beauty-logo.png';
import skimsLogo from '@/public/brands/skims-logo.png';

const brands = [
  { name: 'American Greetings', logo: americanGreetingsLogo },
  { name: 'Brandfetch', logo: brandFetchLogo },
  { name: 'Brandfetch SVG', logo: brandfetch },
  { name: 'Chobani', logo: chobaniLogo },
  { name: 'Crumbl', logo: crumblLogo },
  { name: 'El Pollo Loco', logo: elPolloLocoLogo },
  { name: 'Kraft Heinz', logo: kraftHeinzLogo },
  { name: 'Rare Beauty', logo: rareBeautyLogo },
  { name: 'Skims', logo: skimsLogo },
];

const TrustedBy = () => {
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-2xl font-semibold text-gray-600 mb-12">
          Trusted by growing brands worldwide
        </h2>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedBrands.map((brand, index) => (
              <div key={index} className="flex-shrink-0 w-48 h-24 flex items-center justify-center mx-6 bg-white p-4 rounded-lg">
                <img src={brand.logo} alt={brand.name} className="h-12 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
