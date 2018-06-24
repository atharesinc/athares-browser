import React, { Component } from "react";
import Amendment from "./Amendment";
import DocsSearchBar from "./DocsSearchBar";
import { getActiveCircle, getCircleDocs } from "../../../graphql/queries";
import { compose, graphql } from "react-apollo";
import Loader from "../../Loader.js";
import Scrollbars from "react-custom-scroll";

class Constitution extends Component {
    componentDidMount() {
        this.props.getCircleDocs.refetch({
            id: this.props.getActiveCircle.activeCircle.id
        });
    }
    render() {
        const { error, loading, Circle } = this.props.getCircleDocs;
        console.log(Circle);

        if (error) {
            return null;
        }
        if (loading) {
            return (
                <div
                    id="docs-wrapper"
                    className="column-center"
                >
                    <Loader />
                    <div className="f3 pb2 b mv4 tc">Loading Constitution</div>
                </div>
            );
        }
        if (Circle) {
            return (
                <div id="docs-wrapper" >
                <Scrollbars>
                    <DocsSearchBar id={Circle.id} />
                    <div id="docs-inner" className="pa2 pa4-ns">
                        <div className="f2 pb2 b bb b--white-30 mv4 tc">
                            The Bill of Rights & All Amendments
                        </div>
                        <div className="f3 b mv4">Preamble</div>
                        <div className="f6 mt3 mb4">{Circle.preamble}</div>
                        {Circle.amendments.map((section, i) => (
                            <Amendment
                                key={i}
                                updateItem={this.updateItem}
                                amendment={section}
                                addSub={this.addSub}
                            />
                        ))}
                    </div>
                    </Scrollbars>
                </div>
            );
        } else {
            return <div id="docs-wrapper" style={{ overflowY: "scroll" }} />;
        }
    }
}
export default compose(
    graphql(getActiveCircle, { name: "getActiveCircle" }),
    graphql(getCircleDocs, {
        name: "getCircleDocs",
        options: ({ id }) => ({ variables: { id: id || "" } })
    })
)(Constitution);

// const sections = [
//  {
//      title: "Section 1",
//      fontStyle: 4,
//      id: 4,
//      text:
//          "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives."
//  },

//  {
//      title: "Section 2",
//      fontStyle: 4,
//      id: 6,
//      parentId: 3,
//      text:
//          "The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature."
//  },
//  {
//      title: "Section 1",
//      fontStyle: 4,
//      id: 4,
//      text:
//          "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives."
//  },

//  {
//      title: "Section 2",
//      fontStyle: 4,
//      id: 6,
//      parentId: 3,
//      text:
//          "The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature."
//  },
//  {
//      title: "Section 1",
//      fontStyle: 4,
//      id: 4,
//      text:
//          "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives."
//  },

//  {
//      title: "Section 2",
//      fontStyle: 4,
//      id: 6,
//      parentId: 3,
//      text:
//          "The House of Representatives shall be composed of Members chosen every second Year by the People of the several States, and the Electors in each State shall have the Qualifications requisite for Electors of the most numerous Branch of the State Legislature."
//  }
// ];
