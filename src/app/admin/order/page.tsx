"use client"

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Container from "@/app/components/Container";
import OrderRecord from "./OrderRecord";
import OrderHeader from "./OrderHeader";
import Button from "@/app/components/Button";
import { SiAddthis } from "react-icons/si";
import { FaSearch } from "react-icons/fa";
import callApiRoute from "@/pages/api/admin/order/findAll";
import Paging from "@/app/components/Paging";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import StatusFilter from "./StatusFilter";
import { EOrderStatus } from "@/pages/api/admin/order/Models";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("");
  const [statuses, setStatuses] = useState<EOrderStatus[]>([]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, sort, statuses]);

  const fetchData = async () => {
    try {
      const response = await callApiRoute({
        search: search,
        statuses: statuses.join(','),
        currentPage: currentPage,
        pageSize: pageSize,
        sort: 'createdAt_DESC',
      });
      setOrders(response.items);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
  const handleAddOrderClick = () => {
    router.push('/admin/order/add');
  };

  const handFindButtonClick: SubmitHandler<FieldValues> = () => {
    fetchData();
  };

  const handleStatusesChange = (statuses: EOrderStatus[]) => {
    // console.log('statuses', statuses)
    setStatuses(statuses);
  };

  return (
    <div className="p-8">
      <Container>
        <div>
          <Button
            outline={true}
            custom="bg-green-300"
            label="Add Order"
            onClick={handleAddOrderClick} icon={SiAddthis} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              placeholder="search something"
              className={'peer w-full p-4 pt-6 outline-none bg-white font-light border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed border-slate-900'}
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <Button label="Find" onClick={handFindButtonClick} icon={FaSearch} />
            </div>
          </div>
          <div>
            <StatusFilter
              onChange={handleStatusesChange}
            />
            <OrderHeader />
            {orders.map((order: any, index: number) => (
              <OrderRecord
                afterDelete={fetchData}
                key={order.id}
                data={order}
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
export default ManageOrders;