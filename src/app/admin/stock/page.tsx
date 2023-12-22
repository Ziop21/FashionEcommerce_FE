"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Container from "@/app/components/Container";
import Button from "@/app/components/Button";
import { SiAddthis } from "react-icons/si";
import { FaSearch } from "react-icons/fa";
import findAllStock from "@/pages/api/admin/stock/findAll";
import Paging from "@/app/components/Paging";
import { FieldValues, SubmitHandler } from "react-hook-form";
import StockRecord from "./StockRecord";
import StockHeader from "./StockHeader";

const ManageStock = () => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");

  const fetchData = async () => {
    try {
      const response = await findAllStock({
        search: search,
        currentPage: currentPage,
        pageSize: pageSize,
        sort: sort,
      });
      setStocks(response.items);
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
  const handleAddStockClick = () => {
    router.push('/admin/stock/add');
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
            label="Add stock"
            onClick={handleAddStockClick} icon={SiAddthis} />
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

            <StockHeader />
            {stocks.map((stock: any, index: number) => (
              <StockRecord
                afterDelete={fetchData}
                key={stock.id}
                data={stock}
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
export default ManageStock;