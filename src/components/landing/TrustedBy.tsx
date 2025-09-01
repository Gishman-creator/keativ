import React from 'react';
import americanGreetingsLogo from '/brands/american-greetings-logo.webp';
import brandfetch from '/brands/brandfetch.svg';
import chobaniLogo from '/brands/chobani-logo.webp';
import crumblLogo from '/brands/crumbl-logo.webp';
import elPolloLocoLogo from '/brands/el-pollo-loco-logo.webp';
import kraftHeinzLogo from '/brands/kraft-heinz-logo.webp';
import rareBeautyLogo from '/brands/rare-beauty-logo.png';
import skimsLogo from '/brands/skims-logo.png';

const brands = [
  { name: 'American Greetings', logo: americanGreetingsLogo },
  { name: 'Brandfetch SVG', logo: brandfetch },
  { name: 'Chobani', logo: chobaniLogo },
  { name: 'Crumbl', logo: crumblLogo },
  { name: 'El Pollo Loco', logo: elPolloLocoLogo },
  { name: 'Kraft Heinz', logo: kraftHeinzLogo },
];

const TrustedBy = () => {
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-2xl font-semibold text-gray-600 mb-12">
          Trusted by growing brands worldwide
        </h2>
        <div className="relative overflow-hidden">
          <div className="bg-transparent flex animate-scroll">
            {duplicatedBrands.map((brand, index) => (
              <div key={index} className="flex-shrink-0 w-48 h-24 flex items-center justify-center mx-6 p-4 rounded-lg">
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
