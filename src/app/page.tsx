'use client'
import { useEffect, useState } from "react";
import Container from "./components/container";

function Home() {
  const [data, setData] = useState<any>([])
  useEffect(() => {
    const getCasts = async () => {
      const res = await fetchData()
      setData(res)
    }
    getCasts()
  }, []);
 
  async function fetchData() {
    try {
      const res = await fetch(
        `/api/casts`      
      );
  
      const data = await res.json();
      // console.log(data)
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  return (
    <div className="bg-white min-h-screen text-black">
      <Container data={data} fetchCasts={fetchData} />
    </div>
  );
}




export default Home;