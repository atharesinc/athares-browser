import React from "react";
import ReactAvatarEditor from "react-avatar-editor";
import Dropzone from "react-dropzone";
import Loader from "../../Loader";
import Slider from "rc-slider/lib/Slider";
import "rc-slider/assets/index.css";

export default class ImageUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			image: this.props.defaultImage,
			width:
				parseFloat(
					getComputedStyle(document.getElementById("root")).fontSize
				) * 15,
			height:
				parseFloat(
					getComputedStyle(document.getElementById("root")).fontSize
				) * 15,
			editMode: false,
			finalImage: this.props.defaultImage,
			loading: false,
			scale: 1
		};
	}
	componentDidUpdate() {
		// if (this.state.editMode) {
		// 	console.log(document.getElementById("create-circle-editor"));
		// 	this.draw();
		// }
	}
	handleDrop = dropped => {
		this.setState({ image: dropped[0] });
	};
	toggleEdit = () => {
		this.setState({ editMode: !this.state.editMode });
	};
	onClickSave = async () => {
		try {
			if (this.editor) {
				// This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
				// drawn on another canvas, or added to the DOM.
				let canvas = this.editor.getImage().toDataURL();
				// console.log(canvas);
				let imageURL;
				await fetch(canvas)
					.then(res => res.blob())
					.then(
						blob => (imageURL = window.URL.createObjectURL(blob))
					);

				this.setState(
					{ finalImage: imageURL, editMode: false, loading: false },
					() => {
						this.props.onSet(imageURL);
					}
				);
				// If you want the image resized to the canvas size (also a HTMLCanvasElement)
				// const canvasScaled = this.editor.getImageScaledToCanvas();
			}
		} catch (err) {
			throw new Error(err);
		}
	};
	onChange = () => {
		console.log(document.getElementById("imgFile").files);
		let file = document.getElementById("imgFile").files[0];
		let reader = new FileReader();
		reader.readAsDataURL(file);
		this.setState({ loading: true });
		reader.onloadend = e => {
			this.setState({ loading: false, image: reader.result });
		};
	};
	sliderChange = pos => {
		this.setState({
			scale: 1 + pos / 100
		});
	};
	setEditorRef = editor => (this.editor = editor);
	render() {
		let tempImage = this.state.image;

		if (!this.state.editMode) {
			return (
				<div className="mv4">
					<div
						style={{
							border: "5px solid #FFFFFF",
							height: this.state.height,
							width: this.state.width,
							borderRadius: "2px"
						}}
						className="row-center"
					>
						{/*<img
													src={this.state.finalImage}
													style={{
														height: "100%"
														// width: "100%"
													}}
													alt="icon"
													crossOrigin="Anonymous"
												/> */}
						<div
							style={{
								background: `url(${
									this.state.finalImage
								}) center no-repeat`,
								backgroundSize: "cover",
								height: "100%",
								minWidth: "100%"
							}}
						/>
					</div>
					<div
						className="btn mv2 tc"
						style={{ width: this.state.width / 2 - 10 }}
						onClick={this.toggleEdit}
					>
						Edit Icon
					</div>
				</div>
			);
		}
		if (this.state.loading) {
			return (
				<div className="mv4">
					<div
						className="horizontal"
						style={{
							border: "5px solid #FFFFFF",
							height: this.state.height,
							width: this.state.width,
							borderRadius: "2px",
							justifyContent: "center"
						}}
					>
						<Loader />
					</div>
				</div>
			);
		}
		return (
			<div className="mv4">
				<div>
					<Dropzone
						onDrop={this.handleDrop}
						multiple={false}
						accept={"image/*"}
						disableClick
						width={this.state.width}
						height={this.state.height}
						id="create-circle-dropzone"
						style={{
							border: "5px solid #FFFFFF",
							height: this.state.height,
							width: this.state.width,
							borderRadius: "2px"
						}}
					>
						<ReactAvatarEditor
							width={this.state.width - 30}
							height={this.state.height - 30}
							image={tempImage}
							ref={this.setEditorRef}
							id="create-circle-editor"
							border={10}
							scale={this.state.scale}
							crossOrigin={"anonymous"}
						/>
					</Dropzone>
				</div>
				<Slider
					min={0}
					max={100}
					defaultValue={0}
					onChange={this.sliderChange}
					className="mv3"
					style={{ width: this.state.width }}
				/>

				<input
					type="file"
					name="file"
					id="imgFile"
					onChange={this.onChange}
				/>
				<div className="horizontal">
					<div
						className="btn mv2 tc"
						style={{ width: this.state.width / 2 }}
					>
						<label htmlFor="imgFile">New</label>
					</div>
					<div
						className="btn mv2 tc"
						style={{ width: this.state.width / 2 }}
						onClick={this.onClickSave}
					>
						Set
					</div>
				</div>
				<small id="comment-desc" className="f6 white-80">
					Drag and drop or press "New" to change the image.
				</small>
			</div>
		);
	}
}
