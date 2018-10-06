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

-   [React](https://reactjs.org/) - The web framework used
-   [Yarn](https://yarnpkg.com/en/) - Dependency Management
-   [Tachyons](http://tachyons.io/) - For better and more beautiful UIs
-   [Apollo Client](https://www.apollographql.com/docs/react/) - GraphQL Interface for remote data
-   [Yarn](https://yarnpkg.com/en/) - Dependency Management
-   [Tachyons](http://tachyons.io/) - For better and beautiful markup
-   [Feather Icons](https://feathericons.com/) Beautiful SVG Icons
-   [feather-icons-react](https://github.com/ianmiller347/feather-icons-react) For stellar react bindings
-   [GreenSock](https://greensock.com/gsap) The best animation library in the galaxy
-   [react-dropzone](https://react-dropzone.js.org/) React Drag & Drop File Input
-   [react-stylable-diff](https://github.com/davidmason/react-stylable-diff) Performant text diff
-   [Sweetalert](https://github.com/t4t5/sweetalert) Beautiful, extensible, non-blocking alert replacements

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

Each version outlines features that the platform must have to meet this version

#### 0.0.1

-   Complete & Responsive UI Flow

#### 0.0.1

-   Connected to GraphCool backend
-   Added Login/Registration/Logout
-   Click-around functional
-   Fixed orientation issue on image upload for mobile
-   PrivateRoute for /app
-   Added 404 page
-   Updated Login and Register page to use email
-   Added validation to login/register portal
-   Update User
-   Create Circle
-   Create Channel

#### 0.0.2

-   Replaced GraphCool with GunJS DB
-   Auth works everywhere consistently
-   Deprecated PrivateRoute for unauthenticated limited used
-   CreateChannel feature
-   Login/Register, enter to submit now works
-   Update User now works
-   Public channel messaging
-   Vote casting
-   Revision creation

#### 0.0.3 - IN PROGRESS

-   Live update circles and channel creation
-   Live updates for messages
-   Live updates for revisions and amendments
-   Revision checker and timer (see codesandbox example)

#### 0.0.4

-   Add user to circle
-   Encrypted Group Messages (limit group size)
-   Live updates for group messages
-   Add Help page
-   Dumbed down index

#### 0.0.5

-   Ensure public as possible use (not logged in, infer state from url)

#### 0.1.0

-   Express Server to serve data to peers and clients
-   Search (??? Elastic search?)

#### 0.1.1

-   Sign up for newsleter
    -   MailChimp
-   404 page look good
    -   onHover links

#### 0.1.2

-   Site/Circle news
    -   News items for each circle (created on amendment being passed or rejected, a revision deadline nearing, etc.)

#### 0.2.0

-   REST API

#### 0.3.0

-   GraphQL API

#### 0.3.5

-   Front-end data-management finalized
-   Validate all input fields (createCircle, createChannel, createRevision)
-   XSS sanitize all fields

#### 0.4.0 (Essential Nice-to-haves)

-   Emoji support
-   Support images and links in messages

#### 0.8.0

-   CSS transitions for routes & everything else
    -   Micro-interactions
-   Server-side rendering
-   Error Components
-   Microoptimizing
-   Webworkers and PWA stuff
    -   caching images
    -   Request to be added to homescreen
    -   Push notifictions?
        -   Is this even possible
    -   Inputs don't work on android?
        -   Possibly due to screen resizing?

#### 0.9.0

-   App functionally ready for alpha
-   jslint (tabs -> spaces and such)
-   Components -> PureComponents if necessary
-   Pure Components -> Stateless if possible
-   Code splitting (react-loadable etc.)

#### 1.0.0

-   Deployed to AWS (Somehow)
-   Capable of dealing with region-specific load-provisioning
-   Review AXE module of Gun progress

#### 1.0.1

-   App in alpha-review process

#### 1.0.1

-   Invitation Links/emails
    -   Probably a separate server

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details
