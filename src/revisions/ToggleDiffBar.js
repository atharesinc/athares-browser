import React from "react";
import FeatherIcon from "feather-icons-react";

const ToggleDiffBar = ({ toggle, mode }) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				borderTop: "1px solid #282a38"
			}}
			className="pa3"
		>
			<div
				onClick={() => {
					toggle(0);
				}}
				className={`mh3 ${mode === 0 ? "white" : "white-30"}`}
				style={styles.wrapper}
			>
				<FeatherIcon icon="check" />
				<div className="f7 ml2 dn db-ns">Final</div>
			</div>
			<div
				onClick={() => {
					toggle(1);
				}}
				className={`mh3 ${mode === 1 ? "white" : "white-30"}`}
				style={styles.wrapper}
			>
				<FeatherIcon icon="code" />
				<div className="f7 ml2 dn db-ns">Diff</div>
			</div>
			<div
				onClick={() => {
					toggle(2);
				}}
				className={`mh3 ${mode === 2 ? "white" : "white-30"}`}
				style={styles.wrapper}
			>
				<FeatherIcon icon="layout" />
				<div className="f7 ml2 dn db-ns">Side-By-Side</div>
			</div>
		</div>
	);
};

const styles = {
	wrapper: {
		display: "flex",
		justifyContent: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		cursor: "pointer"
	}
};
export default ToggleDiffBar;
