import React from 'react';
import { Helmet } from 'react-helmet';
import { pull } from '../store/head/reducers';
import { connect } from 'react-redux';

const defaultDesc =
    'Legislation and communication built on nano-blockchains. Athares is the only Athares Distributed Democracy Platform in the galaxy.';

const Head = ({ title = null, description = null }) => {
    return (
        <Helmet>
            <title>{title ? title : 'Athares Distributed Democracy'}</title>
            <meta
                name='description'
                content={description ? description : defaultDesc}
            />
        </Helmet>
    );
};

function mapStateToProps(state) {
    return {
        title: pull(state, 'title'),
        description: pull(state, 'description')
    };
}
export default connect(mapStateToProps)(Head);
