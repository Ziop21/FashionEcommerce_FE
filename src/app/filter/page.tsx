'use client'

import { useEffect, useState } from "react";
import Container from "../components/Container";
import FormWrap from "../components/FormWrap";
import { ZodType, z } from "zod";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import getAllProduct from "@/pages/api/guest/products/findAll";
import { Product, ProductId } from "@/pages/api/guest/products/Models";
import ProductCard from "../components/products/ProductCard";
import Button from "../components/Button";
import Input from "../components/inputs/Input";
import { Category } from "@/pages/api/guest/category/Models";
import React from "react";
import findAllCategoryByProductId from "@/pages/api/guest/category/product/findAllByProductId";
import findCategoryById from "@/pages/api/guest/category/findById";
import findSizeById from "@/pages/api/guest/size/findById";
import findColorById from "@/pages/api/guest/color/findById";
import { Color } from "@/pages/api/guest/color/Models";
import { Size } from "@/pages/api/guest/size/Models";
import { Stock } from "@/pages/api/guest/stock/Models";
import findAllByProductId from "@/pages/api/guest/stock/findAllByProductId";
import CategoryFilter from "./CategoryFilter";
import ColorFilter from "./ColorFilter";
import SizeFilter from "./SizeFilter";
import findAllProductIds from "@/pages/api/guest/products/findAllProductIds";
import RatingRange from "./RatingRange";
import PriceRange from "./PriceRange";
import Paging from "../components/Paging";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import ItemContent from "../cart/ItemContent";

interface FilterParams {
  search: string
}

interface FormData {
  search?: string,
  categoryIds?: string[],
  sizeIds?: string[],
  colorIds?: string[],
  fromRating?: number,
  toRating?: number,
  fromPrice?: number,
  toPrice?: number,
  sort?: string
  currentPage?: number,
  pageSize?: number
}

const schema: ZodType<FormData> = z.object({
  search: z.string(),
  categoryIds: z.array(z.string()),
  sizeIds: z.array(z.string()),
  colorIds: z.array(z.string()),
  fromRating: z.number().min(0),
  toRating: z.number().min(0),
  fromPrice: z.number().min(0),
  toPrice: z.number().min(0),
  sort: z.string().optional(),
  currentPage: z.number().min(0).optional(),
  pageSize: z.number().min(0).optional()
});

const Search = ({ searchParams }: { searchParams: FilterParams }) => {
  const [products, setProducts] = useState<Product[] | []>([]);
  const [productIds, setProductIds] = useState<ProductId[] | []>([]);

  const [prevSearchTerm, setPrevSearchTerm] = useState('');
  const [sort, setSort] = useState<string>('');

  const [categories, setCategories] = useState<Category[] | []>([]);
  const [colors, setColors] = useState<Color[] | []>([]);
  const [sizes, setSizes] = useState<Size[] | []>([]);

  const [reloadFilter, setReloadFilter] = useState<Boolean>(false);


  const [totalPages, setTotalPages] = useState(1);

  const SortItem = [
    {
      key: "name_ASC",
      label: "Name A-Z",
    },
    {
      key: "name_DESC",
      label: "Name Z-A",
    },
    {
      key: "price_ASC",
      label: "Price: Low to High ",
    },
    {
      key: "price_DESC",
      label: "Price: High to Low",
    },
    {
      key: "createdAt_DESC",
      label: "Newest Arrivals",
    },
    // {
    //   key: "sold_DESC",
    //   label: "Best sellers",
    // }
  ];

  const { register, handleSubmit, formState: { errors }, getValues, setValue } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        search: "",
        fromRating: 0,
        toRating: 5,
        fromPrice: 0,
        toPrice: 5000000,
        sort: 'name_ASC',
        currentPage: 1,
        pageSize: 18
      }
    })

  const findAllProduct = async (params: any) => {
    try {
      const response = await getAllProduct(params);
      setProducts(response.items);
      setTotalPages(response.totalPages);
      setValue('currentPage', response.currentPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllProductIds = async (params: FormData) => {
    try {
      const response = await findAllProductIds(params);
      setProductIds(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const setProductsAndFilters = async () => {
      setValue('search', searchParams.search);
      await findAllProduct({
        search: getValues('search'),
        sort: getValues('sort'),
        pageSize: getValues('pageSize')
      });
      await getAllProductIds({
        search: getValues('search'),
        sort: getValues('sort'),
        pageSize: getValues('pageSize')
      });
      setPrevSearchTerm(searchParams.search);
      setReloadFilter(!reloadFilter);
    }
    setProductsAndFilters();
    setSort(getValues('sort'));
  }, [searchParams.search]);

  useEffect(() => {
    const reloadCategories = async () => {
      const categoryProductsFetched: CategoryProduct[] = await Promise.all(
        productIds.map(async (productId) => {
          const response = await findAllCategoryByProductId({
            productId: productId.id,
            requestParam: {}
          });
          return response.items;
        })
      ).then((arrays) => [].concat(...arrays));

      const uniqueCategoryIds = Array.from(new Set(categoryProductsFetched.map((item) => item.categoryId)));

      const categoriesFetched: Category[] = await Promise.all(
        uniqueCategoryIds.map(async (categoryId) => {
          const response = await findCategoryById(categoryId);
          return response;
        })
      );
      setCategories(categoriesFetched)
    }
    const reloadColorsAndSizes = async () => {
      const stocksFetched: Stock[] = await Promise.all(
        productIds.map(async (productId) => {
          const response = await findAllByProductId({
            productId: productId.id,
            requestParam: {}
          });
          return response.items;
        })
      ).then((arrays) => [].concat(...arrays));
      const uniqueSizeIds = Array.from(new Set(stocksFetched.map((item) => item.sizeId)));
      const sizesFetched: Size[] = await Promise.all(
        uniqueSizeIds.map(async (sizeId) => {
          const response = await findSizeById(sizeId);
          return response;
        })
      );
      setSizes(sizesFetched)

      const uniqueColorIds = Array.from(new Set(stocksFetched.map((item) => item.colorId)));
      const colorsFetched: Color[] = await Promise.all(
        uniqueColorIds.map(async (colorId) => {
          const response = await findColorById(colorId);
          return response;
        })
      );
      setColors(colorsFetched);
    }

    const reloadFilter = async () => {
      reloadCategories();
      reloadColorsAndSizes();
    }

    reloadFilter()
  }, [reloadFilter])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await findAllProduct({
      search: data.search,
      categoryIds: data.categoryIds.join(","),
      sizeIds: data.sizeIds.join(","),
      colorIds: data.colorIds.join(","),
      fromRating: data.fromRating,
      toRating: data.toRating,
      fromPrice: data.fromPrice,
      toPrice: data.toPrice,
      sort: data.sort,
      currentPage: data.currentPage,
      pageSize: data.pageSize,
    });
    if (prevSearchTerm !== data.search) {
      setReloadFilter(!reloadFilter);
    }
    setPrevSearchTerm(data.search);
  }

  const handleCurrentPageChange = async (page: number) => {
    setValue('currentPage', page);
    await onSubmit({ ...getValues() });
  };

  const handlePageSizeChange = async (size: number) => {
    setValue('pageSize', size);
    await onSubmit({ ...getValues() });
  };

  return (
    <Container>
      <div className={"text-center mt-20"}>
        <h1 className="font-bold text-5xl">PRODUCTS FILTER</h1>
      </div>
      <div className="flex justify-start ml-10">
        <FormWrap>
          <Button
            label="Submit"
            outline={true}
            custom="bg-green-400 h-8"
            onClick={handleSubmit(onSubmit)}
          />
          <Input
            id="search"
            type="text"
            label="Search"
            register={register}
            errors={errors}
          />
          <CategoryFilter
            categories={categories}
            setValue={setValue}
          />
          <ColorFilter
            colors={colors}
            setValue={setValue}
          />
          <SizeFilter
            sizes={sizes}
            setValue={setValue}
          />
          <RatingRange
            setValue={setValue}
          />
          <PriceRange
            setValue={setValue}
          />
        </FormWrap>
        <div className="w-full h-full mt-24">
          <div className="h-full ml-10 mb-4">
            <Dropdown>
              <DropdownTrigger>
                <span className="border-2 pl-2 pr-2">Sort by: {SortItem.find((item) => item.key === sort)?.label}</span>
              </DropdownTrigger>
              <DropdownMenu aria-label="Dynamic Actions"
                items={SortItem}
                onAction={async (key) => {
                  setSort(key);
                  setValue('sort', key)
                  await onSubmit({ ...getValues() });
                }}>
                {(item) => (
                  <DropdownItem
                    key={item.key}
                  >
                    {item.label}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="w-full h-full ml-10 mr-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {products.map((product: any) => {
              return <ProductCard data={product} />;
            })}
          </div>
        </div>
      </div>
      <div className="ml-10 mt-5">
        <Paging
          pageSize={getValues('pageSize')}
          currentPage={getValues('currentPage')}
          totalPages={totalPages}
          onPageChange={handleCurrentPageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </Container>
  );
}

export default Search;
