import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import React, { useEffect } from "react";
import { budget } from "../../../data/Filter/budget";
import { discount } from "../../../data/Filter/discount";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
//import { fetchRecipients } from "../../../Redux Toolkit/Customer/giftCatalogSlice";

const radioSx = {
  color: "rgba(200, 162, 74, 0.4)",
  "&.Mui-checked": {
    color: "#C8A24A",
  },
};

const labelSx = {
  fontFamily: "Inter, sans-serif",
  fontSize: "0.82rem",
  color: "#4A4A4A",
  "& .MuiFormControlLabel-label": {
    fontFamily: "Inter, sans-serif",
    fontSize: "0.82rem",
  }
};

const FilterSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  //const { recipients } = useAppSelector((store) => store.giftCatalog);

  // useEffect(() => {
  //   dispatch(fetchRecipients());
  // }, [dispatch]);

  const updateFilterParams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    searchParams.forEach((_value, key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
  };

  return (
    <div className="space-y-6 bg-white py-6 border border-brand-gold/15">
      <div className="flex items-center justify-between px-6">
        <p className="font-serif text-lg font-bold text-matte-black uppercase tracking-wide">Filters</p>
        <button
          onClick={clearAllFilters}
          className="font-sans text-[10px] tracking-widest uppercase text-brand-gold hover:opacity-75 font-bold transition-opacity"
        >
          Clear All
        </button>
      </div>
      <Divider sx={{ borderColor: "rgba(200,162,74,0.15)" }} />
      <div className="px-6 space-y-6">


        {/* <section>
          <FormControl>
            <FormLabel sx={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "bold", pb: "10px", color: "#C8A24A", "&.Mui-focused": { color: "#C8A24A" } }}>
              Recipient
            </FormLabel>
            <RadioGroup name="recipientId" onChange={updateFilterParams} defaultValue="">
              {recipients.map((item) => (
                <FormControlLabel
                  key={item.id}
                  value={String(item.id)}
                  control={<Radio size="small" sx={radioSx} />}
                  label={item.name}
                  sx={labelSx}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section> */}
        <Divider sx={{ borderColor: "rgba(200,162,74,0.08)" }} />

        <section>
          <FormControl>
            <FormLabel sx={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "bold", pb: "10px", color: "#C8A24A", "&.Mui-focused": { color: "#C8A24A" } }}>
              Budget
            </FormLabel>
            <RadioGroup name="price" onChange={updateFilterParams} defaultValue="">
              {budget.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" sx={radioSx} />}
                  label={item.name}
                  sx={labelSx}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
        <Divider sx={{ borderColor: "rgba(200,162,74,0.08)" }} />

        <section>
          <FormControl>
            <FormLabel sx={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "bold", pb: "10px", color: "#C8A24A", "&.Mui-focused": { color: "#C8A24A" } }}>
              Personalized
            </FormLabel>
            <RadioGroup name="personalized" onChange={updateFilterParams} defaultValue="">
              <FormControlLabel value="true" control={<Radio size="small" sx={radioSx} />} label="Personalized only" sx={labelSx} />
              <FormControlLabel value="false" control={<Radio size="small" sx={radioSx} />} label="Non-personalized" sx={labelSx} />
            </RadioGroup>
          </FormControl>
        </section>
        <Divider sx={{ borderColor: "rgba(200,162,74,0.08)" }} />

        <section>
          <FormControl>
            <FormLabel sx={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: "bold", pb: "10px", color: "#C8A24A", "&.Mui-focused": { color: "#C8A24A" } }}>
              Discount
            </FormLabel>
            <RadioGroup name="discount" onChange={updateFilterParams} defaultValue="">
              {discount.map((item) => (
                <FormControlLabel
                  key={item.name}
                  value={item.value}
                  control={<Radio size="small" sx={radioSx} />}
                  label={item.name}
                  sx={labelSx}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </section>
      </div>
    </div>
  );
};

export default FilterSection;
