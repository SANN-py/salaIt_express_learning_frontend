import { useState } from "react";
import ProductCard from "./components/ProductCard";
import ViewCard from "./components/ViewCard";
import { Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

import Navbar from "./scense/global/Navbar";
import Location from "./scense/location/Location";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Product from "./scense/products/Product";
import User from "./scense/user/User";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Category from "./scense/categories/Category";
import { Toaster } from "./components/ui/sonner";
import Login from "./scense/login/Login";
import POS from "./scense/pointOfSale/POS";

function App() {
  const data = [
    {
      id: 1,
      name: "t-shirt",
      price: 23,
      description: "something need to be here",
      image:
        "https://i.pinimg.com/1200x/c9/65/e8/c965e850870436bd7da55513a9e1a3a8.jpg",
    },
    {
      id: 2,
      name: "cow boy",
      price: 23,
      description: "something need to be here",
      image:
        "https://i.pinimg.com/1200x/c9/65/e8/c965e850870436bd7da55513a9e1a3a8.jpg",
    },
    {
      id: 2,
      name: "cow boy",
      price: 23,
      description: "something need to be here",
      image:
        "https://i.pinimg.com/1200x/c9/65/e8/c965e850870436bd7da55513a9e1a3a8.jpg",
    },
    {
      id: 2,
      name: "cow boy",
      price: 23,
      description: "something need to be here",
      image:
        "https://i.pinimg.com/1200x/c9/65/e8/c965e850870436bd7da55513a9e1a3a8.jpg",
    },
    {
      id: 2,
      name: "cow boy",
      price: 23,
      description: "something need to be here",
      image:
        "https://i.pinimg.com/1200x/c9/65/e8/c965e850870436bd7da55513a9e1a3a8.jpg",
    },
  ];
  const viewData = [
    {
      id: 1,
      name: "pig",
      des: "Hello my name is pig",
      pric: 2,
      image:
        "https://images.unsplash.com/photo-1761839257874-e56dfa2260cb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  const [count, setCount] = useState(0);
  const handleIncrease = () => {
    setCount(count + 1);
  };
  const handleDecrease = () => {
    setCount(count - 1);
  };
  const evenNumber = [2, 4, 6];
  const oddNumber = [1, 3, 5];
  const numbers = [...evenNumber, ...oddNumber];
  const users = { firstName: "kimsann", lastName: "mao" };
  const updateUsers = {
    ...users,
    lastName: "updated last name",
  };
  console.log(numbers);
  console.log(updateUsers);
  return (
    <>
      {/* <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 w-full">
        {data.map((p) => (
          <ProductCard
            key={p.id}
            name={p.name}
            description={p.description}
            price={p.price}
            image={p.image}
          />
        ))}
      </div>
      <div className="mt-5">
        {viewData.map((d, index) => (
          <ViewCard
            key={index}
            name={d.name}
            image={d.image}
            price={d.pric}
            des={d.des}
          />
        ))}
      </div>
      <div className="w-full bg-gray-500 flex gap-5 p-6 items-center">
        <button
          className="border px-5 py-2 rounded-sm bg-white text-2xl cursor-pointer "
          onClick={() => handleIncrease()}
        >
          +
        </button>
        <p className="text-2xl text-white">{count}</p>
        <button
          className="border px-5 py-2 rounded-sm bg-white text-2xl  cursor-pointer"
          onClick={() => handleDecrease()}
        >
          -
        </button>
      </div> */}
      <QueryClientProvider client={queryClient}>
        {/* <Navbar /> */}
        <Routes>
          <Route element={<MainLayout />}>// inside call Outlet</Route>
          <Route path="/admin/login" element={<Login />} />
          <Route element={<DashboardLayout />} path="/">
            <Route path="/admin/products" element={<Product />} />
            <Route path="/admin/users" element={<User />} />
            <Route path="/admin/categories" element={<Category />} />
            <Route path="/admin/pos" element={<POS />} />
          </Route>

          <Route path="/location" element={<Location />} />
        </Routes>
        <Toaster position="top-center" />
      </QueryClientProvider>
    </>
  );
}

export default App;
