import React from 'react';
import { withRouter } from 'react-router-dom';
import { closeSearch } from '../../store/ui/actions';
import { connect } from 'react-redux';

const Section = props => {
    let { data } = props;
    // Filter the items of this type that contain the search criteria
    // limit it to 10 items per section
    data = data
        .filter(
            item =>
                item[props.searchOn]
                    .toLowerCase()
                    .indexOf(props.search.toLowerCase()) !== -1
        )
        .slice(0, 10);

    const navigate = e => {
        const item = e.currentTarget;
        const id = item.getAttribute('data-id');
        const chosenItem = data.find(item => item.id === id);
        console.log(item, id, chosenItem);

        if (chosenItem) {
            const { history } = props;

            switch (id.substring(0, 2)) {
                case 'CI':
                    history.push(`/app/circle/${id}`);
                    break;
                case 'CH':
                    history.push(
                        `/app/circle/${chosenItem.circle}/channel/${id}`
                    );
                    break;
                case 'AM':
                    history.push(
                        `/app/circle/${chosenItem.circle}/constitution#${id}`
                    );
                    break;
                case 'RE':
                    history.push(
                        `/app/circle/${chosenItem.circle}/revision/${id}`
                    );
                    break;
            }
            props.dispatch(closeSearch());
        }
    };
    // If the user hasn't entered any search terms, or there are no results for this section, don't display the section
    if (props.search.trim() === '' || data.length === 0) {
        return null;
    }
    return (
        <div id='suggestion-items-wrapper'>
            <div className='suggestion-header'>{props.title.toUpperCase()}</div>
            <div />
            <div id='suggestion-items'>
                {data.map(item => {
                    return (
                        <div
                            className='suggestion-item'
                            key={item.id}
                            onClick={navigate}
                            data-id={item.id}>
                            {item[props.searchOn] +
                                (!item.preamble ? ' - ' + item.circleName : '')}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(withRouter(Section));
