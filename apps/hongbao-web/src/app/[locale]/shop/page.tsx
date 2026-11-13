import ShopPage from "./components/ShopPage/ShopPage";
import { ShopProductType } from "./types/shop.type";

const isShopType = (v?: string): v is ShopProductType =>
  v === "course" || v === "mock-test";

type Props = {
  searchParams: Promise<{ type?: string }>;
};

const Shop = async ({ searchParams }: Props) => {
  const { type } = await searchParams;
  return <ShopPage initialType={isShopType(type) ? type : "all"} />;
};

export default Shop;
