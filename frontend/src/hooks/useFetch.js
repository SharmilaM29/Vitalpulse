import { useEffect, useState } from "react";

function useFetch(apiCall, deps=[]){
  const [data, setData]=useState(null);
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState(null);

  useEffect(()=>{
    let isMounted=true;
    setLoading(true);
    apiCall()
      .then((result)=>{
        if (isMounted){
          setData(result?.data!==undefined? result.data : result);
          setError(null);
        }
      })
      .catch((err)=>{ if (isMounted) setError(err);})
      .finally(()=>{if (isMounted) setLoading(false);})

    return () => {isMounted=false};
  }, deps)

  return {data, loading, error}
}

export {useFetch};
