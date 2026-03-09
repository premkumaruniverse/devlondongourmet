import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden border-2 border-stone-100 dark:border-white/10 bg-white dark:bg-[#1a0606] transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] dark:hover:shadow-none hover:-translate-y-2 group/card">
      <div onClick={() => handleGetProductDetails(product?._id)} className="cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover transition-transform duration-700 group-hover/card:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
          
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white font-black uppercase tracking-widest text-[9px] px-3 py-1 animate-pulse">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white font-black uppercase tracking-widest text-[9px] px-3 py-1">
              {`${product?.totalStock} REMAINING`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-4 left-4 bg-amber-500 text-[#1a0505] font-black uppercase tracking-[3px] text-[9px] px-3 py-1 shadow-lg shadow-amber-500/20">
              MANIFESTED SALE
            </Badge>
          ) : null}
        </div>

        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-black text-[#1a0505] dark:text-white uppercase tracking-tighter italic leading-none line-clamp-1 group-hover/card:text-amber-600 transition-colors">{product?.title}</h2>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-[9px] font-black uppercase tracking-[3px] text-stone-400 dark:text-gray-500 italic">
              {categoryOptionsMap[product?.category] || "GASTRONOMY"}
            </span>
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <div className="flex items-baseline gap-2">
               <span
                 className={`${
                   product?.salePrice > 0 ? "line-through text-stone-300 dark:text-gray-600 text-sm" : "text-2xl font-black text-amber-600 dark:text-amber-500 tabular-nums"
                 } tracking-tighter`}
               >
                 £{product?.price}
               </span>
               {product?.salePrice > 0 ? (
                 <span className="text-2xl font-black text-[#1a0505] dark:text-white tabular-nums tracking-tighter">
                   £{product?.salePrice}
                 </span>
               ) : null}
            </div>
            <span className="text-[9px] font-black uppercase text-stone-300 dark:text-gray-700 tracking-widest leading-none">VAT INCL.</span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-6 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full h-14 opacity-40 cursor-not-allowed bg-stone-100 dark:bg-white/5 text-stone-400 dark:text-gray-600 rounded-xl font-black uppercase tracking-widest text-[10px]">
            OUT OF STOCK
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full h-14 bg-[#1a0505] dark:bg-amber-500/10 hover:bg-black dark:hover:bg-amber-500 text-white dark:text-amber-500 dark:hover:text-[#1a0505] transition-all duration-500 font-black uppercase tracking-[4px] text-[10px] rounded-xl shadow-xl shadow-black/10 group/btn"
          >
            ACQUIRE BITE <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-2 transition-all" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
