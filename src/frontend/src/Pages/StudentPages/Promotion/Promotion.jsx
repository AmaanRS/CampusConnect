import React from "react";
import { Carousel } from "flowbite-react";
import Images from "./Images";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import PromotionSkeleton from "./PromotionSkeleton";

const fetchData = async () => {
  const response = await axiosInstance.post("/promotion/getAllPromotions", {});
  return response.data;
};

export default function Promotion() {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["allPromotions"],
    queryFn: fetchData,
  });

  if (isLoading) {
    return <PromotionSkeleton />;
  }

  return (
    <div className="mx-4">
      <hr />
      <p className="text-xs font-medium text-gray-500 mt-0.5">Promotions</p>
      <div className=" h-60 sm:h-96 ">
        <Carousel
          indicators={false}
          leftControl
          rightControl
          slideInterval={1500}
          pauseOnHover={true}
          slide={true}
        >
          {data?.data?.map((item) => (
            <div key={item?._id}>
              <Images
                img={item?.promoImage[0].imageUrl}
                url={item?.promoLink}
              />
            </div>
          ))}
        </Carousel>
      </div>
      <hr className="mt-1" />
    </div>
  );
}
