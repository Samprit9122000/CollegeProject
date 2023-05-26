import React,{useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Gateway.css';
import Header from '../components/Layout/Header'
import OtpInput from 'react-otp-input';
import axios from "axios";
//import toast from "react-hot-toast";

import { ToastContainer, toast } from 'react-toastify';
export default function GateWay()
{
  
  const navigate = useNavigate();
  const [showbtn1,setShowbtn1]=useState('block');
  const [showbtn2,setShowbtn2]=useState('none');
  const [showbtn3,setShowbtn3]=useState('none');
  const [otp, setOtp] = useState('');
  const [cart,setCart]=useState([]);


  useEffect(()=>{
    setCart(JSON.parse(localStorage.getItem("cart")))
  },[cart]);
  
  
  const verifyOTP=()=>{
    var config = {
      method: 'post',
      url: 'http://localhost:8080/newRoute/otp/validateotp',
      headers: { 
      'Content-Type': 'application/json'
      },
      data : ({
        'email': JSON.parse(localStorage.getItem('auth')).user.email,
        'otp': otp
        })
    };

  axios(config)
    .then((res) =>{
        if(res.data.status===200)
        {
          //toast.success('OTP verified !! Order is paid..');
         alert("Otp verified !!")
          //console.log("Cart:",cart);
          try {
            const { data } =  axios.post("http://localhost:8080/api/v1/product/braintree/payment", {
              cart,
            });
            localStorage.removeItem("cart");
            setCart([]);
            alert("Payment done !!")
           window.location.href="/dashboard/user/orders";
            
          } 
          catch (error) 
          {
            alert(error);
          }
        }
        else
        {
          alert(res.data.msg);
          setShowbtn1('block');
          setShowbtn2('none');
          setShowbtn3('none');
        }

      })
      .catch((err)=>{
        alert(err)
      })

   
  }

  const handlerPay=()=>{
    setOtp('');
  
    var config = {
      method: 'post',
      url: 'http://localhost:8080/newRoute/otp/otprequest',
      headers: { 
      'Content-Type': 'application/json'
      },
      data : ({
        'email': JSON.parse(localStorage.getItem('auth')).user.email
        })
     };

  axios(config)
      .then( (res) =>
      {
        if(res.data.status===200)
        {
          //toast.success(res.data.msg);
          setShowbtn1('none');
          setShowbtn2('block');
          setShowbtn3('block');
              
        }
        else
        {
          //toast.error(res.data.msg);
        }

      })
      .catch((err)=>{
        console.log(err);

      })

  }


    return (
        <>
       
      <Header/>
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
        <div class="container-fluid">
          <div class="row d-flex justify-content-center ">
            <div class="col-sm-12">
              <div class="card1 mx-auto">
                <p class="heading1">PAYMENT DETAILS</p>
                  <form class="card-details ">
                    <div class="form-group mb-0">
                                      <p class="text-warning1 mb-0">Card Number</p> 
                                      <input className="input1" type="text" name="card-num" placeholder="1234 5678 9012 3457" size="17" id="cno1" minlength="19" maxlength="19" />
                                      <img className="img1" src="data:image/png;base64,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" width="64px" height="60px" />
                                </div>

                                  <div class="form-group">
                                      <p class="text-warning1 mb-0">Cardholder's Name</p> <input className="input1" type="text" name="name" placeholder="Name" size="17" />
                                  </div>
                                  <div class="form-group pt-2">
                                    <div class="row d-flex">
                                      <div class="col-sm-4">
                                        <p class="text-warning1 mb-0">Expiration</p>
                                        <input className="input1" type="text" name="exp" placeholder="MM/YYYY" size="7" id="exp" minlength="7" maxlength="7" />
                                      </div>
                                      <div class="col-sm-3">
                                        <p class="text-warning1 mb-0" >Cvv</p>
                                        <input className="input1" type="password" name="cvv" placeholder="&#9679;&#9679;&#9679;" size="1" minlength="3" maxlength="3" />
                                      </div>
                                      <div class=" pt-3" style={{float:'right'}}>
                                        <button type="button" class="btn btn-success" onClick={handlerPay} style={{display:showbtn1}}>Pay &nbsp;&nbsp;
                                          <img src="https://cdn-icons-png.flaticon.com/128/892/892666.png" height={30} width={30} />
                                        </button>




                                        <div style={{display:showbtn3,marginBottom:'10px'}}>
                                            Input Otp :
                                            <OtpInput
                                              inputStyle={{height:'40px',width:'40px'}}
                                              style={{padding:'10px',height:'20px',width:'30px'}}
                                              value={otp}
                                              onChange={setOtp}
                                              numInputs={6}
                                              renderSeparator={<span>-</span>}
                                              renderInput={(props) => <input {...props} />}
                                            />
                                            
                                          </div>
              

                                      <button
                                        type='button'
                                        className='btn btn-primary'
                                        style={{display:showbtn2}}
                                        onClick={verifyOTP}
                                      >
                                        Verify OTP
                                      </button>



                                      </div>
                                    </div>
                                  </div>		
                  </form>
              </div>
            </div>
          </div>
        </div>

        </>
    );


    }