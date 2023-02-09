import { useEffect, useState } from "react";
import { apiGetAndAuth, apiPatch } from "../../utils/api/axios";
import bell from "../../assets/bell.svg";
import modalStyle from "./Modal2.module.css";
import { AiOutlineClose } from "react-icons/ai";

interface itemType {
  id: string;
  notificationType: string;
  riderId: string;
  orderId: string;
  userId: string;
  description: string;
  read: boolean;
}

export const NotificationAlert = () => {
  // state
  const [notify, setNotify] = useState<itemType[]>([]);
  const [modal2, setModal2] = useState(false);
  //
  const [read, setRead] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Get user signature
  const accessToken = localStorage.getItem("signature");

  const handleClick = async () => {
    try {
      const { data } = await apiGetAndAuth("/users/my-notification", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("data for notification==>", data.notify);
      console.log("I Was clicked!")
      setNotify(data?.notify);
      setNotificationCount(
        data?.notify.filter((item: any) => item.read === "false").length
      );
      setModal2((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("notificationCount==>", notificationCount);

  const itemClick = async (id: string) => {
    try {
      const data = await apiPatch(`/users/update-notification/${id}`, {
        read: true,
      });
      // console.log("My Arinze=>",data);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleClick();
  }, [setNotify]);

  return (
    <div>
      <div>
        <img
          src={bell}
          alt="notification"
          onClick={handleClick}
          className={modalStyle.bell}
        />
      </div>

      {modal2 && notify.length !== 0 ? (
        <div className={modalStyle.modal1}>
          {/* <div className={modalStyle.overlay}> </div> */}
          <div className={modalStyle.modal_content}>
            {notify.map((item: itemType) => (
              <div key={item.id}>
                <div className={modalStyle.orderText}>
                  <button
                    className={modalStyle.item_btn}
                    onClick={() => itemClick(item.id)}
                  >
                    Your {item.description} has been {item.notificationType}
                  </button>
                </div>
              </div>
            ))}

            <div className={modalStyle.close_modal}>
              <button onClick={() => setModal2(false)}>
                <AiOutlineClose size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={modalStyle.length} onClick={handleClick}>
            <span> {notificationCount}</span>
          </div>
        </>
      )}
    </div>
  );
};
