export default function Footer() {
  return (
    <footer id="footer" className="bg-[#1e1e27] text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
     
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#D10024]">E-Computer</h3>
            <p className="text-gray-400 mb-4">
              Your trusted destination for quality computers and electronics.
            </p>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <ion-icon name="location-outline" style={{ fontSize: "16px" }}></ion-icon>
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ion-icon
                  name="call-outline"
                  style={{ fontSize: "20px" }}
                  className="text-[#D10024]"
                ></ion-icon>
                <a
                  href="tel:+94712345678"
                  className="text-gray-400 hover:text-[#D10024] transition-all"
                >
                  +94 71 234 5678
                </a>
              </div>
              <div className="flex items-center gap-3">
                <ion-icon
                  name="mail-outline"
                  style={{ fontSize: "20px" }}
                ></ion-icon>
                <a
                  href="mailto:info@ecomputer.com"
                  className="text-gray-400 hover:text-[#D10024] transition-all"
                >
                  info@ecomputer.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <ion-icon
                  name="logo-whatsapp"
                  style={{ fontSize: "20px" }}
                ></ion-icon>
                <a
                  href="https://wa.me/94712345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-all"
                >
                  WhatsApp: +94 71 234 5678
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-[#D10024] transition-all">Laptops</a></li>
              <li><a href="#" className="hover:text-[#D10024] transition-all">Desktops</a></li>
              <li><a href="#" className="hover:text-[#D10024] transition-all">Monitors</a></li>
              <li><a href="#" className="hover:text-[#D10024] transition-all">Keyboards</a></li>
              <li><a href="#" className="hover:text-[#D10024] transition-all">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D10024] transition-all"
              >
                <ion-icon
                  name="logo-facebook"
                  style={{ fontSize: "32px" }}
                ></ion-icon>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D10024] transition-all"
              >
                <ion-icon
                  name="logo-instagram"
                  style={{ fontSize: "32px" }}
                ></ion-icon>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D10024] transition-all"
              >
                <ion-icon
                  name="logo-tiktok"
                  style={{ fontSize: "32px" }}
                ></ion-icon>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D10024] transition-all"
              >
                <ion-icon
                  name="logo-youtube"
                  style={{ fontSize: "32px" }}
                ></ion-icon>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 E-Computer. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-[#D10024] transition-all">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-[#D10024] transition-all">
                Terms of Service
              </a>
              <a href="/refund" className="hover:text-[#D10024] transition-all">
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
