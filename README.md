# Athares Browser

This is the public repository for the Athares web client. It contains all Athares web UI code and client-side logic.

## Getting Started

To get started developing on athares-browser, type the following commands into your terminal.

```
git clone https://github.com/atharesinc/athares-browser.git
cd athares-browser && yarn install
yarn start
```

You can also use `npm` if you prefer, both options work the same in this case.

### Prerequisites

At this time there are no additional requirements to develop on athares-browser

## Built With

...code from a lot of great open-source developers. This list is by no means exhaustive.

*   [React](https://reactjs.org/) - The web framework used
*   [Yarn](https://yarnpkg.com/en/) - Dependency Management
*   [Tachyons](http://tachyons.io/) - For better and more beautiful UIs
*   [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL Interface for remote data
*   [Yarn](https://yarnpkg.com/en/) - Dependency Management
*   [Tachyons](http://tachyons.io/) - For better and beautiful markup
*   [Feather Icons](https://feathericons.com/) Beautiful SVG Icons
*   [feather-icons-react](https://github.com/ianmiller347/feather-icons-react) For stellar react bindings
*   [GreenSock](https://greensock.com/gsap) The best animation library in the galaxy
*   [react-dropzone](https://react-dropzone.js.org/) React Drag & Drop File Input
*   [react-stylable-diff](https://github.com/davidmason/react-stylable-diff) Performant text diff
*   [Sweetalert](https://github.com/t4t5/sweetalert) Beautiful, extensible, non-blocking alert replacements

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

Each version outlines features that the platform must have to meet this version

#### 0.0.1

*   Complete & Responsive UI Flow

#### 0.0.1.3 - IN PROGRESS

*   Connected to GraphCool backend
*   Added Login/Registration/Logout
*   Click-around functional
*   Fixed orientation issue on image upload for mobile
*   PrivateRoute for /app
*   Added 404 page
*   Updated Login and Register page to use email
*   Added validation to login/register portal
*   Update User
*   Create Circle
*   Create Channel

#### ToDo

*   Login/Register, enter to submit
*   CirclesWrapper, images not showing up
*   Circle Homepage (for app/:circleID/)
*   Update User
*   Create Circle Validation
*   Create Channel Validation
*   Create DM
    *   Pre-wrap text box
*   Add Help page
*   Dumbed down index
*   Sign up for newsleter
    *   MailChimp/CampaignMonitor
*   CSS transitions for routes & everything else
*   Validate all input fields
*   XSS sanitize all fields
*   jslint (tabs -> spaces and such)
*   Components -> PureComponents if necessary
*   Pure Components -> Stateless if possible
*   Error Components
*   Style Loading Components
*   Emoji support
*   Reduce Mobile and DesktopLayout to 1 component?
*   Server-side rendering
*   Webworkers and PWA stuff
    *   caching images
    *   Request to be added to homescreen
    *   Inputs don't work on android?
*   Subtle device rotation parallax
*   404 page look good
*   Code splitting (react-loadable etc.)
*   Site/Circle news

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details
