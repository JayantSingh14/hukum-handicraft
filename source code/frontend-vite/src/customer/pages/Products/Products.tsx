/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard";
import FilterSection from "./FilterSection";
import {
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  useMediaQuery,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { getAllProducts } from "../../../Redux Toolkit/Customer/ProductSlice";
import { formatGiftCategoryLabel, mapCategoryIdToGiftCategory } from "../../../util/giftCategoryMapper";

const Products = () => {
  const [sort, setSort] = useState("");
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const [showFilter, setShowFilter] = useState(false);
  const { categoryId } = useParams();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((store) => store);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const handleSortProduct = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };

  const handleShowFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handlePageChange = (_event: any, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const occasionId = searchParams.get("occasionId");
    const personalizedParam = searchParams.get("personalized");

    const newFilters = {
      giftCategory: mapCategoryIdToGiftCategory(categoryId),
      occasionId: occasionId ? Number(occasionId) : undefined,
      personalized:
        personalizedParam === "true"
          ? true
          : personalizedParam === "false"
            ? false
            : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      pageNumber: page - 1,
      minDiscount: searchParams.get("discount")
        ? Number(searchParams.get("discount"))
        : undefined,
      sort,
    };

    dispatch(getAllProducts(newFilters));
  }, [searchParams, categoryId, sort, page, dispatch]);

  return (
    <div className="-z-10 mt-10">
      <div>
        <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase">
          {formatGiftCategoryLabel(categoryId)} Gifts
        </h1>
      </div>
      <div className="lg:flex">
        <div className={`${showFilter ? "block" : "hidden"} lg:block`}>
          <FilterSection />
        </div>
        <section className="flex-1">
          <div className="flex items-center justify-between px-9 py-5">
            <div className="flex items-center gap-3">
              {!isLarge && (
                <IconButton onClick={handleShowFilter}>
                  <FilterAltIcon />
                </IconButton>
              )}
              <p className="text-gray-600">{products.products.length} gifts</p>
            </div>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort</InputLabel>
              <Select value={sort} label="Sort" onChange={handleSortProduct}>
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Divider />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 px-9 py-5">
            {products.products.map((item: any) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
          <div className="flex justify-center py-10">
            <Pagination
              count={products.totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;
