"use client"

import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";
import { ZodNaN, ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import addStockDiary from "@/pages/api/admin/stock/diary/add";
import toast from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import { v4 } from "uuid";
import { StockDiary } from "@/pages/api/admin/stock/diary/Models";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import { Stock } from "@/pages/api/admin/stock/Models";
import findProductById from "@/pages/api/admin/product/findById";
import findSizeById from "@/pages/api/admin/size/findById";
import findColorById from "@/pages/api/admin/color/findById";
import DropdownInput from "@/app/components/inputs/DropdownInput";
import Paging from "@/app/components/Paging";
import findAll from "@/pages/api/admin/stock/findAll";

interface AddFormProps {
  allStocks: Stock[],
}

interface FormData {
  stockId: string,
  quantity: number,
  errorQuantity: number,
  note?: string | null,
  isActive: boolean,
  isDeleted: boolean
}
const schema: ZodType<FormData> = z.object({
  stockId: z.string().min(1),
  quantity: z.number().int().min(1),
  errorQuantity: z.number().int().min(0),
  note: z.string().nullable(),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const AddForm: React.FC<AddFormProps> = ({
  allStocks
}) => {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  useEffect(() => {
    setStocks(allStocks);
  }, [allStocks]);

  const handleCurrentPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const fetchData = async () => {
    try {
      if (isLoading) 
        return;
      setIsLoading(true);
      // console.log(isLoading)
      const response = await findAll({
        search: search,
        currentPage: currentPage,
        pageSize: pageSize,
        sort: sort,
      });
      // console.log(response);
      setStocks(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, currentPage, pageSize, sort]);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        stockId: '',
        quantity: 1,
        errorQuantity: 0,
        note: null,
        isActive: false,
        isDeleted: true
      }
    })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // console.log(data)
    setIsLoading(true);
    try {
      const stockDiaryData: StockDiary = {
        stockId: data.stockId,
        quantity: data.quantity,
        errorQuantity: data.errorQuantity,
        note: data.note,
        isDeleted: data.isDeleted,
        isActive: data.isActive,
      };
      await addStockDiary(stockDiaryData);
      toast.success('Create stock diary success...');
    } catch (error) {
      toast.error("Error!!!");
      console.error("Error when call API", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading title="New Stock Diary" />
      <hr className="bg-slate-300 w-full h-px" />
      <DropdownInput
        id="stockId"
        label="stock"
        disabled={isLoading}
        register={register}
        errors={errors}
        options={
          stocks ?
            stocks.map((item: Stock) => ({
              value: item.id,
              label: `Product: ${item.productName}, Size: ${item.sizeName}, Color: ${item.colorName}`
              ,
            })) : []
        }
        getSearchValue={handleSearchChange}
      />
      <Paging
        disabled={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleCurrentPageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <Input
        id="quantity"
        label="quantity"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <Input
        id="errorQuantity"
        label="error quantity"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <TextArea
        id="note"
        label="note"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckBox
        id="isActive"
        label="is active"
        disabled={isLoading}
        register={register}
      />
      <CustomCheckBox
        id="isDeleted"
        label="is deleted"
        disabled={isLoading}
        register={register}
      />
      <Button
        outline={true}
        custom="bg-green-300"
        label={isLoading ? "Loading" : "Add"}
        onClick={handleSubmit(onSubmit)} />
    </>
  );
}

export default AddForm;
