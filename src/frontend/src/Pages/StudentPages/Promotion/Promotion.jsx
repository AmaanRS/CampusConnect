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

  console.log(data?.data);

  return (
    <div className="mx-4">
      <hr />
      <p className="text-xs font-medium text-gray-500 mt-0.5">Promotions</p>
      <div className=" h-96 ">
        <Carousel
          indicators={false}
          leftControl
          rightControl
          slideInterval={1000}
          pauseOnHover={true}
          slide={true}
        >
          {data?.data?.map((item) => (
            <div key={item?._id}>
              <Images img={item?.promoImage[0].imageUrl} />
            </div>
          ))}
          {/* <Images
            img={
              "https://i.pinimg.com/736x/a2/86/f6/a286f6349f4d14ea7ff77eb4bb11ebbb.jpg"
            }
          />
          <Images
            img={
              "https://img.freepik.com/premium-psd/digital-marketing-agency-social-media-post-marketing-agency-promotion-post-business-post_589696-654.jpg"
            }
          />
          <Images
            img={
              "https://img.freepik.com/free-vector/new-temlate-instagram-post-business-marketing_125964-976.jpg"
            }
          />
          <Images
            img={
              "https://img.pikbest.com/origin/06/27/02/89upIkbEsThif.jpg!w700wp"
            }
          /> */}
        </Carousel>
      </div>
      <hr className="mt-1" />
    </div>
  );
}
