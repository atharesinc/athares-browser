import React from "react";

const FAQ = props => {
    return (
        <ul className="list pl0 bg-white mt0">
            <h5 className="f6 ttu tracked black bg-white pa4 ma0" id="faqs">
                Frequently Asked Questions
            </h5>
            {faqs.map(f => (
                <a
                    className="f6 fw6 db blue link dim mb2 pl4"
                    href={`#${f.id}`}
                    key={f.id}
                >
                    {f.question}
                </a>
            ))}
            {faqs.map((f, i) => <Question key={i} {...f} />)}
        </ul>
    );
};

export default FAQ;

const Question = ({ question, text, links = [], id }) => (
    <li className="pa3 pa4-ns bb b--black-10" id={id}>
        <b className="db f3 mb3">{question}</b>
        <span className="f5 db lh-copy measure-wide mb2">{text}</span>
        {links.length !== 0 &&
            links.map((link, i) => (
                <a
                    className="f7 fw6 db blue link dim mb2"
                    href={link.url}
                    key={i}
                >
                    {link.text}
                </a>
            ))}
    </li>
);

const faqs = [
    {
        id: "what",
        question: "In simple terms, what is Athares?",
        text:
            'Athares is an app that allows people to create and manage their own government, called Circles. Whether it\'s a high school club or a burgeoning democracy, Athares "Distributed Democracy Platform" acts as a security-first foundation for involvement and policy.'
    },
    {
        id: "athares-ico",
        question: "Does Athares have a cryptocurrency?",
        text:
            "Due to volatility and unreliability with cryptocurrency, Athares does not have a listed cryptocurrency.  We are focusing on creating a mechanism that allows for individual Circles to issue their own in-house nano-currencies. These nano-currencies would be used to purchase goods and services within Circles, exchanged for other Circle's nano-currencies, or traded as a regular cryptocurrency on existing crypo-markets."
    },
    {
        id: "nano-blockchains",
        question: "What's all this buzz about nano-blockchains?",
        text:
            "Named only partly for it's cool-factor, every Circle is represented in a nano-blockchain. Each user is only responsible for the data in the Circles to which they belong, instead of having to store and process all records of everything ever done."
    },
    {
        id: "goals",

        question: "What is the goal of Athares?",
        text:
            "The origin of Athares lies in the nearing-prospect of a colony on Mars.  A new colony will need to govern itself, and would eventually fall into the same political pitfalls as modern, terrestrial governments. We want to get it right the first time. Our goal is to avoid the mistakes we've seen in hundreds of years on Earth.  We want to create socially equitable and responisble government to ensure the survival and success of humans on other planets. Our ultimate goal is to empower individuals (regardless of home-planet) to actively participate in their society, to culitvate a political awareness, and to liberate passive citizens from inadequate status-quo of many governments. Be the change you want to see in this world."
    },
    {
        id: "how-we-use-blockchains",
        question: "In what ways does Athares benefit from using blockchains?",
        text:
            "In order to truly be a platform for the people, Athares needs to be accessible on every device, anywhere in the galaxy, without an internet connection. Frankly, the technology to do this doesn't quite exist. We say Athares is \"as distributed as possible\" because we're adopting bleeding edge frameworks to keep data in the rightful hands of the users and working hard to develop everything else.  You can check out our progress at the link below and review our privacy policy regarding data and terms of service.",
        links: [
            {
                url: "./tos",
                text: "Privacy Policy and Data Usage"
            },
            {
                url: "./roadmap",
                text: "Athares Roadmap"
            }
        ]
    },
    {
        id: "why-distributed",

        question: "Distributed Democracy? What?",
        text:
            "Inspired by the Direct Democracy in Ancient Athens, Athares lets users vote on individual issues in their government. Removing representatives eliminates corruption, cuts government costs, and creates overnight progress.  In other models, people vote for the representatives, but little prevents these representatives from betraying their voters or from doing nothing."
    },
    {
        id: "why-not-direct",

        question: "Shouldn't it be a Direct Democracy?",
        text:
            'A resilient democracy needs to operate on a blockchain, so that no single person can control of the system. A direct democracy is the perfect use for a distributed technology, thus the name "Distributed Democracy": a direct democracy managed in a distributed system.'
    },
    {
        id: "what-are-blockchains",

        question: "Blockchains? Distributed systems?",
        text:
            "A blockchains is essentially a list of records that are inherently resistant to illegal modifications.  A distributed system is essentially a network of points where resources are shared to acheive a common goal (very broadly speaking).",
        links: [
            {
                url: "https://en.wikipedia.org/wiki/Blockchain",
                text: "Wikipedia Definition"
            },
            {
                url:
                    "https://blockgeeks.com/guides/what-is-blockchain-technology/",
                text:
                    "What is Blockchain Technology? A Step-by-Step Guide For Beginners"
            }
        ]
    },
    {
        id: "i-dont-understand-this",

        question:
            "I'm not a computer person and I don't understand any of this.",
        text:
            "All you need to know is Athares is a chat app with productivity tools for groups. It's like Messenger, with Slack, with Trello, and two scoops of freedom."
    },
    {
        id: "i-really-dont-understand-this",
        question:
            "I'm a computer person and I STILL don't understand any of this.",
        text:
            "It's like Github for legislation.  Create revisions like pull-requests, and merge them with your existing base."
    },
    {
        id: "how-to-get-started",
        question: "How can I use Athares today?",
        text:
            "Even if you're just looking for a new way of getting in touch with people, Athares is right for you. Included is a full suite of chat tools like video, voice, and text chat between pairs or groups of friends.  Are you a member of a club or organization? Try creating a new Circle and invite some peers. See what you can come up with when you work together!",
        links: [
            {
                url: "./login",
                text: "Login or create an account"
            }
        ]
    }
];
