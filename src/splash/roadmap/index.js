import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'react-redux';
import { updateDesc, updateTitle } from '../../store/head/actions';

class Roadmap extends React.Component {
    state = {
        scrolled: false,
        top: 0
    };
    handleUpdate = ({ scrollTop }) => {
        if (this.state.top !== scrollTop) {
            this.setState({ scrolled: scrollTop > 100, top: scrollTop });
        }
    };
    componentDidMount() {
        // Update meta tags
        this.props.dispatch(
            updateDesc("Where we are and where we're heading.")
        );
        this.props.dispatch(updateTitle('Athares - Roadmap'));
    }
    render() {
        return (
            <Scrollbars
                style={{ width: '100vw', height: '100vh' }}
                className='splash'
                onUpdate={this.handleUpdate}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
                universal={true}>
                <div id='roadmap-wrapper' className='splash'>
                    <Navbar {...this.state} top={this.state.top} />
                    <div className='ph3 ph5-ns pt6 sans-serif white'>
                        <div className='center mw9'>
                            <h3 className='f5 fw6 ttu tracked'>
                                Athares Distributed Democracy Platform
                            </h3>
                        </div>
                        <div className='cf w-100 center mw9'>
                            <blockquote className='fl w-100 mh0 mb4 mb5-ns border-box'>
                                <p className='f4 f2-m mt0 db fl w-100 f-subheadline-l lh-copy lh-title-l measure mb4 fw6'>
                                    Galactic Perspective with Individual Focus.
                                </p>
                            </blockquote>
                        </div>
                    </div>
                    <div className='w-100 bg-white black dib pb5 bb b--white-50 ph3 ph5-ns pt5'>
                        <p className='fl w-100 w-50-l mh0 mt0 pr0 pr3-l measure lh-copy f5 f5-l'>
                            The modern web has seen a tidal wave of increasingly
                            derivative projects with increasingly self-important
                            branding. Athares is the most ambitious project born
                            out of the web and the first ever platform where
                            "thinking globally" is still too narrow. In an
                            eventuality where humanity will move beyond Earth
                            and even beyond our solar system, we're building
                            software and infrastructure to sustain a galactic
                            civilization. Computing on colonies without the
                            servers, communicating over stellar distances, and
                            working towards a sustainable and free
                            multi-planetary utopia. Privatizing space
                            exploration, while presenting incredible
                            possibilities, has the side effect of astronomical
                            problems. The question of "who decides what" in a
                            burgeoning colony warrants immediate attention.
                        </p>
                        <p className='fl w-100 w-50-l mh0 mt0 pl0 pl3-l measure lh-copy f5 f5-l'>
                            Given equal resources, removed from historical
                            burden and terrestrial beholdings, and armed with
                            the opportunity to build a way of life from scratch,
                            a proto-society can sustain a direct democracy. We
                            can create a government for the people and by the
                            people. Technology like blockchains without the
                            trappings of the established order enables us to
                            build our societies right the first time. We can
                            build an economy that is a sharing economy by
                            default, with lightning fast and a truly distributed
                            banking system. It's a society eager to participate
                            in public debate being so equipped with equal access
                            to unbiased information, that can decide for itself
                            how to live.
                            <br />
                            <br />
                            <span className='fw6'>
                                Athares is the foundation for the new galactic
                                civilization.
                            </span>
                        </p>
                        <cite className='fl w-100 mt2 f5 f4-m f3-l fs-normal'>
                            <span className='fw6'>
                                And here's how we're going to do it.
                            </span>
                        </cite>
                    </div>

                    <div className='pt5 white'>
                        {stages.map((stage, i) => (
                            <article
                                className='cf ph3 ph5-ns'
                                key={stage.product}>
                                <header className='fn fl-ns w-50-ns pr4-ns'>
                                    <h1 className='mb3 mt0 lh-title'>
                                        {stage.product}
                                    </h1>
                                    <time className='f6 ttu tracked gray-70'>
                                        {stage.desc}
                                    </time>
                                    <dl className='fn-l w-50 w-auto-l lh-title mr5-l'>
                                        <dd className='f6 fw4 ml0'>Status</dd>
                                        <dd className='f5 fw6 ml0'>
                                            {stage.status}
                                        </dd>
                                    </dl>
                                </header>
                                <div className='fn fl-ns w-50-ns bl bw3 pl4'>
                                    <div className='lh-copy measure mt4 mt0-ns timeline-point'>
                                        <ul className='list pl0 measure center'>
                                            {stage.objectives.map(o => (
                                                <li
                                                    className='lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--white-50'
                                                    key={o}>
                                                    {o}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    <Footer />
                </div>
            </Scrollbars>
        );
    }
}
function mapStateToProps(state) {
    return {};
}
export default connect(mapStateToProps)(Roadmap);

let stages = [
    {
        product: 'Athares Core',
        desc: 'The Direct Democracy Platform',
        status: 'IN PROGRESS',
        objectives: [
            'Create government circles',
            'Draft amendments',
            'Vote on revisions',
            'Participate in public discussion',
            'Communicate privately in direct messages',
            'Get public news'
        ]
    },
    {
        product: 'Unyielding Heirophant',
        desc: 'Peer-Reviewed Public Broadcasting',
        status: 'COMING SOON',
        objectives: [
            'Press and media module',
            'Non-profit membership media organization',
            'Crowdsource journalism'
        ]
    },

    {
        product: 'Silent Cartographer',
        desc: ' Blockchain Distributed Services',
        status: 'COMING SOON',
        objectives: [
            'Athares brand smart-devices',
            'Server-free real-time communication',
            'Open-source Athares blockchain',
            'Athares Initial Coin Offering (ICO)'
        ]
    },
    {
        product: 'Particular Justice',
        desc: 'Elected executive management module',
        status: 'COMING SOON',
        objectives: [
            'Create custom government services',
            'Law enforcement command & control',
            'Manage government employees'
        ]
    },
    {
        product: 'High Charity',
        desc: 'Cryptocurrency economy',
        status: 'COMING SOON',
        objectives: [
            'Establish Athares Cryptocurrency as default tender',
            'Taxation module and provision for Circles',
            'Private enterprise API'
        ]
    }
];
