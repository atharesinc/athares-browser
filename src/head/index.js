import React from "react";
import { Helmet } from "react-helmet";

const defaultDesc =
  "Legislation and communication built on nano-blockchains. Athares is the only Athares Distributed Democracy Platform in the galaxy.";

const Head = ({ title = null, description = null }) => {
  return (
    <Helmet>
      <title>{title ? title : "Athares"}</title>
      <meta
        name="description"
        content={description ? description : defaultDesc}
      />
    </Helmet>
  );
};

export default Head;
