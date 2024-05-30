'use client'
import { useEffect, useState } from "react";
import Container from "./components/container";

function Home() {
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getCasts = async () => {
      await fetchData()      
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
      setData(data)
      setLoading(false)
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  return (
    <div className="bg-white min-h-screen text-black">
      <Container loading={loading} data={data} fetchCasts={fetchData} />
    </div>
  );
}




export default Home;