import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { mainCategory } from '../../../data/category/mainCategory'
import CategorySheet from './CategorySheet';

const DrawerList = ({toggleDrawer}:any) => {
    const [selectedCategory,setSelectedCategory]=useState("");
    const navigate = useNavigate();

  return (
    <Box sx={{ width: 250 }} role="presentation" 
    // onClick={toggleDrawer(false)}
    >
    <List>

      <ListItem>
        <ListItemButton onClick={() => {
          navigate("/");
          if (toggleDrawer) toggleDrawer(false)();
        }}>
          <div className="flex flex-col items-start justify-center">
            <h1 className="font-serif tracking-[0.2em] text-xl font-bold text-matte-black">
              HUKUM
            </h1>
            <span className="text-[6px] tracking-[0.4em] font-sans font-bold text-brand-gold -mt-1 uppercase">
              Artisanal Luxury
            </span>
          </div>
        </ListItemButton>
      </ListItem>
      <Divider />
     
      {mainCategory.map((item) => <ListItem key={item.name} disablePadding>
        <ListItemButton onClick={()=>setSelectedCategory(item.categoryId)}>
          <ListItemText primary={item.name} />
        </ListItemButton>
      </ListItem>
      )}


    </List>

    {selectedCategory && <div
        // onMouseLeave={() => setShowSheet(false)}
        // onMouseEnter={() => setShowSheet(true)} 
        className='categorySheet absolute top-[4.41rem] left-0 right-0 h-[400px]'>
        <CategorySheet toggleDrawer={toggleDrawer} selectedCategory={selectedCategory}/>
      </div>}

  </Box>
  )
}

export default DrawerList