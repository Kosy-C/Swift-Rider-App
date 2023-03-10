/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import style from "./ProfileSetting.module.css";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import DemoNav from "../../components/Navbar/DemoNavbar";
import { apiPatchAuth } from "../../utils/api/axios";

function ProfileSetting() {
	const [dataValues, setDataValues] = useState<Record<string, any>>({});
	const navigate = useNavigate();
	const handleChange = (e: any) => {
		console.log("changing data");
		const { name, value } = e.target;
		setDataValues({ ...dataValues, [name]: value });
	};
	const handleSubmit = async (e: any) => {
		e.preventDefault();
		// console.log("this is formDatat", formData);
		const formData = new FormData();
		formData.append("email", dataValues.email);
		formData.append("name", dataValues.name);
		formData.append("phone", dataValues.phone);
		formData.append("photo", dataValues.passport);
		try {
			const signature = localStorage.getItem("signature");

			await apiPatchAuth("/users/updateUserProfile", formData, {
				headers: {
					Authorization: `Bearer ${signature}`,
				},
			})
				.then((res: any) => {
					console.log(res.data.User);
					localStorage.setItem("userName", res.data.User.name);
					localStorage.setItem("photo", res.data.User.passport);
					toast.success(res.data.message);
					setTimeout(() => {
						navigate("/user-dashboard");
					}, 2000);
				})
				.catch((err: any) => {
					console.log(err);
					toast.error(err.response.data.Error);
				});
		} catch (error) {
			console.log(error);
		}
	};
	const handleImageChange = (e: any) => {
		const { name } = e.target;
		const file = e.target.files[0];
		console.log("file", file);
		if (file.size > 1000000) {
			toast.error("file is too large");
			return;
		}

		if (!file.type.includes("image")) {
			toast.error("File must be an image");
		}
		setDataValues({ ...dataValues, [name]: file });
	};
	return (
		<div className={style.user__settings__div}>
			<DemoNav />
			<div className={style.user_settings_main}>
				<h1 className={style.user_settings_title}>Profile Settings</h1>
				<form className={style.user_settings_form} onSubmit={handleSubmit}>
					<div className={style.user_settings_form_title}>
						<h5 className={style.settings_b_info}>BASIC INFORMATION</h5>
						<p className={style.settings_p_info}>
							Only you can view and edit your information
						</p>
					</div>
					<div className={style.settings_f_fields}>
						<div className={style.settings_input_field}>
							<label htmlFor="fullname">image</label>
							<input
								className={style.settings_input_info}
								name="passport"
								id="name"
								type="file"
								placeholder="image"
								onChange={handleImageChange}
							/>
							<FaPencilAlt className={style.settings_pen} />
						</div>
						<div className={style.settings_input_field}>
							<label htmlFor="fullname">Full Name</label>
							<input
								className={style.settings_input_info}
								name="name"
								id="name"
								type="text"
								placeholder="name"
								onChange={handleChange}
							/>
							<FaPencilAlt className={style.settings_pen} />
						</div>
						<div className={style.settings_input_field}>
							<label htmlFor="phone number">Phone Number</label>
							<input
								className={style.settings_input_info}
								type={"tel"}
								id="phone"
								name="phone"
								placeholder="Phone Number"
								onChange={handleChange}
							/>
							<FaPencilAlt className={style.settings_pen} />
						</div>
						<div className={style.settings_input_field}>
							<label htmlFor="Email">Email Address</label>
							<input
								className={style.settings_input_info}
								type={"email"}
								name="email"
								id="email"
								placeholder="Email"
								onChange={handleChange}
							/>
							<FaPencilAlt className={style.settings_pen} />
						</div>
						<div className={style.settings_input_field}>
							<input
								className={style.settings_input_info}
								type={"submit"}
								value={"Submit"}
								style={{ backgroundColor: "#E02B45", color: "#fff" }}
							/>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
export default ProfileSetting;
/** ===================================================== */
// const Sett = () => {
// 	return (
// 		<div className={style.user__settings__div}>
// 			<DemoNav />
// 			<div className={style.user_settings_main}>
// 				<h1 className={style.user_settings_title}>Profile Settings</h1>
// 				<form className={style.user_settings_form} onSubmit={handleSubmit}>
// 					<div className={style.user_settings_form_title}>
// 						<h5 className={style.settings_b_info}>BASIC INFORMATION</h5>
// 						<p className={style.settings_p_info}>
// 							Only you can view and edit your information
// 						</p>
// 					</div>
// 					<div className={style.settings_f_fields}>
// 						<div className={style.settings_input_field}>
// 							<label htmlFor="fullname">Full Name</label>
// 							<input
// 								className={style.settings_input_info}
// 								name="name"
// 								id="name"
// 								type="text"
// 								placeholder="name"
// 								onChange={handleChange}
// 							/>
// 							<FaPencilAlt className={style.settings_pen} />
// 						</div>
// 						<div className={style.settings_input_field}>
// 							<label htmlFor="phone number">Phone Number</label>
// 							<input
// 								className={style.settings_input_info}
// 								type={"tel"}
// 								id="phone"
// 								name="phone"
// 								placeholder="Phone Number"
// 								onChange={handleChange}
// 							/>
// 							<FaPencilAlt className={style.settings_pen} />
// 						</div>
// 						<div className={style.settings_input_field}>
// 							<label htmlFor="Email">Email Address</label>
// 							<input
// 								className={style.settings_input_info}
// 								type={"email"}
// 								name="email"
// 								id="email"
// 								placeholder="Email"
// 								onChange={handleChange}
// 							/>
// 							<FaPencilAlt className={style.settings_pen} />
// 						</div>
// 						<div className={style.settings_input_field}>
// 							<input
// 								className={style.settings_input_info}
// 								type={"submit"}
// 								value={"Submit"}
// 								style={{ backgroundColor: "#E02B45", color: "#fff" }}
// 							/>
// 						</div>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Sett;
