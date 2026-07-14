import React from "react";
import { BadgeCent, ShieldCheck, ShoppingCart, Tag } from "lucide-react";

function Highlights() {
  return (
    <div className="px-[5%] mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Free Delivery */}
        <div className="flex items-start gap-4">
          <ShoppingCart className="text-[#f86D72] w-8 h-8 mt-6" />

          <div>
            <h4 className="font-semibold text-lg">Free Delivery</h4>
            <p className="text-gray-500 text-sm mt-1">Enjoy fast and free shipping on all orders with no extra cost.</p>
          </div>
        </div>

        {/* Quality Guarantee */}
        <div className="flex items-start gap-4">
          <BadgeCent className="text-[#f86D72] w-8 h-8 mt-6" />

          <div>
            <h4 className="font-semibold text-lg">Quality Guarantee</h4>
            <p className="text-gray-500 text-sm mt-1">We guarantee the highest quality for every product.</p>
          </div>
        </div>

        {/* Affordable Price */}
        <div className="flex items-start gap-4">
          <Tag className="text-[#f86D72] w-8 h-8 mt-6" />

          <div>
            <h4 className="font-semibold text-lg">Affordable Price</h4>
            <p className="text-gray-500 text-sm mt-1">Get premium products at the best prices on the market.</p>
          </div>
        </div>

        {/* Secure Payment */}
        <div className="flex items-start gap-4">
          <ShieldCheck className="text-[#f86D72] w-8 h-8 mt-6" />

          <div>
            <h4 className="font-semibold text-lg">Secure Payment</h4>
            <p className="text-gray-500 text-sm mt-1">Shop with confidence using our safe and secure payment methods.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Highlights;
