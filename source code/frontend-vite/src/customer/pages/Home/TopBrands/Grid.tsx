import { useAppSelector } from "../../../../Redux Toolkit/Store";

const TopBrand = () => {
  const { homePage } = useAppSelector(store => store);
  const grid = homePage.homePageData?.grid ?? [];

  // Need all 6 grid items to render the lookbook layout
  if (grid.length < 6) return null;

  return (
    <div className="grid gap-4 grid-rows-12 grid-cols-12 lg:h-[600px] px-5 lg:px-20">
      <div className=" col-span-3 row-span-12  text-white  rounded ">
        <img
          className="w-full h-full object-cover border-fuchsia-800 lg:border-[9px]s rounded-md"
          src={grid[0]?.image}
          alt={grid[0]?.name}
        />
      </div>

      <div className="col-span-2 row-span-6  text-white rounded">
        <img
          className="w-full h-full object-cover border-fuchsia-800 lg:border-[9px]s rounded-md"
          src={grid[1]?.image}
          alt={grid[1]?.name}
        />
      </div>

      <div className="col-span-4 row-span-6  text-white  rounded ">
        <img
          className="w-full h-full object-cover object-top border-fuchsia-800 lg:border-[9px]s rounded-md"
          src={grid[2]?.image}
          alt={grid[2]?.name}
        />
      </div>

      <div className="col-span-3 row-span-12  text-white  rounded ">
        <img
          className="w-full h-full object-cover object-top border-fuchsia-800 lg:border-[9px]s rounded-md"
          src={grid[3]?.image}
          alt={grid[3]?.name}
        />
      </div>

      <div className="col-span-4 row-span-6  text-white  rounded ">
        <img
          className="w-full h-full object-cover object-top border-fuchsia-800 lg:border-[9px]s rounded-md"
          src={grid[4]?.image}
          alt={grid[4]?.name}
        />
      </div>
      <div className="col-span-2 row-span-6  text-white rounded ">
        <img
          className="w-full h-full object-cover border-fuchsia-800 lg:border-[9px]s rounded-md"
          src={grid[5]?.image}
          alt={grid[5]?.name}
        />
      </div>
    </div>
  );
};

export default TopBrand;

