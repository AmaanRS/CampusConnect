import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import PromotionSkeleton from "../Promotion/PromotionSkeleton";
import Images from "../Promotion/Images";
import { Link, useParams } from "react-router-dom";
import DeletePromotion from "./DeletePromotion";

const fetchData = async () => {
  const response = await axiosInstance.post("/promotion/getAllPromotions", {});
  return response.data;
};

export default function ViewPromotion() {
  const { committeeId } = useParams();
  const [promArr, setPromArr] = useState([]);
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allPromotions"],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (data?.data?.length > 0) {
      const arr = data?.data;
      const temp = arr.filter(
        (item) => item.promotedBy[0].committeeId === committeeId
      );
      setPromArr(temp, committeeId);
    }
  }, [data]);

  if (isLoading) {
    return <PromotionSkeleton />;
  }
  return (
    <div className="grid px-2 md:px-0 sm:grid-cols-2  gap-4">
      {promArr.map((item) => (
        <div key={item?._id}>
          <Link target="_blank" to={item?.promoLink}>
            <div
              style={{
                backgroundImage: `url(${item?.promoImage[0].imageUrl})`,
              }}
              className="border mb-0 w-full my-1  bg-cover bg-center overflow-hidden  rounded-b-none"
            >
              <img
                className=" backdrop-blur-3xl   object-contain rounded-b-none  w-full h-60 "
                src={item?.promoImage[0].imageUrl}
                alt="image"
              />
            </div>
          </Link>
          <DeletePromotion promoId={item?.promoId} />
        </div>
      ))}
    </div>
  );
}
