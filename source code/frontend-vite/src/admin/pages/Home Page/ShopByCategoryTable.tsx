import { useEffect } from 'react';
import HomeCategoryTable from './HomeCategoryTable'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchHomePageData } from '../../../Redux Toolkit/Customer/Customer/AsyncThunk';

const ShopByCategoryTable = () => {
    const dispatch = useAppDispatch();
    const { homePage } = useAppSelector((store) => store);

    useEffect(() => {
        dispatch(fetchHomePageData());
    }, [dispatch]);

  return (
    <HomeCategoryTable categories={homePage.homePageData?.shopByCategories}/>
  )
}

export default ShopByCategoryTable