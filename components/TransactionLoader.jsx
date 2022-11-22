import React from "react";
import { DotLoader } from "react-spinners";
import { css } from "@emotion/react";

const cssOverride = css`
  display: block;
  margin: 0 auto;
  border-color: white;
`;

const TransactionLoader = () => {
  return (
    <div className="text-white h-96 w-72 flex flex-col justify-center items-center">
      <div className="font-semibold text-xl mb-12">
        Transaction in progress...
      </div>
      <DotLoader color={"#fff"} loading={true} css={cssOverride} size={50} />
    </div>
  );
};

export default TransactionLoader;
