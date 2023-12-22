"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import { SiAddthis } from "react-icons/si";
import { FaSearch } from "react-icons/fa";
import findAllStockDiary from "@/pages/api/admin/stock/diary/findAll";
import Paging from "@/app/components/Paging";
import { FieldValues, SubmitHandler } from "react-hook-form";
import StockDiaryRecord from "./StockDiaryRecord";
import StockDiaryHeader from "./StockDiaryHeader";

const ManageStockDiary = () => {
  const [stockDiaries, setStockDiaries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  const fetchData = async () => {
    try {
      const response = await findAllStockDiary({
        search: search,
        currentPage: currentPage,
        pageSize: pageSize,
        sort: sort,
      });
      console.log('response.items', response.items);
      setStockDiaries(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sort]);

  const handleCurrentPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
  };

  const router = useRouter();
  const handleAddStockDiaryClick = () => {
    router.push('/admin/stock-diary/add');
  };

  const handFindButtonClick: SubmitHandler<FieldValues> = () => {
    fetchData();
  };

  return (
    <div className="p-8">
      <Container>
        <div>
          <Button
            outline={true}
            custom="bg-green-300"
            label="Add stock diary"
            onClick={handleAddStockDiaryClick} icon={SiAddthis} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              placeholder="Search something..."
              className={'peer w-full p-4 pt-6 outline-none bg-white font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed border-slate-900'}
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <Button label="Find" onClick={handFindButtonClick} icon={FaSearch} />
            </div>
          </div>
          <div>

            <StockDiaryHeader />
            {stockDiaries.map((stockDiary: any, index: number) => (
              <StockDiaryRecord
                afterDelete={fetchData}
                key={stockDiary.id}
                data={stockDiary}
                index={index + 1} />
            ))}
            <Paging
              pageSize={pageSize}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleCurrentPageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default ManageStockDiary;