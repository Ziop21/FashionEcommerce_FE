"use client"
import { FC, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import CustomCheckBox from "@/app/components/inputs/CustomCheckBox";

import { StockDiary } from "@/pages/api/admin/stock/diary/Models";
import update from "@/pages/api/admin/stock/diary/update";
import { ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";
import TextArea from "@/app/components/inputs/TextArea";
import ImagesContainer from "@/app/components/inputs/ImagesContainer";
import DropdownInput from "@/app/components/inputs/DropdownInput";
import Paging from "@/app/components/Paging";
import { Stock } from "@/pages/api/admin/stock/Models";
import findAll from "@/pages/api/admin/stock/findAll";

interface ViewFormProps {
  foundStockDiary: StockDiary;
  allStocks: Stock[];
}

interface FormData {
  id: string,
  stockId: string,
  quantity: number,
  errorQuantity: number,
  note?: string | null,
  isActive: boolean,
  isDeleted: boolean
}
const schema: ZodType<FormData> = z.object({
  id: z.string().min(1),
  stockId: z.string().min(1),
  quantity: z.number().int().min(1),
  errorQuantity: z.number().int().min(0),
  note: z.string().nullable(),
  isDeleted: z.boolean(),
  isActive: z.boolean(),
});

const ViewForm: FC<ViewFormProps> = ({
  foundStockDiary,
  allStocks,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([])
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  const fetchData = async () => {
    try {
      if (!isEdit) 
        return;
      setIsEdit(false);
      const response = await findAll({
        search: search,
        currentPage: currentPage,
        pageSize: pageSize,
        sort: sort,
      });
      setStocks(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setIsEdit(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, currentPage, pageSize, sort]);

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

  useEffect(() => {
    setStocks(allStocks);
  }, [allStocks]);

  const { register, handleSubmit, formState: { errors }, control, getValues, setValue, reset } =
    useForm<FieldValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        id: '',
        stockId: '',
        quantity: 1,
        errorQuantity: 0,
        note: null,
        isActive: false,
        isDeleted: true
      }
    })

  useEffect(() => {
    if (foundStockDiary) {
      setValue('id', foundStockDiary.id)
      setValue('stockId', foundStockDiary.stockId)
      setValue('quantity', foundStockDiary.quantity)
      setValue('errorQuantity', foundStockDiary.errorQuantity)
      setValue('note', foundStockDiary.note)
      setValue('isDeleted', foundStockDiary.isDeleted)
      setValue('isActive', foundStockDiary.isActive)
    }
  }, [foundStockDiary]);

  const onEdit: SubmitHandler<FieldValues> = async () => {
    setIsEdit(!isEdit);
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (isEdit) {
      try {
        setIsEdit(false);
        toast.loading('Please wait...', {duration: 1000});
        const stockDiaryData: StockDiary = {
          id: data.id,
          stockId: data.stockId,
          quantity: data.quantity,
          errorQuantity: data.errorQuantity,
          note: data.note,
          isActive: data.isActive,
          isDeleted: data.isDeleted,
        };
        await update(stockDiaryData.id, stockDiaryData);
        toast.success('Update successfully')
      } catch (error) {
        toast.error("Error!!!");
        console.log("Error when update: ", error);
        setIsEdit(true);
      }
    }
  };

  return (
    <>
      <Heading title="StockDiary" />
      <hr className="bg-slate-300 w-full h-px" />
      <DropdownInput
        id="stockId"
        label="stock"
        disabled={!isEdit}
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
        preValue={getValues('stockId')}
      />
      <Paging
        disabled={!isEdit}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleCurrentPageChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <Input
        id="quantity"
        label="quantity"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <Input
        id="errorQuantity"
        label="error quantity"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
        type={"number"}
      />
      <TextArea
        id="note"
        label="note"
        disabled={!isEdit}
        register={register}
        errors={errors}
        required
      />
      <CustomCheckBox
        id="isActive"
        label="is active"
        disabled={!isEdit}
        register={register}
      />
      <CustomCheckBox
        id="isDeleted"
        label="is deleted"
        disabled={!isEdit}
        register={register}
      />

      <div className="flex gap-4">
        <Button
          outline={true}
          label={isEdit ? "Cancel" : "Edit"}
          custom={isEdit ? "bg-red-300" : "bg-yellow-300"}
          onClick={onEdit}
        />
        <Button
          label="Save"
          outline={true}
          disabled={!isEdit}
          custom="bg-green-300"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </>
  );
};

export default ViewForm; 