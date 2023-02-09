/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useState, useRef, useEffect } from "react";
import requestRider from "../UserRequestRider/RequestRider.module.css";
import {
	Autocomplete,
	useJsApiLoader,
	useLoadScript,
} from "@react-google-maps/api";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../Ridermaps/Loading";
import axios from "axios";
import { toast } from "react-toastify";

import back from "../../assets/back.png";
import DemoNav from "../../components/Navbar/DemoNavbar";

const baseUrl = "http://localhost:4000";

function RequestRider() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({});
	// const [inputValue, setInputValue] = useState<string | number>();
	const inputRef = useRef<any | null>();
	const [searchResult, setSearchResult] = useState<any | null>()
	const [searchResult1, setSearchResult1] = useState<any | null>();
	const options = {
		componentRestrictions: { country: "ng", administrativeArea: "Edo" },
		fields: ["address_components", "geometry", "icon", "name"],
		types: ["establishment"],
	};

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await axios
				.post(`${baseUrl}/users/order-ride`, formData, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("signature")}`,
					},
				})
				.then((res) => {
					toast.success(res.data.message);
					setTimeout(() => {
						navigate("/user-dashboard");
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


	const { isLoaded } = useLoadScript({
		googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY as string,
		libraries: ["places"],
	});


	function onPickupPlaceChanged() {
		if (searchResult1 != null) {
			const place = searchResult1.getPlace();
			setFormData({ ...formData, pickupLocation: place.formatted_address });
		} else {
			alert("Please enter text");
		}
	}


	function onDropoffPlaceChanged() {
		if (searchResult != null) {
			const place = searchResult.getPlace();
			setFormData({ ...formData, dropOffLocation: place.formatted_address });
			// console.log(place)
			// geometry.viewport.la.hi
			// geometry.viewport.la.ya
		} else {
			alert("Please enter text");
		}
	}

	function onLoadp(autocomplete: any) {
		setSearchResult1(autocomplete);
	}

	function onLoad(autocomplete: any) {
		setSearchResult(autocomplete);
	}

	useEffect(() => {
	}, [formData]);


	if (!isLoaded) {
		return <Loading />;
	}

	return (
		<div className={requestRider.requestOverAll}>
			<DemoNav />
			<div className={requestRider.requestContainer}>
				<div className={requestRider.requestFirst}>
					<button className={requestRider.requestBtn}>
						<Link to="/user-dashboard">
							{" "}
							<img src={back} alt="back" />
						</Link>
					</button>

          <h4 className={requestRider.requestTitle}>Request a Rider</h4>

					<div className={requestRider.requestFirstLeft}>
						<form className={requestRider.userOrder_f} onSubmit={handleSubmit}>
							<label className={requestRider.requestLabel}>
								Pick up Location
							</label>

							<Autocomplete
								onLoad={onLoadp} 
								onPlaceChanged={()=> onPickupPlaceChanged()}
							>
								<input
									className={requestRider.requestInputAutoCplt}
									name="pickupLocation"
									type="text"
									onChange={handleChange}
									placeholder="Enter Pickup Location"
								/>
							</Autocomplete>
							<label className={requestRider.requestLabel}>
								Drop off Location
							</label>

							<Autocomplete 
							onLoad={onLoad} 
							onPlaceChanged={()=> onDropoffPlaceChanged()}
							>
								<input
									className={requestRider.requestInputAutoCplt}
									name="dropOffLocation"
									type="text"
									onChange={handleChange}
									placeholder="Enter Dropoff Location"
								/> 
							</Autocomplete>

							<label className={requestRider.requestLabel}>
								Drop off Phone Number
							</label>
							<input
								className={requestRider.requestInput}
								onChange={handleChange}
								pattern="[0-9]{11}"
								type="tel"
								placeholder="Enter drop off phone number"
								name="dropOffPhoneNumber"
								size={11}
								maxLength={14}
							/>

              <label className={requestRider.requestLabel}>
                Package Description
              </label>
              <input
                className={requestRider.requestInput}
                onChange={handleChange}
                type="text"
                placeholder="Enter Pickup Location"
                name="packageDescription"
              />

              <label className={requestRider.requestLabel}>Offer (NGN)</label>
              <input
                className={requestRider.requestInput}
                onChange={handleChange}
                type="number"
                placeholder="Enter an amount"
                name="offerAmount"
              />

							<label className={requestRider.requestLabel} htmlFor="cash">
								<input
									// className={requestRider.requestInput}
									onChange={handleChange}
									type="radio"
									id="cash"
									value="cash"
									placeholder="Enter an amount"
									name="paymentMethod"
								/>
								{" "}
								Cash
							</label>
							<label className={requestRider.requestLabel} htmlFor= "card">
								<input
									// className={requestRider.requestInput}
									onChange={handleChange}
									type="radio"
									placeholder="Enter an amount"
									id="card"
									value="card"
									name="paymentMethod"
								/>
								{" "}
								Card
							</label>
							
							{/* <Link to="/request-rider-success" className={requestRider.requestLink} ><input type="submit"  onClick={toggleModal} className={requestRider.requestSubmit} value="Order ride" /></Link> */}
							<input
								type="submit"
								onClick={handleSubmit}
								className={requestRider.requestSubmit}
								value="Order ride"
							/>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RequestRider;
