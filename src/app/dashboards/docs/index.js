import React, { Component } from "react";
import Amendment from "./Amendment";
import DocsSearchBar from "./DocsSearchBar";

export default class index extends Component {
	render() {
		return (
			<div id="docs-wrapper" style={{ overflowY: "scroll" }}>
				<DocsSearchBar />
				<div id="docs-inner" className="pa2 pa4-ns">
					<div className="f2 pb2 b bb b--white-30 mv4 tc">
						The Bill of Rights & All Amendments
					</div>
					<div className="f3 b mv4">Preamble</div>
					<div className="f6 mt3 mb4">
						We the People of the United States, in Order to form a
						more perfect Union, establish Justice, insure domestic
						Tranquility, provide for the common defence, promote the
						general Welfare, and secure the Blessings of Liberty to
						ourselves and our Posterity, do ordain and establish
						this Constitution for the United States of America.
					</div>
					{sections.map((section, i) => (
						<Amendment
							key={i}
							updateItem={this.updateItem}
							amendment={section}
							addSub={this.addSub}
						/>
					))}
				</div>
			</div>
		);
	}
}

const sections = [
	{
		title: "Section 1",
		fontStyle: 4,
		id: 4,
		text:
			"All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives."
	},

	{
		title: "Section 2",
		fontStyle: 4,
		id: 6,
		parentId: 3,
		text:
			"The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature."
	},
	{
		title: "Section 1",
		fontStyle: 4,
		id: 4,
		text:
			"All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives."
	},

	{
		title: "Section 2",
		fontStyle: 4,
		id: 6,
		parentId: 3,
		text:
			"The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature."
	},
	{
		title: "Section 1",
		fontStyle: 4,
		id: 4,
		text:
			"All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives."
	},

	{
		title: "Section 2",
		fontStyle: 4,
		id: 6,
		parentId: 3,
		text:
			"The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature."
	}
];
