import ogImage from "@/assets/og-image.png";

export const siteConfig = {
  name: "Ba Lô & Dép Lào",
  description: "You only live once. Make it count!",
  url: "https://balodeplao.com",
  lang: "vi",
  locale: "vi_VN",
  author: "Thuan Bui",
  twitter: "@10h30",
  ogImage: ogImage,
  socialLinks: {
    instagram: "https://instagram.com/balodeplao",
    facebook: "https://facebook.com/balodeplao",
  },
  navLinks: [
    { text: "Du Lịch", href: "/category/du-lich" },
    { text: "Ẩm Thực", href: "/category/an-uong" },
    { text: "Làm Đẹp", href: "/category/lam-dep" },
    { text: "Tâm Sự", href: "/category/tam-su" },
    { text: "Mẹo Hay", href: "/category/meo-hay" },
  ],
};
