/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// import NavbarProfile from "../../components/Navbar/NavbarProfile";
import DemoNav from "../../components/Navbar/DemoNavbar";
import React, { useState } from "react";
import dashboard_style from "./userDashboard.module.css";
import orderimg from "../../assets/Users_dashboard/orders.svg";
import msg1 from "../../assets/Users_dashboard/msg1.svg";
import msg2 from "../../assets/Users_dashboard/msg2.svg";
import overview from "../../assets/Users_dashboard/overview.svg";
import addresscontact from "../../assets/Users_dashboard/addresscontact.svg";
import emailcontact from "../../assets/Users_dashboard/emailcontact.svg";
import phonecontact from "../../assets/Users_dashboard/phonecontact.svg";
import { apiGet, apiGetAndAuth } from "../../utils/api/axios";
import { Link } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import profilePic from "../../assets/profilepic.png";
import { AiFillStar, AiOutlineClose } from "react-icons/ai";
import Success from "../../assets/Success.svg";
import modalStyle from "../UserRequestRider/Modal2.module.css";
import { FiMessageSquare } from "react-icons/fi";
// import Chat from "../../components/ChatModal/Chat";
import { MdOutlineEmail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { VscLocation } from "react-icons/vsc";
import { ImCancelCircle } from "react-icons/im";
import "../../components/ChatModal/Chat.css";
import { useEffect } from "react";
import Pusher from "pusher-js";

function removeTimeAndFormatDate(datetimeString: string): string {
  // Parse the input string using the Date object
  const date = new Date(datetimeString);
  // Use the Intl.DateTimeFormat object to format the date
  const options: any = {
    weekday: "short",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
}
// console.log("My date now:  " ,removeTimeAndConvertTo12HourFormat("2022-12-21T11:58:01.571Z"))
const UserDashboard = () => {
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [orders, setBiddings] = React.useState([]);
  const [completedOrders, setCompletedOrders] = React.useState(null);
  const [order, setOrder]: any = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rider, setRider]: any = React.useState([]);

  const [hide, setHide] = React.useState(false);
  // const [username, setUsername] = useState<string>('username')
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const nameUser = localStorage.getItem("userName");
  let allMessages: any = [];
  const handleChange = (e: any) => {
    setMessage(e.target.value);
  };
  const baseUrl = "http://localhost:4000/chat/messages";

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (message!== ""){
      await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nameUser,
          message,
          time:
            new Date(Date.now()).getHours() +
            ":" +
            new Date(Date.now()).getMinutes(),
        }),
      });
      setMessage("");
    }
    
  };

  // console.log(messages)

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("e6e0a271cc1dd441c02a", {
      cluster: "sa1",
    });

    const channel = pusher.subscribe("swiftRider");
    channel.bind("message", function (data: any) {
      allMessages.push(data);
      setMessages(allMessages);
    });
  }, []);
  //

  const handleClick = (orderId: number, status: string) => {
    console.log(status);
    if (status !== "pending") {
      const go = async (orderId: number) => {
        try {
          setLoading(true);
          const responses = await apiGet(`/users/my-order/${orderId}`);
          // console.log(responses);
          if (responses) {
            setLoading(false);
            await setOrder(responses.data.Order);
            //  setTimeout (() => {
            const ride = order.riderId;
            getRiderProfile(ride);
            //  }, 1000 )
          }
        } catch (error) {
          console.log(error);
        }
      };
      void go(orderId);
    }
  };
  // console.log("The orders are ", order.riderId);
  // const rideId: number = order.Order.riderId;
  // const sendMessage = async () => {
  // 	if (currentMessage !== "") {
  // 	  const messageData = {
  // 		room: room,
  // 		author: username,
  // 		message: currentMessage,
  // 		time:
  // 		  new Date(Date.now()).getHours() +
  // 		  ":" +
  // 		  new Date(Date.now()).getMinutes(),
  // 	  };

  // 	}
  //   };
  const getRiderProfile = (ride: number) => {
    const go1 = async (ride: number) => {
      try {
        setLoading(true);
        const rider = await apiGet(`/riders/rider-order-profile/${ride}`);
        console.log("This is rider", rider);

        if (rider) {
          setLoading(false);
          setRider(rider.data.order.rider);
          toggleModal2();
        }
      } catch (error) {
        console.log(error);
      }
    };
    void go1(ride);
  };

  const toggleModal = () => {
    setModal(!modal);
  };
  const toggleModal2 = () => {
    setModal2(!modal2);
  };

  const toggleChat = () => {
    //responsible for toggling the chat modal
    setHide(!hide);
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const access_token = localStorage.getItem("signature");
  console.log(access_token);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getBiddings = async () => {
    // e.preventDefault();
    try {
      const response = await apiGetAndAuth("/users/my-orders", {
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Bearer ${access_token}`,
        },
      });
      // console.log("myData: ", response?.data);
      setBiddings(response?.data?.rows);
      console.log("myData: ", response?.data);
    } catch (err) {
      console.error("get_all_order", err);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCompletedOrders = async () => {
    // e.preventDefault();
    try {
      const res = await apiGetAndAuth("/users/completed-orders", {
        headers: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Authorization: `Bearer ${access_token}`,
        },
      });
      setCompletedOrders(res?.data?.count);
    } catch (error) {
      // console.error("get_completed_order", error);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    if (
      container.scrollHeight - container.scrollTop ===
      container.clientHeight
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getBiddings();
    }
  };
  const call = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getBiddings();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCompletedOrders();
  }, []);
  return (
    <>
      {/* <NavbarProfile /> */}
      <DemoNav />
      <div className={dashboard_style.user_dashboard_parent_div}>
        <div className={dashboard_style.middle_container}>
          <h1 className={dashboard_style.viewoverH1}>
            <img src={overview} width="30px" height="30px" />
            Overview
          </h1>
          {/* <div className={dashboard_style.second_container}> */}
          <div className={dashboard_style.orders_container}>
            <div className={dashboard_style.top_orders}>
              <span id={dashboard_style.orders}>Total Orders</span>
              <Link
                to="/request-rider"
                className={dashboard_style.userDashboardLink}
              >
                {" "}
                <span id={dashboard_style.request}>Make a Request</span>
              </Link>
            </div>
            <hr />
            <div className={dashboard_style.bottom_orders}>
              <span>
                <strong id={dashboard_style.order_number}>
                  {completedOrders}
                </strong>
                <br />
                <br />
                <strong id={dashboard_style.orders_completed}>
                  Orders Completed
                </strong>
              </span>
              <span id={dashboard_style.image}>
                <img
                  src={orderimg}
                  id={dashboard_style.orders_image}
                  height="39.38px"
                  width="36.32px"
                />
              </span>
            </div>
          </div>
          <div className={dashboard_style.messages_container}>
            <p id={dashboard_style.messages}>Messages</p>
            <hr />
            <div id={dashboard_style.image_div}>
              <img
                id={dashboard_style.msg1}
                src={msg1}
                width="54px"
                height="49.5px"
              />
              <img
                id={dashboard_style.msg2}
                src={msg2}
                width="54px"
                height="38.4px"
              />
            </div>
            <div id={dashboard_style.no_messages}>
              <p id={dashboard_style.msgP}>No Messages</p>
              <br />
              <p id={dashboard_style.msgP2}>
                You curently do not have any message
              </p>
            </div>
          </div>
          <div
            className={dashboard_style.myorders_container}
            style={{ height: "350px", overflow: "scroll" }}
            onScroll={handleScroll}
          >
            <div className={dashboard_style.order_details}>
              <span id={dashboard_style.orderzz}>My Orders</span>
              <span className={dashboard_style.seeAll}>See all</span>
            </div>
            {/* <hr /> */}
            {/* biddings.length > 0 ? <Your code> : <>No data Available<></> */}
            {orders?.length > 0 ? (
              orders.map((bidding: any) => {
                const myStyle = {
                  backgroundColor:
                    bidding.status === "pending"
                      ? "rgba(252, 193, 52, 0.1)"
                      : " rgba(52, 168, 83, 0.1)",
                  color: bidding.status === "pending" ? "#F8B02B" : "#34A853",
                  cursor: "pointer",
                };
                return (
                  <div className={dashboard_style.order_stats} key={bidding.id}>
                    <span className={dashboard_style.date}>
                      {removeTimeAndFormatDate(bidding.createdAt)}
                    </span>
                    <span
                      className={dashboard_style.status}
                      onClick={() => handleClick(bidding.id, bidding.status)}
                      style={myStyle}
                    >
                      {bidding.status}
                    </span>
                    <br />
                    <br />
                    <strong className={dashboard_style.space}>
                      <span className={dashboard_style.orderNo}>
                        Order No - {bidding.orderNumber}
                      </span>
                      <span className={dashboard_style.amount}>
                        N{bidding.offerAmount}
                      </span>
                    </strong>
                  </div>
                );
              })
            ) : (
              <p className={dashboard_style.para}>No data available</p>
            )}
          </div>

          <div className={dashboard_style.contacts_container}>
              <div className={dashboard_style.contact}>
                <p className={dashboard_style.usContact1}>Contact us</p>
              </div>
              <hr />

              <div className={dashboard_style.bio}>
                <h4 className={dashboard_style.getIntouch1}>Get in touch</h4>
                <p className={dashboard_style.getInSend}>
                  Any question or remarks? Send us a message.
                </p>
              </div>
              <div
                className={dashboard_style.contactDetails}
                onClick={(e) => {
                  window.location.href = "mailto:hello@swiftrider.com";
                }}
              >
                <p className={dashboard_style.company_contacts}>
                  {" "}
                  <MdOutlineEmail style={{margin: "0px 10px"}}/>
                  <a className={dashboard_style.contact_details_link} href="#">
                    hello@swiftrider.com
                  </a>
                </p>
                <p className={dashboard_style.company_contacts}>
                  <BsTelephone style={{margin: "0px 10px"}}/>
                  <a
                    className={dashboard_style.contact_details_link}
                    href="tel:+2348062898015"
                  >
                    08062898015,
                  </a>{" "}
                  <a
                    className={dashboard_style.contact_details_link}
                    href="tel:+2347015950245"
                  >
                    07015950245
                  </a>
                </p>
                <p className={dashboard_style.company_contacts}>
                  <VscLocation style={{margin: "0px 10px"}}/>
                  <a href="#" className={dashboard_style.contact_details_link}>
                    25, Uhkorunmi street, Ohuhen, Edo
                  </a>
                </p>
              </div>
            </div>

        </div>


        <div>
          {modal2 && (
            <div className={modalStyle.modal}>
              <div className={modalStyle.overlay}> </div>
              <div className={modalStyle.modal_content}>
                <img
                  src={Success}
                  alt="success"
                  className={modalStyle.success}
                />
                <h5 className={modalStyle.modalName}>Order Accepted </h5>
                <p className={modalStyle.modalText}>
                  {" "}
                  Your order has been accepted by{" "}
                </p>
                <h5 className={modalStyle.modalTitle}>{rider.name}</h5>
                <div className={modalStyle.modalArrange}>
                  <button
                    className={modalStyle.modalBtn1}
                    onClick={toggleModal}
                  >
                    View Rider
                  </button>
                </div>
                <button
                  className={modalStyle.close_modal}
                  onClick={() => {
                    setOrder([]);
                    setRider([]);
                    toggleModal2();
                    // setModal2(false);
                  }}
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
            </div>
          )}
          {modal && (
            <div className={modalStyle.modal}>
              <div className={modalStyle.overlay}> </div>
              <div className={modalStyle.modal_content2}>
                <h5 className={modalStyle.modalName}>
                  Rider arriving in about 1:00:00{" "}
                </h5>
                <img
                  className={modalStyle.requestProfilePic}
                  src={rider.passport}
                  alt="profilePic"
                />
                <h5 className={modalStyle.modalTitle}>{rider.name}</h5>
                <p className={modalStyle.modalText}>{rider.phone}</p>
                <p className={modalStyle.modalNumber}> Lincense plate number</p>
                <p className={modalStyle.modalPlate}> {rider.plateNumber}</p>
                <p className={modalStyle.modalNo}>
                  {" "}
                  4.90 <AiFillStar />
                </p>
                <div className={modalStyle.modalArrange}>
                  <button
                    className={modalStyle.modalBtn3}
                    onClick={() => call(rider.phone)}
                  >
                    Call
                  </button>
                  <button className={modalStyle.modalBtn2}>Send Message</button>
                </div>
                <button
                  className={modalStyle.close_modal}
                  onClick={() => {
                    setOrder([]);
                    setRider([]);
                    toggleModal();
                    toggleModal2();
                    // setModal2(false);
                  }}
                >
                  <AiOutlineClose size={30} style={{ color: "red" }} />
                </button>
              </div>
            </div>
          )}
          {hide && (
            <div className={dashboard_style.chat_container_pa}>
              <span className={dashboard_style.chat_cancel_button}>
                <ImCancelCircle />
              </span>
              <div className="chat-window">
                <div className="chat-header">
                  <p>Hello {nameUser} chat with a rider</p>
                </div>
                <div className="chat-body">
                  <ScrollToBottom className="message-container">
                    {messages.map((user: any) => (
                      <div className="message" id={user.username === nameUser? "you" : "other"}>
                        <div>
                          <>
                            <div className="message-content">
                              <p>{user.message}</p>
                            </div>
                            <div className="message-meta">
                              <p id="author">{user.username}</p>
                              <p id="author">{user.time}</p>
                            </div>
                          </>
                        </div>
                      </div>
                    ))}
                  </ScrollToBottom>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="chat-footer">
                    <input
                      type="text"
                      value={message}
                      placeholder="type message here..."
                      onChange={handleChange}
                    />
                    <button onClick={handleSubmit}>&#9658;</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

      </div>
      <div>
        <FiMessageSquare
          style={{
            position: "fixed",
            bottom: "10px",
            right: "0",
            width: "100px",
            fontSize: "50px",
            opacity: "0.55",
            cursor: "pointer",
          }}
          onClick={toggleChat}
        />
        {/* {hide === true? <p></p>: (<Chat />)} */}
      </div>
    </>
  );
};
export default UserDashboard;
