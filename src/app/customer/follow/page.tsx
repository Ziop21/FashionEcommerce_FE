"use client"

import Container from "@/app/components/Container";
import FollowRecord from "./FollowRecord";
import Button from "@/app/components/Button";
import { FaSearch } from "react-icons/fa";
import callApiRoute from "@/pages/api/customer/follow/findAll";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Follow } from "@/pages/api/customer/follow/Models";
import { useEffect, useState } from "react";
import Heading from "@/app/components/Heading";

const ManageFollows = () => {
  const [follows, setFollows] = useState<Follow[]>();
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const response = await callApiRoute({
        search: search,
      });
      // console.log(response);
      setFollows(response)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  const handFindButtonClick: SubmitHandler<FieldValues> = () => {
    fetchData();
  };

  return (
    <div className="p-8">
      <Heading title="FOLLOWED PRODUCTS" center />
      <Container>
        <div className="mt-6">
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
            <div className="flex flex-wrap mt-2">
              {follows && follows[0] ? follows.map((follow: any, index: number) => (
                <FollowRecord
                  key={follow.id}
                  data={follow}
                  afterDelete={fetchData}
                />
              ))
                :
                <div className="flex mt-4 items-center justify-center">
                  <span className="text-bold text-2xl">You have not followed any product</span>
                </div>
              }
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
};
export default ManageFollows;