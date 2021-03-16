import React,{useState} from "react";
import { useMount } from 'react-use';
import { getDealerDetails } from "../../../services/dealers.service";


const UserDueTable = () => {
  const [dealerDetail, setDealerDetail] = useState({});
  useMount(() => {
      getDealerDetails()
      .then((data) => {
        setDealerDetail(data);
      })

      .catch((e) => {
        console.log(e);
      });
  });
    return (
        <>
        <h1> USER DUE TABLE IMPORTED</h1>
        </>

    )
}
export default UserDueTable;