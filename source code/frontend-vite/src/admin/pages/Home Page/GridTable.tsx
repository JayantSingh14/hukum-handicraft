import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";
import HomeCategoryTable from "./HomeCategoryTable";

export default function GridTable() {
  const dispatch = useAppDispatch();
  const { homePage } = useAppSelector((store) => store);

  useEffect(() => {
    dispatch(fetchHomePageData());
  }, [dispatch]);

  return (
    <>
      <HomeCategoryTable categories={homePage.homePageData?.grid}/>
    </>
  );
}
