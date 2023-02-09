/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-misused-promises */
import rOtpVerify from "./OTPrider.module.css";
import OTPInputField from "react-otp-input";
import DemoNav from "../../components/Navbar/DemoNavbar";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "../../utils/api/axios";
import { toast } from "react-toastify";

const baseUrl = "http://localhost:4000";
const OTPrider = () => {
	const orderId = useParams();
	const [otp, setOtp] = useState("");
	const [formData] = useState({});
	const handleChange = (otp: any) => {
		setOtp(otp);
	};
	const handleSubmit = async (e: any, formData: any) => {
		e.preventDefault();
		try {
			if (orderId === null) {
				return console.log("no signature");
			}

			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			await axios
				.post(`${baseUrl}/riders/delivery-verify/${orderId}`, formData)
				.then((res) => {
					toast.success(res.data.message);
					setTimeout(() => {
						window.location.href = "/rider-dashboard";
					}, 2000);
				})
				.catch((err) => {
					console.log(err);
					toast.error(err.response.data.Error);
				});
		} catch (error) {
			console.log(error);
		}
	};
	const ResendOTP = () => {
		const orderId = localStorage.getItem("signature") as string;

		const go = async (signature: string) => {
			try {
				await axios
					.get(`${baseUrl}/riders/delivery-resend-otp/${orderId}`)
					.then((res) => {
						console.log(res.data);
						toast.success(res.data.message);
						// setTimeout(() => {
						// 	// window.location.href = "/riders-otp-verify";
						// }, 2000);
					});
			} catch (err: any) {
				console.log(err);
				toast.error(err.response.data.Error);
			}
		};

		void go(orderId);
	};

	return (
		<>
			<DemoNav />
			<div className={rOtpVerify.verifyContainer}>
				<div className={rOtpVerify.otpcard}>
					<div className={rOtpVerify.subverifyContainer}>
						<h3 className={rOtpVerify.verification}>OTP Verification</h3>
						<p className={rOtpVerify.pverification}>
							Fill in your OTP Verification code
						</p>
					</div>

					<form
						className={rOtpVerify.verifyForm}
						onSubmit={(e) => {
							void handleSubmit(e, formData);
						}}
					>
						<div className={rOtpVerify.verifyDiv}>
							{/* <label htmlFor="otp">OTP</label> */}
							<p className={rOtpVerify.otp}>OTP:</p>
							<br />
							<br />
							<div className="OTP-field">
								<OTPInputField
									value={otp}
									onChange={handleChange}
									numInputs={4}
									inputStyle={{
										// color: "black",
										boxSizing: "border-box",
										width: "2.6rem",
										padding: "16px",
										margin: "5px",
										border: "1px solid #d9d9d9",
										outline: "none",
										borderRadius: "5px",
										marginLeft: "10px",
										// backgroundColor: "#BDBDBD",
									}}
								/>
							</div>
						</div>
						<br />
						<div>
							<div>
								<button className={rOtpVerify.btnContainer} type="submit">
									Verify
								</button>
							</div>
						</div>
					</form>
					<p>
						Didn't get OTP?
						<Link className={rOtpVerify.final} to={""}>
							<span className={rOtpVerify.resend} onClick={ResendOTP}>
								Resend OTP
							</span>
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default OTPrider;
