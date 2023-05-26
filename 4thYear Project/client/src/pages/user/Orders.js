import React, { useState, useEffect, useCallback } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const Orders = () => {
 
  
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadReceipt=(i)=>{
    //console.log(i)
    const elm=document.querySelector('#specific-'+ i);
    html2canvas(elm).then((elm)=>{
      const imgData=elm.toDataURL('img/png');
      const doc=new jsPDF('p','mm','a4');
      const componentWidth="205"
      const componentHeight="220"
      doc.addImage(imgData,'PNG',0,0,componentWidth,componentHeight);
      doc.save('Receipt.pdf');
    });

  }
  
  useEffect(() => {
    
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => {
              return (
                <>
                 <button key={i+"0"} style={{ float:'right',marginTop:'5px',backgroundColor:'#fff',marginRight:'5px',border:'none'}} onClick={downloadReceipt.bind(null,i)}><img src="https://cdn-icons-png.flaticon.com/128/9546/9546403.png" height={30} width={30} /></button>
                  
                <div key={i+"1"} className="border shadow" id={"specific-"+i} style={{ marginBottom:'10px'}}>
                 <table className="table table-striped table-dark">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col"> date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Success"}</td>
                        <td>{o?.products?.length}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {o?.products?.map((p, i) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id}>
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${p._id}`}
                            className="card-img-top"
                            alt={p.name}
                            width="100px"
                            height={"100px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price : ₹{p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
