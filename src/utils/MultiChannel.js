import React from "react";

const MultiChannel = ({ channel }) => {
	const { users = [], name = "", description = "", id } = channel;
	switch (users.length) {
		case 0:
			return null;
		/* case for user to send messages to themselves */
		case 1:
			return <OneUser user={users[0]} {...channel} />;
		/* most likely case -- a DM channel between two users */
		case 2:
			return <TwoUser {...channel} />;
		case 3:
			return <ThreeUser {...channel} />;
		default:
			return <MultiUser {...channel} />;
	}
};

export default MultiChannel;

//ehrlich AKA me
const exampleID = "9876sd9fg58sd";

const MultiUser = ({ users, id, name, description }) => {
	const visibleUsers = users.filter(u => u.id !== exampleID);

	return (
		<div
			className={`circle-img-wrapper channel-img-wrapper`}
			data-channel-id={id}
			data-channel-name={name}
		>
			{visibleUsers.map((u, i) => (
				<img
					src={u.icon}
					key={i}
					className="circle-img channel-img-4"
					alt=""
				/>
			))}
		</div>
	);
};

/*const MultiUser = ({ users, id, name, description }) => {
	const visibleUsers = users.filter(u => u.id !== exampleID);

	return (
		<div
			className={`circle-img-wrapper channel-img-wrapper`}
			data-channel-id={id}
			data-channel-name={name}
		>
			<div>
				<img
					src={visibleUsers[0].icon}
					className="circle-img channel-img-4"
					alt=""
				/>
			</div>
			<div>
				<img
					src={visibleUsers[1].icon}
					className="circle-img channel-img-4"
					alt=""
				/>
				<img
					src={visibleUsers[2].icon}
					className="circle-img channel-img-4"
					alt=""
				/>
			</div>
		</div>
	);
}; */

const ThreeUser = ({ users, id, name, description }) => {
	const visibleUsers = users.filter(u => u.id !== exampleID);

	return (
		<div
			className={`circle-img-wrapper`}
			data-channel-id={id}
			data-channel-name={name}
		>
			{visibleUsers.map((u, i) => (
				<img
					src={u.icon}
					key={i}
					className="circle-img channel-img-3"
					alt=""
				/>
			))}
		</div>
	);
};

const TwoUser = ({ users, id, name, description }) => {
	const visibleUser = users.filter(u => u.id !== exampleID)[0];

	return (
		<div
			className={`circle-img-wrapper`}
			data-channel-id={id}
			data-channel-name={name}
		>
			<img
				src={visibleUser.icon}
				className="circle-img channel-img-1"
				alt=""
			/>
		</div>
	);
};

const OneUser = ({ user, id, name, description }) => (
	<div
		className={`circle-img-wrapper`}
		data-channel-id={id}
		data-channel-name={name}
	>
		<img src={user.icon} className="circle-img channel-img-1" alt="" />
	</div>
);
