import { PureComponent } from 'react';

import { connect } from 'react-redux';

import { updateChannel, updateRevision } from '../../../store/state/actions';
import { withRouter } from 'react-router-dom';
// import { withGun } from 'react-gun';

class Constitution extends PureComponent {
    componentDidMount() {
        this.props.dispatch(updateChannel(null));
        this.props.dispatch(updateRevision(null));
        this.props.history.replace('/app');
    }
    render() {
        return null;
    }
}

function mapStateToProps(state) {
    return {};
}

export default withRouter(connect(mapStateToProps)(Constitution));
