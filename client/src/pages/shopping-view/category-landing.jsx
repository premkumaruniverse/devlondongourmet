import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowLeft,
    ArrowUpDownIcon,
    Leaf,
    FlameKindling,
    Soup,
    Fish,
    Star,
    ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
    fetchAllFilteredProducts,
    fetchProductDetails,
} from "@/store/shop/products-slice";

// ── Per-category rich content ────────────────────────────────────────────────
const categoryContent = {
    "rubs-spice-mix": {
        name: "Rubs & Spice Mix",
        tagline: "Where Every Dish Tells a Story",
        heroImage:
            "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        accentColor: "amber",
        story: `Born in the bustling spice markets of South Asia and refined in London's finest kitchens, our Rubs & Spice Mixes are the beating heart of London Gourmet. Every blend is hand-crafted by our master spice artisans who source the finest whole spices — sun-dried Kashmiri chillies, stone-ground cumin from Rajasthan, and aromatic coriander from the Karnataka highlands.

    We slow-roast and cold-grind our spices in small batches to lock in volatile oils that give each blend its distinctive depth and aroma. No fillers, no artificial colour, no corners cut. The result is a collection of signature blends that transform a simple weeknight meal into a gourmet experience — in under 30 minutes.`,
        facts: [
            { icon: <Leaf className="w-5 h-5" />, label: "Origin", value: "South Asia & UK kitchens" },
            { icon: <FlameKindling className="w-5 h-5" />, label: "Heat Profile", value: "Mild · Medium · Bold" },
            { icon: <Star className="w-5 h-5" />, label: "Best For", value: "Grilling, roasting & rubs" },
            { icon: <ShoppingBag className="w-5 h-5" />, label: "Batch Size", value: "Small-batch, weekly fresh" },
        ],
        subcategories: ["Spice Mix", "Kebab Rubs"],
    },
    achar: {
        name: "Achar",
        tagline: "The Soul of South Asian Tradition",
        heroImage:
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        accentColor: "orange",
        story: `Achar — the word alone is enough to transport you back to sun-drenched courtyards where clay jars of pickles sat maturing under an afternoon sun. At London Gourmet, we honour that centuries-old craft with achars made in time-honoured fashion: hand-cut raw mangos, cauliflower, and seasonal vegetables, married with cold-pressed mustard oil, whole spices, and a secret in-house masala.

    Slow-fermented for a minimum of 21 days, each batch develops a rounded complexity that no shortcut can replicate. Rich, tangy, mildly fiery — our achars are a condiment, a side, and a conversation starter all rolled into one jar.`,
        facts: [
            { icon: <Leaf className="w-5 h-5" />, label: "Base", value: "Mustard oil & whole spices" },
            { icon: <FlameKindling className="w-5 h-5" />, label: "Heat", value: "Medium tang, moderate heat" },
            { icon: <Star className="w-5 h-5" />, label: "Aged", value: "Minimum 21-day ferment" },
            { icon: <ShoppingBag className="w-5 h-5" />, label: "Best With", value: "Dal, biryanis & flatbreads" },
        ],
        subcategories: [],
    },
    rassa: {
        name: "Rassa",
        tagline: "Gourmet Gravies & Chutneys, Bottled to Perfection",
        heroImage:
            "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
        accentColor: "red",
        story: `Rassa — Marathi for "essence" — is our ode to the deep, slow-simmered sauces that define South Asian comfort food. Our gravies begin with a base of caramelised onions, fire-roasted tomatoes, and hand-pounded ginger-garlic paste, then layer upon layer of spice is added at precise temperatures to coax out each flavour note.

    Our chutneys tell a parallel story — vibrant, fresh, and punchy. Our tamarind chutney balances sweet dates with tart tamarind in a ratio perfected over three years of blind tastings. Whether you're serving a crispy chaat, a slow-braised lamb, or a simple piece of grilled chicken, Rassa brings restaurant depth to your home table in minutes.`,
        facts: [
            { icon: <Soup className="w-5 h-5" />, label: "Process", value: "Slow-simmered 4+ hours" },
            { icon: <Leaf className="w-5 h-5" />, label: "Base", value: "Fire-roasted tomato & onion" },
            { icon: <Star className="w-5 h-5" />, label: "Types", value: "Gravies · Chutneys" },
            { icon: <ShoppingBag className="w-5 h-5" />, label: "Serves", value: "4-6 portions per jar" },
        ],
        subcategories: ["Gravies", "Chutneys"],
    },
    "cured-coated": {
        name: "Cured & Coated",
        tagline: "Premium Marinated Selections, Ready to Cook",
        heroImage:
            "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        accentColor: "rose",
        story: `Our Cured & Coated range is London Gourmet's answer to the modern cook's greatest challenge: getting restaurant-quality marination at home without the overnight wait. Each piece of meat, chicken, or seafood is professionally butchered, then hand-coated in our proprietary spice-yogurt or dry-cure blends by our kitchen team.

    The science is simple — vacuum-sealed marination accelerates flavour penetration so that a 2-hour rest achieves what traditionally took 24 hours. The art is in the blend: every cut gets a tailored marinade designed to complement its natural fat content and texture. From tandoor-style chicken thighs to harissa lamb chops and miso-glazed sea bass, our Cured & Coated range turns your kitchen into a gourmet counter.`,
        facts: [
            { icon: <FlameKindling className="w-5 h-5" />, label: "Ready In", value: "2-hour marinade included" },
            { icon: <Fish className="w-5 h-5" />, label: "Protein", value: "Meats · Chicken · Seafood" },
            { icon: <Leaf className="w-5 h-5" />, label: "Sourcing", value: "Ethically reared, UK & EU" },
            { icon: <Star className="w-5 h-5" />, label: "Best For", value: "BBQ, grill & oven" },
        ],
        subcategories: ["Meats", "Chicken", "Sea Food"],
    },
};

// Fallback content for unknown category params
const defaultContent = {
    name: "Gourmet Collection",
    tagline: "Discover Our Curated Selection",
    heroImage:
        "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1470&q=80",
    accentColor: "amber",
    story: "Explore our carefully curated selection of premium culinary offerings, crafted with the finest ingredients for an unparalleled gourmet experience.",
    facts: [],
    subcategories: [],
};

// ── Component ─────────────────────────────────────────────────────────────────
function CategoryLanding() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toast } = useToast();

    const content = categoryContent[categoryId] ?? defaultContent;

    const { productList, productDetails } = useSelector(
        (state) => state.shopProducts
    );
    const { cartItems } = useSelector((state) => state.shopCart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const [sort, setSort] = useState("price-lowtohigh");
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    // Fetch products pre-filtered by this category
    useEffect(() => {
        dispatch(
            fetchAllFilteredProducts({
                filterParams: { category: [categoryId] },
                sortParams: sort,
            })
        );
    }, [dispatch, categoryId, sort]);

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    function handleGetProductDetails(id) {
        dispatch(fetchProductDetails(id));
    }

    function handleAddtoCart(productId, totalStock) {
        if (!isAuthenticated) {
            toast({ title: "Please sign in to add items to your cart" });
            navigate("/auth/login");
            return;
        }
        const items = cartItems.items || [];
        const existing = items.find((i) => i.productId === productId);
        if (existing && existing.quantity + 1 > totalStock) {
            toast({
                title: `Only ${existing.quantity} item(s) in stock`,
                variant: "destructive",
            });
            return;
        }
        dispatch(addToCart({ userId: user?.id, productId, quantity: 1 })).then(
            (data) => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id));
                    toast({ title: "Product added to cart" });
                }
            }
        );
    }

    // Accent colour helpers (Tailwind safelist via inline strings)
    const accentBg = {
        amber: "from-amber-900/70 to-amber-600/40",
        orange: "from-orange-900/70 to-orange-600/40",
        red: "from-red-900/70 to-red-600/40",
        rose: "from-rose-900/70 to-rose-600/40",
    }[content.accentColor] ?? "from-amber-900/70 to-amber-600/40";

    const accentText = {
        amber: "text-amber-400",
        orange: "text-orange-400",
        red: "text-red-400",
        rose: "text-rose-400",
    }[content.accentColor] ?? "text-amber-400";

    const accentBorder = {
        amber: "border-amber-500/30",
        orange: "border-orange-500/30",
        red: "border-red-500/30",
        rose: "border-rose-500/30",
    }[content.accentColor] ?? "border-amber-500/30";

    const accentDivider = {
        amber: "bg-amber-500",
        orange: "bg-orange-500",
        red: "bg-red-500",
        rose: "bg-rose-500",
    }[content.accentColor] ?? "bg-amber-500";

    return (
        <div className="min-h-screen bg-white dark:bg-background">

            {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
            <section className="relative h-[55vh] md:h-[65vh] overflow-hidden">
                <img
                    src={content.heroImage}
                    alt={content.name}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                    style={{ objectPosition: "center 40%" }}
                />
                {/* Dark + accent gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${accentBg} from-black/60`} />

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm bg-black/30 backdrop-blur-sm rounded-full px-4 py-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {/* Category title */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
                    <p className={`text-xs font-semibold tracking-[0.3em] uppercase mb-3 ${accentText}`}>
                        London Gourmet Collection
                    </p>
                    <h1 className="text-4xl md:text-6xl font-playfair font-extrabold text-white drop-shadow-xl mb-4">
                        {content.name}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 font-light max-w-lg">
                        {content.tagline}
                    </p>
                    {/* Subcategory pills */}
                    {content.subcategories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mt-5">
                            {content.subcategories.map((sub) => (
                                <span
                                    key={sub}
                                    className="text-xs bg-white/15 backdrop-blur-sm text-white border border-white/20 px-3 py-1 rounded-full"
                                >
                                    {sub}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-background to-transparent z-10" />
            </section>

            {/* ── Story Section ─────────────────────────────────────────────────────── */}
            <section className="py-16 bg-white dark:bg-background">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">

                        {/* Facts sidebar */}
                        <div className="space-y-4">
                            <p className={`text-xs font-bold tracking-widest uppercase ${accentText} mb-6`}>
                                Quick Facts
                            </p>
                            {content.facts.map((fact) => (
                                <div
                                    key={fact.label}
                                    className={`flex items-start gap-4 p-4 rounded-xl border ${accentBorder} bg-gray-50 dark:bg-card`}
                                >
                                    <span className={`${accentText} mt-0.5 flex-shrink-0`}>{fact.icon}</span>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                            {fact.label}
                                        </p>
                                        <p className="text-sm font-medium dark:text-foreground mt-0.5">
                                            {fact.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Story text */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-0.5 ${accentDivider}`} />
                                <p className={`text-sm font-semibold uppercase tracking-widest ${accentText}`}>
                                    Our Story
                                </p>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900 dark:text-primary mb-6 leading-snug">
                                Crafted with Intention, Delivered with Passion
                            </h2>
                            {content.story.split("\n\n").map((para, i) => (
                                <p
                                    key={i}
                                    className="text-gray-700 dark:text-muted-foreground leading-relaxed mb-4 text-base"
                                >
                                    {para.trim()}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Divider ───────────────────────────────────────────────────────────── */}
            <div className="container mx-auto px-4 max-w-5xl">
                <div className={`h-px ${accentDivider} opacity-20`} />
            </div>

            {/* ── Product Grid ──────────────────────────────────────────────────────── */}
            <section className="py-12 bg-white dark:bg-background">
                <div className="container mx-auto px-4">

                    {/* Header row */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-primary">
                                Shop {content.name}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                {productList?.length ?? 0} product{productList?.length !== 1 ? "s" : ""} available
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    Sort by
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                                    {sortOptions.map((opt) => (
                                        <DropdownMenuRadioItem key={opt.id} value={opt.id}>
                                            {opt.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Grid */}
                    {productList && productList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {productList.map((product) => (
                                <ShoppingProductTile
                                    key={product._id}
                                    product={product}
                                    handleGetProductDetails={handleGetProductDetails}
                                    handleAddtoCart={handleAddtoCart}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <p className="text-4xl mb-4">🍽️</p>
                            <p className="text-lg font-semibold text-muted-foreground">
                                Products coming soon
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-2 max-w-sm">
                                We're currently stocking this category. Check back soon or{" "}
                                <button
                                    onClick={() => navigate("/shop/listing")}
                                    className="underline hover:text-foreground transition-colors"
                                >
                                    browse all products
                                </button>
                                .
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />
        </div>
    );
}

export default CategoryLanding;
